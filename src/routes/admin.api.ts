import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";

import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";

type AdminAction =
  | { action: "updateVehicle"; id: string; data: Record<string, unknown> }
  | { action: "setPrice"; id: string; priceCents: number }
  | { action: "setFinancing"; id: string; financing: Record<string, unknown> }
  | { action: "setInventory"; id: string; published?: boolean; order?: number }
  | { action: "setStatus"; id: string; status: "disponivel" | "reservado" | "vendido"; reason?: string }
  | { action: "setFeatured"; id: string; featured: boolean }
  | { action: "addMedia"; id: string; objectKey: string; mimeType?: string; altText?: string; order?: number }
  | { action: "removeMedia"; mediaId: string };

type D1Row = Record<string, unknown>;

type RuntimeEnv = { DB: D1DatabaseLike };

const db = () => (env as unknown as RuntimeEnv).DB;

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function actor(request: Request) {
  return request.headers.get("cf-access-authenticated-user-email") ?? "cloudflare-access";
}

async function audit(database: D1DatabaseLike, request: Request, action: string, entityType: string, entityId: string | null, result: "success" | "failure", metadata: Record<string, unknown> = {}) {
  await database.prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), actor(request), action, entityType, entityId, result, new Date().toISOString(), JSON.stringify(metadata)).run();
}

function authorized(request: Request) {
  return Boolean(request.headers.get("cf-access-authenticated-user-email"));
}

async function getDashboard(database: D1DatabaseLike) {
  const [vehicles, media, audits] = await Promise.all([
    database.prepare(`SELECT v.*, i.published, i.display_order, i.entry_at, i.exit_at, vp.price_cents AS current_price_cents, vp.effective_at AS price_effective_at FROM vehicles v LEFT JOIN inventory_entries i ON i.vehicle_id = v.id LEFT JOIN vehicle_prices vp ON vp.id = (SELECT p.id FROM vehicle_prices p WHERE p.vehicle_id = v.id ORDER BY p.effective_at DESC LIMIT 1) ORDER BY v.created_at DESC`).all<D1Row>(),
    database.prepare(`SELECT m.id, m.vehicle_id, m.object_key, m.media_type, m.mime_type, m.display_order, m.alt_text, m.created_at FROM vehicle_media m ORDER BY m.vehicle_id, m.display_order, m.created_at`).all<D1Row>(),
    database.prepare(`SELECT id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json FROM audit_logs ORDER BY occurred_at DESC LIMIT 100`).all<D1Row>(),
  ]);
  return { vehicles: vehicles.results ?? [], media: media.results ?? [], audits: audits.results ?? [] };
}

