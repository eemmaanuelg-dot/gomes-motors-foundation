import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";

import { mediaObjectKey, mediaPublicUrl, requireR2Bucket, type R2BucketLike } from "@/infrastructure/storage/r2-storage";
import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";
import { exceedsBodyLimit, hasAcceptableJsonContentType, isSameOriginRequest } from "@/lib/server-security";

type RuntimeEnv = { DB: D1DatabaseLike; MEDIA_BUCKET?: R2BucketLike };
const runtimeEnv = env as unknown as RuntimeEnv;

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_MULTIPART_BYTES = MAX_IMAGE_BYTES + 64 * 1024;
const MAX_JSON_BYTES = 16 * 1024;
const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function authorized(request: Request) {
  return Boolean(request.headers.get("cf-access-authenticated-user-email"));
}

function originError(request: Request) {
  if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);
  return null;
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

async function audit(database: D1DatabaseLike, request: Request, action: string, entityId: string | null, result: "success" | "failure", metadata: Record<string, unknown> = {}) {
  await database
    .prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, ?, ?, 'vehicle_media', ?, ?, ?, ?)`)
    .bind(crypto.randomUUID(), request.headers.get("cf-access-authenticated-user-email") ?? "cloudflare-access", action, entityId, result, new Date().toISOString(), JSON.stringify(metadata))
    .run();
}

async function getMedia(database: D1DatabaseLike, mediaId: string) {
  return database
    .prepare(`SELECT id, vehicle_id, object_key, mime_type, display_order, alt_text FROM vehicle_media WHERE id = ? LIMIT 1`)
    .bind(mediaId)
    .first<{ id: string; vehicle_id: string; object_key: string; mime_type: string; display_order: number; alt_text: string | null }>();
}

export const Route = createFileRoute("/admin/media")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
        const crossOriginError = originError(request);
        if (crossOriginError) return crossOriginError;
        if (exceedsBodyLimit(request, MAX_MULTIPART_BYTES)) return json({ error: "Arquivo excede o limite permitido de 10 MB." }, 413);

        let objectKey = "";
        try {
          const form = await request.formData();
          const vehicleId = String(form.get("vehicleId") ?? "").trim();
          const altText = String(form.get("altText") ?? "").trim().slice(0, 300);
          const orderValue = Number(form.get("order") ?? 0);
          const file = form.get("file");

          if (!vehicleId) throw new Error("Veículo é obrigatório.");
          if (!(file instanceof File)) throw new Error("Selecione uma imagem.");
          if (!MIME_TO_EXTENSION[file.type]) throw new Error("Formato não suportado. Use JPG, PNG, WebP ou AVIF.");
          if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) throw new Error("A imagem deve ter entre 1 byte e 10 MB.");

          const vehicle = await runtimeEnv.DB.prepare(`SELECT id FROM vehicles WHERE id = ? LIMIT 1`).bind(vehicleId).first<{ id: string }>();
          if (!vehicle) throw new Error("Veículo não encontrado.");

          const extension: string = MIME_TO_EXTENSION[file.type] ?? "";
          if (!extension) throw new Error("Formato de imagem não suportado.");
          objectKey = mediaObjectKey(vehicleId, extension);
          const bucket = requireR2Bucket(runtimeEnv.MEDIA_BUCKET);

          await bucket.put(objectKey, file, {
            httpMetadata: {
              contentType: file.type,
              cacheControl: "public, max-age=31536000, immutable",
            },
            customMetadata: {
              vehicleId,
              originalName: file.name.slice(0, 200),
            },
          });

          const now = new Date().toISOString();
          await runtimeEnv.DB.prepare(
            `INSERT INTO vehicle_media (id, vehicle_id, object_key, media_type, mime_type, display_order, alt_text, created_at, updated_at) VALUES (?, ?, ?, 'image', ?, ?, ?, ?, ?)`,
          ).bind(crypto.randomUUID(), vehicleId, objectKey, file.type, Number.isFinite(orderValue) ? Math.max(0, Math.trunc(orderValue)) : 0, altText || null, now, now).run();

          await audit(runtimeEnv.DB, request, "vehicle.media.upload", vehicleId, "success", { objectKey, mimeType: file.type, size: file.size });
          return json({ ok: true, objectKey, url: mediaPublicUrl(objectKey) });
        } catch (error) {
          if (objectKey) {
            try { await requireR2Bucket(runtimeEnv.MEDIA_BUCKET).delete(objectKey); } catch { /* evita mascarar o erro original */ }
          }
          const message = error instanceof Error ? error.message : "Não foi possível enviar a imagem.";
          try { await audit(runtimeEnv.DB, request, "vehicle.media.upload", null, "failure", { message }); } catch { /* auditoria não deve mascarar o erro original */ }
          return json({ error: message }, 400);
        }
      },
      PATCH: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
        const crossOriginError = originError(request);
        if (crossOriginError) return crossOriginError;
        if (!hasAcceptableJsonContentType(request)) return json({ error: "Content-Type inválido." }, 415);
        if (exceedsBodyLimit(request, MAX_JSON_BYTES)) return json({ error: "Payload excede o limite permitido." }, 413);

        try {
          const body = await request.json() as { action?: string; mediaId?: string; order?: number; altText?: string };
          const action = String(body.action ?? "").trim();
          const mediaId = String(body.mediaId ?? "").trim().slice(0, 120);
          if (!mediaId) throw new Error("Mídia é obrigatória.");

          const media = await getMedia(runtimeEnv.DB, mediaId);
          if (!media) throw new Error("Mídia não encontrada.");
          const now = new Date().toISOString();

          if (action === "setOrder") {
            const order = Number(body.order);
            if (!Number.isInteger(order) || order < 0 || order > 999) throw new Error("Ordem da mídia inválida.");
            await runtimeEnv.DB.prepare(`UPDATE vehicle_media SET display_order = ?, updated_at = ? WHERE id = ?`).bind(order, now, mediaId).run();
            await audit(runtimeEnv.DB, request, "vehicle.media.order.update", media.vehicle_id, "success", { mediaId, from: media.display_order, to: order });
            return json({ ok: true });
          }

          if (action === "setPrimary") {
            await runtimeEnv.DB.batch([
              runtimeEnv.DB.prepare(`UPDATE vehicle_media SET display_order = display_order + 1, updated_at = ? WHERE vehicle_id = ? AND id <> ?`).bind(now, media.vehicle_id, mediaId),
              runtimeEnv.DB.prepare(`UPDATE vehicle_media SET display_order = 0, updated_at = ? WHERE id = ?`).bind(now, mediaId),
            ]);
            await audit(runtimeEnv.DB, request, "vehicle.media.primary.update", media.vehicle_id, "success", { mediaId });
            return json({ ok: true });
          }

          if (action === "setAlt") {
            const altText = String(body.altText ?? "").trim().slice(0, 300);
            await runtimeEnv.DB.prepare(`UPDATE vehicle_media SET alt_text = ?, updated_at = ? WHERE id = ?`).bind(altText || null, now, mediaId).run();
            await audit(runtimeEnv.DB, request, "vehicle.media.alt.update", media.vehicle_id, "success", { mediaId });
            return json({ ok: true });
          }

          throw new Error("Ação de mídia inválida.");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Não foi possível atualizar a mídia.";
          try { await audit(runtimeEnv.DB, request, "vehicle.media.update", null, "failure", { message }); } catch { /* auditoria não deve mascarar o erro original */ }
          return json({ error: message }, 400);
        }
      },
      DELETE: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
        const crossOriginError = originError(request);
        if (crossOriginError) return crossOriginError;
        if (!hasAcceptableJsonContentType(request)) return json({ error: "Content-Type inválido." }, 415);
        if (exceedsBodyLimit(request, MAX_JSON_BYTES)) return json({ error: "Payload excede o limite permitido." }, 413);

        try {
          const body = await request.json() as { mediaId?: string };
          const mediaId = String(body.mediaId ?? "").trim().slice(0, 120);
          if (!mediaId) throw new Error("Mídia é obrigatória.");

          const media = await runtimeEnv.DB.prepare(`SELECT id, vehicle_id, object_key FROM vehicle_media WHERE id = ? LIMIT 1`).bind(mediaId).first<{ id: string; vehicle_id: string; object_key: string }>();
          if (!media) throw new Error("Mídia não encontrada.");

          await requireR2Bucket(runtimeEnv.MEDIA_BUCKET).delete(media.object_key);
          await runtimeEnv.DB.prepare(`DELETE FROM vehicle_media WHERE id = ?`).bind(mediaId).run();
          await audit(runtimeEnv.DB, request, "vehicle.media.delete", media.vehicle_id, "success", { objectKey: media.object_key });
          return json({ ok: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Não foi possível remover a mídia.";
          try { await audit(runtimeEnv.DB, request, "vehicle.media.delete", null, "failure", { message }); } catch { /* auditoria não deve mascarar o erro original */ }
          return json({ error: message }, 400);
        }
      },
    },
  },
});