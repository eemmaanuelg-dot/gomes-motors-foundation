import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";
import { exceedsBodyLimit, hasAcceptableJsonContentType, isSameOriginRequest } from "@/lib/server-security";

type RuntimeEnv = { DB: D1DatabaseLike };
type SettingsPayload = { settings?: Record<string, unknown> };
const database = () => (env as unknown as RuntimeEnv).DB;
const authorized = (request: Request) => Boolean(request.headers.get("cf-access-authenticated-user-email"));
const actor = (request: Request) => request.headers.get("cf-access-authenticated-user-email") ?? "cloudflare-access";
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const ALLOWED_KEYS = new Set(["whatsapp", "email", "businessHours", "publicFinancing", "leadSources", "adminResponsible"]);
const MAX_VALUE = 12000;

export const Route = createFileRoute("/admin/settings/api")({ server: { handlers: {
  GET: async ({ request }) => {
    if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
    if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);
    const result = await database().prepare(`SELECT key, value_json, updated_by, updated_at FROM commercial_settings ORDER BY key`).all();
    const settings = Object.fromEntries(
      (result.results ?? []).map((row) => {
        const item = row as { key: string; value_json: string };
        try {
          return [item.key, JSON.parse(item.value_json)];
        } catch {
          return [item.key, item.value_json];
        }
      }),
    );
    return json({ settings });
  },
  POST: async ({ request }) => {
    if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
    if (!isSameOriginRequest(request)) return json({ error: "Origem da requisição não permitida." }, 403);
    if (!hasAcceptableJsonContentType(request)) return json({ error: "Content-Type inválido." }, 415);
    if (exceedsBodyLimit(request)) return json({ error: "Payload administrativo excede o limite permitido." }, 413);
    try {
      const body = await request.json() as SettingsPayload; const settings = body.settings;
      if (!settings || typeof settings !== "object" || Array.isArray(settings)) throw new Error("Configurações inválidas.");
      const now = new Date().toISOString(); const statements = [] as ReturnType<D1DatabaseLike["prepare"]>[];
      for (const [key, value] of Object.entries(settings)) {
        if (!ALLOWED_KEYS.has(key)) throw new Error(`Configuração não permitida: ${key}.`);
        const serialized = JSON.stringify(value);
        if (serialized.length > MAX_VALUE) throw new Error(`Configuração ${key} excede o limite permitido.`);
        statements.push(database().prepare(`INSERT INTO commercial_settings (key, value_json, updated_by, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_by = excluded.updated_by, updated_at = excluded.updated_at`).bind(key, serialized, actor(request), now));
      }
      if (!statements.length) throw new Error("Nenhuma configuração foi informada.");
      await database().batch(statements);
      await database().prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, ?, 'settings.update', 'commercial_settings', NULL, 'success', ?, ?)`).bind(crypto.randomUUID(), actor(request), now, JSON.stringify({ keys: Object.keys(settings) })).run();
      return json({ ok: true });
    } catch (error) { return json({ error: error instanceof Error ? error.message : "Configurações não salvas." }, 400); }
  },
} } });
