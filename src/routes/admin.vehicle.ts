import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";

type RuntimeEnv = { DB: D1DatabaseLike };
type VehiclePayload = { id?: unknown; category?: unknown; brand?: unknown; model?: unknown; version?: unknown; year?: unknown; model_year?: unknown; mileage?: unknown; priceCents?: unknown; status?: unknown; description?: unknown; transmission?: unknown; fuel?: unknown; color?: unknown; cylinder_capacity?: unknown; vehicle_type?: unknown; published?: unknown; featured?: unknown; displayOrder?: unknown; financing?: unknown };
type FinancingPayload = { entradaMinima?: unknown; taxaIndicativa?: unknown; parcelas?: unknown };
const database = () => (env as unknown as RuntimeEnv).DB;
const ALLOWED_STATUS = new Set(["disponivel", "reservado", "vendido"]);
const ALLOWED_CATEGORY = new Set(["carros", "motos"]);
function json(data: unknown, status = 200) { return Response.json(data, { status, headers: { "Cache-Control": "no-store" } }); }
function authorized(request: Request) { return Boolean(request.headers.get("cf-access-authenticated-user-email")); }
function actor(request: Request) { return request.headers.get("cf-access-authenticated-user-email") ?? "cloudflare-access"; }
async function audit(db: D1DatabaseLike, request: Request, action: string, entityId: string | null, result: "success" | "failure", metadata: Record<string, unknown> = {}) { await db.prepare(`INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json) VALUES (?, ?, ?, 'vehicle', ?, ?, ?, ?)`).bind(crypto.randomUUID(), actor(request), action, entityId, result, new Date().toISOString(), JSON.stringify(metadata)).run(); }
function requiredText(value: unknown, field: string) { const text = String(value ?? "").trim(); if (!text) throw new Error(`${field} é obrigatório.`); return text; }
function integer(value: unknown, field: string, minimum = 0) { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed < minimum) throw new Error(`${field} inválido.`); return parsed; }

export const Route = createFileRoute("/admin/vehicle")({ server: { handlers: { POST: async ({ request }) => {
  if (!authorized(request)) return json({ error: "Acesso administrativo não autenticado." }, 401);
  const db = database(); let vehicleId: string | null = null;
  try {
    const body = (await request.json()) as VehiclePayload;
    const category = requiredText(body["category"], "Categoria"); const brand = requiredText(body["brand"], "Marca"); const model = requiredText(body["model"], "Modelo");
    const version = String(body["version"] ?? "").trim() || null; const year = integer(body["year"], "Ano", 1900);
    const modelYearValue = body["model_year"] === undefined || body["model_year"] === null || body["model_year"] === "" ? null : integer(body["model_year"], "Ano do modelo", 1900);
    const mileage = integer(body["mileage"], "Quilometragem"); const priceCents = integer(body["priceCents"], "Preço", 0); const status = requiredText(body["status"] || "disponivel", "Status");
    const description = String(body["description"] ?? "").trim() || null; const transmission = String(body["transmission"] ?? "").trim() || null; const fuel = String(body["fuel"] ?? "").trim() || null; const color = String(body["color"] ?? "").trim() || null; const cylinderCapacity = String(body["cylinder_capacity"] ?? "").trim() || null; const vehicleType = String(body["vehicle_type"] ?? "").trim() || null;
    const published = Boolean(body["published"]) && status !== "vendido" ? 1 : 0; const featured = Boolean(body["featured"]) ? 1 : 0; const displayOrder = integer(body["displayOrder"] ?? 0, "Ordem", 0);
    const financing = (typeof body["financing"] === "object" && body["financing"] !== null ? body["financing"] : {}) as FinancingPayload;
    const entradaMinima = integer(financing["entradaMinima"] ?? 0, "Entrada mínima", 0); const taxaIndicativa = Number(financing["taxaIndicativa"] ?? 1.89);
    const parcelas = Array.isArray(financing["parcelas"]) ? financing["parcelas"].map(Number).filter((value) => Number.isInteger(value) && value > 0) : [24, 36, 48];
    if (!ALLOWED_CATEGORY.has(category)) throw new Error("Categoria inválida. Use carros ou motos."); if (!ALLOWED_STATUS.has(status)) throw new Error("Status inválido.");
    if (!Number.isFinite(taxaIndicativa) || taxaIndicativa < 0) throw new Error("Taxa indicativa inválida."); if (!parcelas.length) throw new Error("Informe pelo menos um prazo de financiamento.");
    vehicleId = requiredText(body["id"] || `${brand}-${model}-${year}-${crypto.randomUUID().slice(0, 8)}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"), "ID");
    const now = new Date().toISOString(); const existing = await db.prepare(`SELECT id FROM vehicles WHERE id = ? LIMIT 1`).bind(vehicleId).first<{ id: string }>(); if (existing) throw new Error("Já existe um veículo com este ID.");
    await db.batch([
      db.prepare(`INSERT INTO vehicles (id, category, brand, model, version, year, model_year, mileage, transmission, fuel, color, price_cents, status, condition, description, featured, created_at, updated_at, image_url, images_json, equipment_json, technical_sheet_json, financing_json, seo_description, cylinder_capacity, vehicle_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, '[]', '[]', '{}', ?, '', ?, ?)`).bind(vehicleId, category, brand, model, version, year, modelYearValue, mileage, transmission, fuel, color, priceCents, status, "seminovo", description, featured, now, now, JSON.stringify({ entradaMinima, parcelas, taxaIndicativa }), cylinderCapacity, vehicleType),
      db.prepare(`INSERT INTO vehicle_prices (id, vehicle_id, price_cents, effective_at, created_at) VALUES (?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), vehicleId, priceCents, now, now),
      db.prepare(`INSERT INTO inventory_entries (id, vehicle_id, published, display_order, created_at, updated_at, entry_at, exit_at) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`).bind(crypto.randomUUID(), vehicleId, published, displayOrder, now, now, now, now),
      db.prepare(`INSERT INTO vehicle_status_history (id, vehicle_id, from_status, to_status, changed_at, reason) VALUES (?, ?, NULL, ?, ?, ?)`).bind(crypto.randomUUID(), vehicleId, status, now, "Cadastro inicial pelo painel administrativo"),
    ]);
    await audit(db, request, "vehicle.create", vehicleId, "success", { category, brand, model, year, priceCents, status, published: Boolean(published) }); return json({ ok: true, id: vehicleId });
  } catch (error) { const message = error instanceof Error ? error.message : "Não foi possível cadastrar o veículo."; try { await audit(db, request, "vehicle.create", vehicleId, "failure", { message }); } catch { /* preserve original failure */ } return json({ error: message }, 400); }
} } } });
