import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";
import { exceedsBodyLimit, hasAcceptableJsonContentType, isSameOriginRequest } from "@/lib/server-security";

type RuntimeEnv = { DB: D1DatabaseLike };
type ReviewAction = { reviewId?: unknown; status?: unknown };

const database = () => (env as unknown as RuntimeEnv).DB;
const authorized = (request: Request) => Boolean(request.headers.get("cf-access-authenticated-user-email"));
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export const Route = createFileRoute("/admin/avaliacoes/api")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
        if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);

        const result = await database().prepare(`
          SELECT id, customer_name, rating, comment, vehicle_id, source, status, created_at, updated_at
          FROM reviews
          ORDER BY CASE status WHEN 'pendente' THEN 0 WHEN 'aprovada' THEN 1 ELSE 2 END, created_at DESC
          LIMIT 200
        `).all();
        return json({ reviews: result.results ?? [] });
      },
      POST: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
        if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);
        if (!hasAcceptableJsonContentType(request)) return json({ error: "Content-Type inválido." }, 415);
        if (exceedsBodyLimit(request, 16 * 1024)) return json({ error: "Payload excede o limite permitido." }, 413);

        try {
          const body = (await request.json()) as ReviewAction;
          const reviewId = String(body.reviewId ?? "").trim();
          const status = String(body.status ?? "").trim();
          if (!reviewId || reviewId.length > 120) throw new Error("Avaliação inválida.");
          if (status !== "aprovada" && status !== "rejeitada" && status !== "pendente") throw new Error("Status de avaliação inválido.");

          const db = database();
          const existing = await db.prepare(`SELECT id FROM reviews WHERE id = ? LIMIT 1`).bind(reviewId).first<{ id: string }>();
          if (!existing) throw new Error("Avaliação não encontrada.");

          const now = new Date().toISOString();
          const actor = request.headers.get("cf-access-authenticated-user-email")?.slice(0, 200) ?? "admin";
          await db.batch([
            db.prepare(`UPDATE reviews SET status = ?, updated_at = ? WHERE id = ?`).bind(status, now, reviewId),
            db.prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, ?, 'review.moderate', 'review', ?, 'success', ?, ?)`).bind(crypto.randomUUID(), actor, reviewId, now, JSON.stringify({ status })),
          ]);

          return json({ ok: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Não foi possível moderar a avaliação.";
          return json({ error: message }, 400);
        }
      },
    },
  },
});
