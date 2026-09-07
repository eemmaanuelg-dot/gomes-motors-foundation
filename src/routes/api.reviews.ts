import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";
import { exceedsBodyLimit, hasAcceptableJsonContentType, isSameOriginRequest } from "@/lib/server-security";

type RuntimeEnv = { DB: D1DatabaseLike };
type ReviewPayload = {
  customerName?: unknown;
  rating?: unknown;
  comment?: unknown;
  vehicleId?: unknown;
  consent?: unknown;
};

const database = () => (env as unknown as RuntimeEnv).DB;
const MAX_NAME = 120;
const MAX_COMMENT = 1200;
const MAX_BODY_BYTES = 16 * 1024;

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function text(value: unknown, field: string, maxLength: number, required = true) {
  const result = String(value ?? "").trim();
  if (required && !result) throw new Error(`${field} é obrigatório.`);
  if (result.length > maxLength) throw new Error(`${field} excede o limite permitido.`);
  return result;
}

export const Route = createFileRoute("/api/reviews")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);

        const db = database();
        const result = await db.prepare(`
          SELECT id, customer_name, rating, comment, vehicle_id, created_at
          FROM reviews
          WHERE status = 'aprovada'
          ORDER BY created_at DESC
          LIMIT 30
        `).all();

        return json({ reviews: result.results ?? [] });
      },
      POST: async ({ request }) => {
        if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);
        if (!hasAcceptableJsonContentType(request)) return json({ error: "Content-Type inválido." }, 415);
        if (exceedsBodyLimit(request, MAX_BODY_BYTES)) return json({ error: "Payload excede o limite permitido." }, 413);

        try {
          const body = (await request.json()) as ReviewPayload;
          const customerName = text(body.customerName, "Nome", MAX_NAME);
          const comment = text(body.comment, "Avaliação", MAX_COMMENT);
          const rating = Number(body.rating);
          if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error("A nota deve estar entre 1 e 5.");
          if (body.consent !== true) throw new Error("É necessário autorizar a publicação da avaliação.");

          const vehicleId = text(body.vehicleId, "Veículo", 120, false);
          const db = database();
          if (vehicleId) {
            const vehicle = await db.prepare(`SELECT id FROM vehicles WHERE id = ? LIMIT 1`).bind(vehicleId).first<{ id: string }>();
            if (!vehicle) throw new Error("Veículo não encontrado.");
          }

          const now = new Date().toISOString();
          const reviewId = crypto.randomUUID();
          await db.batch([
            db.prepare(`INSERT INTO reviews (id, customer_name, rating, comment, vehicle_id, source, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'site', 'pendente', ?, ?)`).bind(reviewId, customerName, rating, comment, vehicleId || null, now, now),
            db.prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, 'public-site', 'review.create', 'review', ?, 'success', ?, ?)`).bind(crypto.randomUUID(), reviewId, now, JSON.stringify({ rating, vehicleId: vehicleId || null })),
          ]);

          return json({ ok: true, reviewId, message: "Avaliação recebida e enviada para moderação." }, 201);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Não foi possível registrar a avaliação.";
          return json({ error: message }, 400);
        }
      },
    },
  },
});
