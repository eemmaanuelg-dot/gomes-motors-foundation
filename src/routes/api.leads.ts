import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";
import { exceedsBodyLimit, hasAcceptableJsonContentType, isSameOriginRequest } from "@/lib/server-security";

type RuntimeEnv = { DB: D1DatabaseLike };
type LeadPayload = {
  customerName?: unknown;
  phone?: unknown;
  email?: unknown;
  source?: unknown;
  intent?: unknown;
  vehicleId?: unknown;
  message?: unknown;
  simulation?: unknown;
};

const database = () => (env as unknown as RuntimeEnv).DB;
const ALLOWED_INTENTS = new Set(["comprar", "trocar", "financiar", "vender", "consignar", "contato"]);
const MAX_TEXT = 2000;
const MAX_SOURCE = 100;

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function text(value: unknown, field: string, required = false) {
  const result = String(value ?? "").trim();
  if (required && !result) throw new Error(`${field} é obrigatório.`);
  if (result.length > MAX_TEXT) throw new Error(`${field} excede o limite permitido.`);
  return result;
}

function normalizePhone(value: unknown) {
  const phone = text(value, "Telefone");
  const digits = phone.replace(/\D/g, "");
  if (digits && (digits.length < 10 || digits.length > 15)) throw new Error("Telefone inválido.");
  return phone || null;
}

function normalizeEmail(value: unknown) {
  const email = text(value, "E-mail");
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido.");
  return email.toLowerCase();
}

function safeSimulation(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  for (const key of ["vehicleId", "entrada", "prazo", "taxaIndicativa", "parcelaEstimada"]) {
    const item = input[key];
    if (typeof item === "string" || typeof item === "number") output[key] = typeof item === "string" ? item.slice(0, 100) : item;
  }
  return Object.keys(output).length ? output : null;
}

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);
        if (!hasAcceptableJsonContentType(request)) return json({ error: "Content-Type inválido." }, 415);
        if (exceedsBodyLimit(request)) return json({ error: "Payload excede o limite permitido." }, 413);

        try {
          const body = (await request.json()) as LeadPayload;
          const customerName = text(body.customerName, "Nome", true);
          const phone = normalizePhone(body.phone);
          const email = normalizeEmail(body.email);
          const source = text(body.source, "Origem") || "site";
          const intent = text(body.intent, "Intenção", true);
          const vehicleId = text(body.vehicleId, "Veículo");
          const message = text(body.message, "Mensagem");
          if (!ALLOWED_INTENTS.has(intent)) throw new Error("Intenção de atendimento inválida.");
          if (!phone && !email) throw new Error("Informe telefone ou e-mail para retorno.");

          const db = database();
          if (vehicleId) {
            const vehicle = await db.prepare(`SELECT id FROM vehicles WHERE id = ? LIMIT 1`).bind(vehicleId).first<{ id: string }>();
            if (!vehicle) throw new Error("Veículo não encontrado.");
          }

          const now = new Date().toISOString();
          const leadId = crypto.randomUUID();
          const simulation = safeSimulation(body.simulation);
          const simulationVehicleId = typeof simulation?.vehicleId === "string" ? simulation.vehicleId.trim() : "";

          if (simulationVehicleId) {
            const vehicle = await db.prepare(`SELECT id FROM vehicles WHERE id = ? LIMIT 1`).bind(simulationVehicleId).first<{ id: string }>();
            if (!vehicle) throw new Error("Veículo da simulação não encontrado.");
          }

          if (simulationVehicleId && vehicleId && simulationVehicleId !== vehicleId) {
            throw new Error("O veículo da simulação não corresponde ao veículo informado.");
          }

          const note = simulation ? `Simulação pública: ${JSON.stringify(simulation).slice(0, 1200)}` : null;

          await db.batch([
            db.prepare(`INSERT INTO leads (id, customer_name, customer_phone, customer_email, source, intent, status, assigned_to, vehicle_id, message, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'novo', NULL, ?, ?, ?, ?, ?)`).bind(leadId, customerName, phone, email, source.slice(0, MAX_SOURCE), intent, vehicleId || simulationVehicleId || null, message || null, note, now, now),
            db.prepare(`INSERT INTO lead_events (id, lead_id, event_type, from_status, to_status, actor_id, note, occurred_at) VALUES (?, ?, 'created', NULL, 'novo', 'public-site', ?, ?)`).bind(crypto.randomUUID(), leadId, note, now),
            db.prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, 'public-site', 'lead.create', 'lead', ?, 'success', ?, ?)`).bind(crypto.randomUUID(), leadId, now, JSON.stringify({ intent, source: source.slice(0, MAX_SOURCE), hasSimulation: Boolean(simulation) })),
          ]);

          return json({ ok: true, leadId });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Não foi possível registrar o atendimento.";
          return json({ error: message }, 400);
        }
      },
    },
  },
});
