import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";
import { isSameOriginRequest } from "@/lib/server-security";

type RuntimeEnv = { DB: D1DatabaseLike };
const database = () => (env as unknown as RuntimeEnv).DB;
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const authorized = (request: Request) => Boolean(request.headers.get("cf-access-authenticated-user-email"));

export const Route = createFileRoute("/admin/reports/api")({ server: { handlers: { GET: async ({ request }) => {
  if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
  if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);
  const db = database();
  const [stock, leads, pipeline, evaluations, negotiations, reservations, sales, financing, analytics] = await Promise.all([
    db.prepare(`SELECT status, COUNT(*) AS total FROM vehicles GROUP BY status`).all(),
    db.prepare(`SELECT intent, COUNT(*) AS total FROM leads GROUP BY intent ORDER BY total DESC`).all(),
    db.prepare(`SELECT status, COUNT(*) AS total FROM leads GROUP BY status ORDER BY total DESC`).all(),
    db.prepare(`SELECT decision, COUNT(*) AS total FROM vehicle_evaluations GROUP BY decision`).all(),
    db.prepare(`SELECT stage, COUNT(*) AS total FROM negotiations GROUP BY stage`).all(),
    db.prepare(`SELECT status, COUNT(*) AS total FROM reservations GROUP BY status`).all(),
    db.prepare(`SELECT COUNT(*) AS total, COALESCE(SUM(final_price_cents), 0) AS gross_cents FROM sales`).first(),
    db.prepare(`SELECT status, COUNT(*) AS total FROM financing_operations GROUP BY status`).all(),
    db.prepare(`SELECT event_name, COUNT(*) AS total FROM analytics_events WHERE occurred_at >= datetime('now', '-30 days') GROUP BY event_name ORDER BY total DESC`).all(),
  ]);
  return json({ stock: stock.results ?? [], leadsByIntent: leads.results ?? [], leadsByStatus: pipeline.results ?? [], evaluations: evaluations.results ?? [], negotiations: negotiations.results ?? [], reservations: reservations.results ?? [], sales: sales ?? { total: 0, gross_cents: 0 }, financing: financing.results ?? [], analyticsLast30Days: analytics.results ?? [] });
} } } });
