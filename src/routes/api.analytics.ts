import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";
import { exceedsBodyLimit, hasAcceptableJsonContentType, isSameOriginRequest } from "@/lib/server-security";

type RuntimeEnv = { DB: D1DatabaseLike };
type Payload = { eventName?: unknown; vehicleId?: unknown; leadId?: unknown; sessionId?: unknown; metadata?: unknown };
const database = () => (env as unknown as RuntimeEnv).DB;
const EVENTS = new Set(["page_view", "vehicle_view", "whatsapp_click", "favorite_add", "favorite_remove", "filter_use", "lead_intent", "simulation_complete", "simulation_cta"]);
const DEDUPE_WINDOW_SECONDS = 5;
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const short = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export const Route = createFileRoute("/api/analytics")({ server: { handlers: { POST: async ({ request }) => {
  if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);
  if (!hasAcceptableJsonContentType(request)) return json({ error: "Content-Type inválido." }, 415);
  if (exceedsBodyLimit(request, 32 * 1024)) return json({ error: "Payload excede o limite permitido." }, 413);
  try {
    const body = await request.json() as Payload; const eventName = short(body.eventName, 80); if (!EVENTS.has(eventName)) throw new Error("Evento de analytics não permitido.");
    const vehicleId = short(body.vehicleId, 120) || null; const leadId = short(body.leadId, 120) || null; const sessionId = short(body.sessionId, 120) || null;
    const metadata = body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata) ? JSON.stringify(body.metadata).slice(0, 4000) : null;
    const db = database();
    if (vehicleId) { const row = await db.prepare(`SELECT id FROM vehicles WHERE id = ? LIMIT 1`).bind(vehicleId).first<{ id: string }>(); if (!row) throw new Error("Veículo não encontrado."); }
    if (leadId) { const row = await db.prepare(`SELECT id FROM leads WHERE id = ? LIMIT 1`).bind(leadId).first<{ id: string }>(); if (!row) throw new Error("Lead não encontrado."); }
    if (sessionId) {
      const duplicate = await db.prepare(`SELECT id FROM analytics_events WHERE session_id = ? AND event_name = ? AND vehicle_id IS ? AND lead_id IS ? AND occurred_at >= datetime('now', ? || ' seconds') LIMIT 1`).bind(sessionId, eventName, vehicleId, leadId, `-${DEDUPE_WINDOW_SECONDS}`).first<{ id: string }>();
      if (duplicate) return json({ ok: true, deduplicated: true });
    }
    await db.prepare(`INSERT INTO analytics_events (id, event_name, vehicle_id, lead_id, session_id, metadata_json, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), eventName, vehicleId, leadId, sessionId, metadata, new Date().toISOString()).run();
    return json({ ok: true });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Evento não registrado." }, 400); }
} } } });
