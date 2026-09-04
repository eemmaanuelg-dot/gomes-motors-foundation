import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";

type AdminAction =
  | { action: "updateVehicle"; id: string; data: Record<string, unknown> }
  | { action: "deleteVehicle"; id: string }
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
const ALLOWED_STATUS = new Set(["disponivel", "reservado", "vendido"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}
function actor(request: Request) {
  return request.headers.get("cf-access-authenticated-user-email") ?? "cloudflare-access";
}
function authorized(request: Request) {
  return Boolean(request.headers.get("cf-access-authenticated-user-email"));
}
async function audit(database: D1DatabaseLike, request: Request, action: string, entityType: string, entityId: string | null, result: "success" | "failure", metadata: Record<string, unknown> = {}) {
  await database.prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), actor(request), action, entityType, entityId, result, new Date().toISOString(), JSON.stringify(metadata)).run();
}
async function requireVehicle(database: D1DatabaseLike, id: string) {
  const vehicle = await database.prepare(`SELECT id, status, price_cents FROM vehicles WHERE id = ? LIMIT 1`).bind(id).first<D1Row>();
  if (!vehicle) throw new Error("Veículo não encontrado.");
  return vehicle;
}
function finiteNonNegative(value: unknown, field: string) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw new Error(`${field} inválido.`);
  return n;
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
  if (input.action !== "removeMedia" && !input.id) throw new Error("Veículo é obrigatório.");

  switch (input.action) {
    case "updateVehicle": {
      await requireVehicle(database, input.id);
      const allowed = new Set(["category", "brand", "model", "version", "year", "model_year", "mileage", "transmission", "fuel", "color", "description", "image_url", "images_json", "equipment_json", "technical_sheet_json", "financing_json", "seo_description", "cylinder_capacity", "vehicle_type"]);
      const entries = Object.entries(input.data).filter(([key]) => allowed.has(key));
      if (!entries.length) throw new Error("Nenhum campo válido foi informado.");
      if (entries.some(([key, value]) => ["brand", "model"].includes(key) && !String(value ?? "").trim())) throw new Error("Marca e modelo são obrigatórios.");
      for (const [key, value] of entries) {
        if (["year", "model_year"].includes(key) && (!Number.isInteger(Number(value)) || Number(value) < 1900)) throw new Error(`${key === "year" ? "Ano" : "Ano do modelo"} inválido.`);
        if (key === "mileage" && (!Number.isInteger(Number(value)) || Number(value) < 0)) throw new Error("Quilometragem inválida.");
      }
      const assignments = entries.map(([key]) => `${key} = ?`).join(", ");
      await database.prepare(`UPDATE vehicles SET ${assignments}, updated_at = ? WHERE id = ?`).bind(...entries.map(([, value]) => value), now, input.id).run();
      await audit(database, request, "vehicle.update", "vehicle", input.id, "success", { fields: entries.map(([key]) => key) });
      return;
    }
    case "deleteVehicle": {
      await requireVehicle(database, input.id);
      const media = await database.prepare(`SELECT COUNT(*) AS count FROM vehicle_media WHERE vehicle_id = ?`).bind(input.id).first<D1Row>();
      if (Number(media?.["count"] ?? 0) > 0) throw new Error("Remova as mídias do veículo antes de excluí-lo.");
      await database.batch([
        database.prepare(`DELETE FROM vehicle_status_history WHERE vehicle_id = ?`).bind(input.id),
        database.prepare(`DELETE FROM vehicle_prices WHERE vehicle_id = ?`).bind(input.id),
        database.prepare(`DELETE FROM inventory_entries WHERE vehicle_id = ?`).bind(input.id),
        database.prepare(`DELETE FROM vehicles WHERE id = ?`).bind(input.id),
      ]);
      await audit(database, request, "vehicle.delete", "vehicle", input.id, "success");
      return;
    }
    case "setPrice": {
      await requireVehicle(database, input.id);
      if (!Number.isInteger(input.priceCents) || input.priceCents < 0) throw new Error("Preço inválido.");
      await database.batch([
        database.prepare(`UPDATE vehicles SET price_cents = ?, updated_at = ? WHERE id = ?`).bind(input.priceCents, now, input.id),
        database.prepare(`INSERT INTO vehicle_prices (id, vehicle_id, price_cents, effective_at, created_at) VALUES (?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), input.id, input.priceCents, now, now),
      ]);
      await audit(database, request, "vehicle.price.update", "vehicle", input.id, "success", { priceCents: input.priceCents });
      return;
    }
    case "setFinancing": {
      const vehicle = await requireVehicle(database, input.id);
      const financing = input.financing;
      const entry = finiteNonNegative(financing["entradaMinima"], "Entrada mínima");
      const rate = finiteNonNegative(financing["taxaIndicativa"], "Taxa indicativa");
      const terms = Array.isArray(financing["parcelas"]) ? financing["parcelas"].map(Number).filter((v) => Number.isInteger(v) && v > 0) : [];
      if (!terms.length) throw new Error("Informe pelo menos um prazo de financiamento.");
      if (entry > Number(vehicle["price_cents"] ?? 0)) throw new Error("A entrada mínima não pode ser maior que o preço do veículo.");
      const normalized = { entradaMinima: Math.round(entry), parcelas: terms, taxaIndicativa: rate };
      await database.prepare(`UPDATE vehicles SET financing_json = ?, updated_at = ? WHERE id = ?`).bind(JSON.stringify(normalized), now, input.id).run();
      await audit(database, request, "vehicle.financing.update", "vehicle", input.id, "success", normalized);
      return;
    }
    case "setInventory": {
      const vehicle = await requireVehicle(database, input.id);
      if (input.order !== undefined && (!Number.isInteger(input.order) || input.order < 0)) throw new Error("Ordem inválida.");
      if (input.published && String(vehicle["status"]) === "vendido") throw new Error("Veículo vendido não pode ser publicado.");
      const existing = await database.prepare(`SELECT id FROM inventory_entries WHERE vehicle_id = ?`).bind(input.id).first<D1Row>();
      if (!existing) await database.prepare(`INSERT INTO inventory_entries (id, vehicle_id, published, display_order, created_at, updated_at, entry_at) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), input.id, input.published ? 1 : 0, input.order ?? 0, now, now, now).run();
      else {
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
      if (!ALLOWED_STATUS.has(input.status)) throw new Error("Status inválido.");
      const current = await requireVehicle(database, input.id);
      const from = String(current["status"]);
      if (from === input.status) {
        await audit(database, request, "vehicle.status.update", "vehicle", input.id, "success", { from, to: input.status, unchanged: true });
        return;
      }
      const statements = [
        database.prepare(`UPDATE vehicles SET status = ?, updated_at = ? WHERE id = ?`).bind(input.status, now, input.id),
        database.prepare(`INSERT INTO vehicle_status_history (id, vehicle_id, from_status, to_status, changed_at, reason) VALUES (?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), input.id, from, input.status, now, input.reason ?? null),
      ];
      if (input.status === "vendido") statements.push(database.prepare(`UPDATE inventory_entries SET published = 0, exit_at = ?, updated_at = ? WHERE vehicle_id = ?`).bind(now, now, input.id));
      await database.batch(statements);
      await audit(database, request, "vehicle.status.update", "vehicle", input.id, "success", { from, to: input.status, reason: input.reason });
      return;
    }
    case "setFeatured": {
      await requireVehicle(database, input.id);
      await database.prepare(`UPDATE vehicles SET featured = ?, updated_at = ? WHERE id = ?`).bind(input.featured ? 1 : 0, now, input.id).run();
      await audit(database, request, "vehicle.featured.update", "vehicle", input.id, "success", { featured: input.featured });
      return;
    }
    case "addMedia": {
      await requireVehicle(database, input.id);
      const objectKey = input.objectKey.trim();
      if (!objectKey) throw new Error("Chave da mídia é obrigatória.");
      if (!objectKey.startsWith(`vehicles/${input.id}/`)) throw new Error("Chave de mídia não pertence ao veículo informado.");
      if (input.mimeType && !ALLOWED_MIME.has(input.mimeType)) throw new Error("Tipo MIME de mídia inválido.");
      if (input.order !== undefined && (!Number.isInteger(input.order) || input.order < 0)) throw new Error("Ordem da mídia inválida.");
      await database.prepare(`INSERT INTO vehicle_media (id, vehicle_id, object_key, media_type, mime_type, display_order, alt_text, created_at, updated_at) VALUES (?, ?, ?, 'image', ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), input.id, objectKey, input.mimeType ?? "image/jpeg", input.order ?? 0, input.altText ?? null, now, now).run();
      await audit(database, request, "vehicle.media.add", "vehicle", input.id, "success", { objectKey });
      return;
    }
    case "removeMedia": {
      const media = await database.prepare(`SELECT vehicle_id, object_key FROM vehicle_media WHERE id = ?`).bind(input.mediaId).first<D1Row>();
      if (!media) throw new Error("Mídia não encontrada.");
      await database.prepare(`DELETE FROM vehicle_media WHERE id = ?`).bind(input.mediaId).run();
      await audit(database, request, "vehicle.media.remove", "vehicle", String(media["vehicle_id"]), "success", { objectKey: media["object_key"] });
      return;
    }
    default:
      throw new Error("Operação administrativa inválida.");
  }
}

export const Route = createFileRoute("/admin/api")({ server: { handlers: {
  GET: async ({ request }) => { if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401); return json(await getDashboard(db())); },
  POST: async ({ request }) => { if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401); try { await executeAction(db(), request, await request.json() as AdminAction); return json({ ok: true }); } catch (error) { const message = error instanceof Error ? error.message : "Não foi possível executar a operação."; try { await audit(db(), request, "admin.action", "admin", null, "failure", { message }); } catch { /* preserve original error */ } return json({ error: message }, 400); } },
} } });