async function executeAction(database: D1DatabaseLike, request: Request, input: AdminAction) {
  const now = new Date().toISOString();
  switch (input.action) {
    case "updateVehicle": {
      const allowed = new Set(["category", "brand", "model", "version", "year", "model_year", "mileage", "transmission", "fuel", "color", "description", "image_url", "images_json", "equipment_json", "technical_sheet_json", "financing_json", "seo_description", "cylinder_capacity", "vehicle_type"]);
      const entries = Object.entries(input.data).filter(([key]) => allowed.has(key));
      if (!entries.length) throw new Error("Nenhum campo válido foi informado.");
      const assignments = entries.map(([key]) => `${key} = ?`).join(", ");
      const values = entries.map(([, value]) => value);
      await database.prepare(`UPDATE vehicles SET ${assignments}, updated_at = ? WHERE id = ?`).bind(...values, now, input.id).run();
      await audit(database, request, "vehicle.update", "vehicle", input.id, "success", { fields: entries.map(([key]) => key) });
      return;
    }
    case "setPrice": {
      if (!Number.isInteger(input.priceCents) || input.priceCents < 0) throw new Error("Preço inválido.");
      await database.batch([
        database.prepare(`UPDATE vehicles SET price_cents = ?, updated_at = ? WHERE id = ?`).bind(input.priceCents, now, input.id),
        database.prepare(`INSERT INTO vehicle_prices (id, vehicle_id, price_cents, effective_at, created_at) VALUES (?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), input.id, input.priceCents, now, now),
      ]);
      await audit(database, request, "vehicle.price.update", "vehicle", input.id, "success", { priceCents: input.priceCents });
      return;
    }
    case "setFinancing": {
      const financing = JSON.stringify(input.financing);
      await database.prepare(`UPDATE vehicles SET financing_json = ?, updated_at = ? WHERE id = ?`).bind(financing, now, input.id).run();
      await audit(database, request, "vehicle.financing.update", "vehicle", input.id, "success", input.financing);
      return;
    }
    case "setInventory": {
      const existing = await database.prepare(`SELECT id FROM inventory_entries WHERE vehicle_id = ?`).bind(input.id).first<D1Row>();
      if (!existing) {
        await database.prepare(`INSERT INTO inventory_entries (id, vehicle_id, published, display_order, created_at, updated_at, entry_at) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), input.id, input.published ? 1 : 0, input.order ?? 0, now, now, now).run();
      } else {
        const sets: string[] = [];
        const values: unknown[] = [];
        if (input.published !== undefined) { sets.push("published = ?"); values.push(input.published ? 1 : 0); }
        if (input.order !== undefined) { sets.push("display_order = ?"); values.push(input.order); }
        if (sets.length) await database.prepare(`UPDATE inventory_entries SET ${sets.join(", ")}, updated_at = ? WHERE vehicle_id = ?`).bind(...values, now, input.id).run();
      }
      await audit(database, request, "inventory.update", "vehicle", input.id, "success", { published: input.published, order: input.order });
      return;
    }
    case "setStatus": {
      const current = await database.prepare(`SELECT status FROM vehicles WHERE id = ?`).bind(input.id).first<D1Row>();
      if (!current) throw new Error("Veículo não encontrado.");
      const from = String(current["status"]);
      await database.batch([
        database.prepare(`UPDATE vehicles SET status = ?, updated_at = ? WHERE id = ?`).bind(input.status, now, input.id),
        database.prepare(`INSERT INTO vehicle_status_history (id, vehicle_id, from_status, to_status, changed_at, reason) VALUES (?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), input.id, from, input.status, now, input.reason ?? null),
      ]);
      if (input.status === "vendido") await database.prepare(`UPDATE inventory_entries SET published = 0, exit_at = ?, updated_at = ? WHERE vehicle_id = ?`).bind(now, now, input.id).run();
      await audit(database, request, "vehicle.status.update", "vehicle", input.id, "success", { from, to: input.status, reason: input.reason });
      return;
    }
    case "setFeatured": {
      await database.prepare(`UPDATE vehicles SET featured = ?, updated_at = ? WHERE id = ?`).bind(input.featured ? 1 : 0, now, input.id).run();
      await audit(database, request, "vehicle.featured.update", "vehicle", input.id, "success", { featured: input.featured });
      return;
    }
    case "addMedia": {
      if (!input.objectKey.trim()) throw new Error("Chave da mídia é obrigatória.");
      await database.prepare(`INSERT INTO vehicle_media (id, vehicle_id, object_key, media_type, mime_type, display_order, alt_text, created_at, updated_at) VALUES (?, ?, ?, 'image', ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), input.id, input.objectKey.trim(), input.mimeType ?? "image/jpeg", input.order ?? 0, input.altText ?? null, now, now).run();
      await audit(database, request, "vehicle.media.add", "vehicle", input.id, "success", { objectKey: input.objectKey });
      return;
    }
    case "removeMedia": {
      const media = await database.prepare(`SELECT vehicle_id, object_key FROM vehicle_media WHERE id = ?`).bind(input.mediaId).first<D1Row>();
      if (!media) throw new Error("Mídia não encontrada.");
      await database.prepare(`DELETE FROM vehicle_media WHERE id = ?`).bind(input.mediaId).run();
      await audit(database, request, "vehicle.media.remove", "vehicle", String(media["vehicle_id"]), "success", { objectKey: media["object_key"] });
      return;
    }
  }
}

export const Route = createFileRoute("/admin/api")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
        return json(await getDashboard(db()));
      },
      POST: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
        try {
          const input = (await request.json()) as AdminAction;
          await executeAction(db(), request, input);
          return json({ ok: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Não foi possível executar a operação.";
          try { await audit(db(), request, "admin.action", "admin", null, "failure", { message }); } catch { /* A falha de auditoria não deve mascarar o erro original. */ }
          return json({ error: message }, 400);
        }
      },
    },
  },
});