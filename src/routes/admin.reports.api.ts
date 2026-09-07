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
  const [stock, leads, pipeline, evaluations, negotiations, reservations, sales, financing, analytics, reviews, conversion] = await Promise.all([
    db.prepare(`SELECT status, COUNT(*) AS total FROM vehicles GROUP BY status`).all(),
    db.prepare(`SELECT intent, COUNT(*) AS total FROM leads GROUP BY intent ORDER BY total DESC`).all(),
    db.prepare(`SELECT status, COUNT(*) AS total FROM leads GROUP BY status ORDER BY total DESC`).all(),
    db.prepare(`SELECT decision, COUNT(*) AS total FROM vehicle_evaluations GROUP BY decision`).all(),
    db.prepare(`SELECT stage, COUNT(*) AS total FROM negotiations GROUP BY stage`).all(),
    db.prepare(`SELECT status, COUNT(*) AS total FROM reservations GROUP BY status`).all(),
    db.prepare(`SELECT COUNT(*) AS total, COALESCE(SUM(final_price_cents), 0) AS gross_cents, COALESCE(AVG(final_price_cents), 0) AS average_cents FROM sales`).first(),
    db.prepare(`SELECT status, COUNT(*) AS total FROM financing_operations GROUP BY status`).all(),
    db.prepare(`SELECT event_name, COUNT(*) AS total FROM analytics_events WHERE occurred_at >= datetime('now', '-30 days') GROUP BY event_name ORDER BY total DESC`).all(),
    db.prepare(`SELECT status, COUNT(*) AS total FROM reviews GROUP BY status ORDER BY total DESC`).all(),
    db.prepare(`SELECT COUNT(*) AS total_leads, COALESCE(SUM(CASE WHEN status = 'convertido' THEN 1 ELSE 0 END), 0) AS converted_leads, COALESCE(SUM(CASE WHEN status = 'perdido' THEN 1 ELSE 0 END), 0) AS lost_leads FROM leads`).first(),
  ]);
  const totalLeads = Number((conversion as { total_leads?: number } | null)?.total_leads ?? 0);
  const convertedLeads = Number((conversion as { converted_leads?: number } | null)?.converted_leads ?? 0);
  return json({
    stock: stock.results ?? [],
    leadsByIntent: leads.results ?? [],
    leadsByStatus: pipeline.results ?? [],
    evaluations: evaluations.results ?? [],
    negotiations: negotiations.results ?? [],
    reservations: reservations.results ?? [],
    sales: sales ?? { total: 0, gross_cents: 0, average_cents: 0 },
    financing: financing.results ?? [],
    analyticsLast30Days: analytics.results ?? [],
    reviews: reviews.results ?? [],
    conversion: { totalLeads, convertedLeads, lostLeads: Number((conversion as { lost_leads?: number } | null)?.lost_leads ?? 0), ratePercent: totalLeads ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0 },
  });
} } } });