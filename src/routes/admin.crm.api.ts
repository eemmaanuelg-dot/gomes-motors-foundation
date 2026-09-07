import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";
import { exceedsBodyLimit, hasAcceptableJsonContentType, isSameOriginRequest } from "@/lib/server-security";

type RuntimeEnv = { DB: D1DatabaseLike };
type LeadAction = { action: "status" | "note" | "assign"; id: string; status?: string; note?: string; assignedTo?: string | null };
const database = () => (env as unknown as RuntimeEnv).DB;
const STATUSES = new Set(["novo", "em_atendimento", "aguardando_cliente", "proposta_enviada", "negociacao", "convertido", "perdido"]);

function json(data: unknown, status = 200) { return Response.json(data, { status, headers: { "Cache-Control": "no-store" } }); }
function authorized(request: Request) { return Boolean(request.headers.get("cf-access-authenticated-user-email")); }
function actor(request: Request) { return request.headers.get("cf-access-authenticated-user-email") ?? "cloudflare-access"; }

export const Route = createFileRoute("/admin/crm/api")({ server: { handlers: {
  GET: async ({ request }) => {
    if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
    if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);
    const db = database();
    const [leads, events, evaluations, negotiations, reservations, sales, financing] = await Promise.all([
      db.prepare(`SELECT l.*, v.brand, v.model, v.version FROM leads l LEFT JOIN vehicles v ON v.id = l.vehicle_id ORDER BY l.updated_at DESC LIMIT 250`).all(),
      db.prepare(`SELECT id, lead_id, event_type, from_status, to_status, actor_id, note, occurred_at FROM lead_events ORDER BY occurred_at DESC LIMIT 500`).all(),
      db.prepare(`SELECT * FROM vehicle_evaluations ORDER BY updated_at DESC LIMIT 100`).all(),
      db.prepare(`SELECT * FROM negotiations ORDER BY updated_at DESC LIMIT 100`).all(),
      db.prepare(`SELECT * FROM reservations ORDER BY updated_at DESC LIMIT 100`).all(),
      db.prepare(`SELECT * FROM sales ORDER BY sold_at DESC LIMIT 100`).all(),
      db.prepare(`SELECT * FROM financing_operations ORDER BY updated_at DESC LIMIT 100`).all(),
    ]);
    return json({ leads: leads.results ?? [], events: events.results ?? [], evaluations: evaluations.results ?? [], negotiations: negotiations.results ?? [], reservations: reservations.results ?? [], sales: sales.results ?? [], financing: financing.results ?? [] });
  },
  POST: async ({ request }) => {
    if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
    if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);
    if (!hasAcceptableJsonContentType(request)) return json({ error: "Content-Type inválido." }, 415);
    if (exceedsBodyLimit(request)) return json({ error: "Payload administrativo excede o limite permitido." }, 413);
    try {
      const input = await request.json() as LeadAction;
      const db = database();
      const lead = await db.prepare(`SELECT id, status, notes, assigned_to FROM leads WHERE id = ? LIMIT 1`).bind(input.id).first<{ id: string; status: string; notes: string | null; assigned_to: string | null }>();
      if (!lead) throw new Error("Lead não encontrado.");
      const now = new Date().toISOString();
      if (input.action === "status") {
        if (!input.status || !STATUSES.has(input.status)) throw new Error("Status de atendimento inválido.");
        await db.batch([
          db.prepare(`UPDATE leads SET status = ?, updated_at = ? WHERE id = ?`).bind(input.status, now, input.id),
          db.prepare(`INSERT INTO lead_events (id, lead_id, event_type, from_status, to_status, actor_id, note, occurred_at) VALUES (?, ?, 'status_changed', ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), input.id, lead.status, input.status, actor(request), input.note?.slice(0, 2000) ?? null, now),
          db.prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, ?, 'lead.status.update', 'lead', ?, 'success', ?, ?)`).bind(crypto.randomUUID(), actor(request), input.id, now, JSON.stringify({ from: lead.status, to: input.status })),
        ]);
      } else if (input.action === "note") {
        const note = String(input.note ?? "").trim();
        if (!note) throw new Error("Observação é obrigatória.");
        const merged = lead.notes ? `${lead.notes}\n[${now}] ${note}` : `[${now}] ${note}`;
        await db.batch([
          db.prepare(`UPDATE leads SET notes = ?, updated_at = ? WHERE id = ?`).bind(merged.slice(-10000), now, input.id),
          db.prepare(`INSERT INTO lead_events (id, lead_id, event_type, actor_id, note, occurred_at) VALUES (?, ?, 'note_added', ?, ?, ?)`).bind(crypto.randomUUID(), input.id, actor(request), note.slice(0, 2000), now),
          db.prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, ?, 'lead.note.add', 'lead', ?, 'success', ?, '{}')`).bind(crypto.randomUUID(), actor(request), input.id, now),
        ]);
      } else if (input.action === "assign") {
        const assignedTo = input.assignedTo ? String(input.assignedTo).trim().slice(0, 200) : null;
        await db.batch([
          db.prepare(`UPDATE leads SET assigned_to = ?, updated_at = ? WHERE id = ?`).bind(assignedTo, now, input.id),
          db.prepare(`INSERT INTO lead_events (id, lead_id, event_type, actor_id, note, occurred_at) VALUES (?, ?, 'assigned', ?, ?, ?)`).bind(crypto.randomUUID(), input.id, actor(request), assignedTo ? `Responsável: ${assignedTo}` : "Responsável removido", now),
          db.prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, ?, 'lead.assignment.update', 'lead', ?, 'success', ?, ?)`).bind(crypto.randomUUID(), actor(request), input.id, now, JSON.stringify({ assignedTo })),
        ]);
      } else throw new Error("Operação de CRM inválida.");
      return json({ ok: true });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Operação não concluída." }, 400);
    }
  },
} } });
