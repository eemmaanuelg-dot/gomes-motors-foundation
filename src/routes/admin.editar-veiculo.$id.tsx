import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";

export const Route = createFileRoute("/admin/editar-veiculo/$id")({ component: EditVehiclePage });

type Vehicle = Record<string, unknown>;
type FormState = {
  category: string;
  brand: string;
  model: string;
  version: string;
  year: string;
  modelYear: string;
  mileage: string;
  price: string;
  status: "disponivel" | "reservado" | "vendido";
  transmission: string;
  fuel: string;
  color: string;
  vehicleType: string;
  cylinderCapacity: string;
  description: string;
  seoDescription: string;
  published: boolean;
  featured: boolean;
  displayOrder: string;
  entry: string;
  rate: string;
  terms: string;
  equipment: string;
  technical: string;
};

const EMPTY_FORM: FormState = {
  category: "carros", brand: "", model: "", version: "", year: "", modelYear: "", mileage: "0", price: "",
  status: "disponivel", transmission: "", fuel: "", color: "", vehicleType: "", cylinderCapacity: "",
  description: "", seoDescription: "", published: true, featured: false, displayOrder: "0", entry: "", rate: "1.89",
  terms: "24, 36, 48", equipment: "", technical: "",
};

function text(value: unknown) { return value == null ? "" : String(value); }
function numberString(value: unknown) { return value == null ? "" : String(value); }
function moneyToInput(value: unknown) { const cents = Number(value ?? 0); return Number.isFinite(cents) ? (cents / 100).toFixed(2).replace(".", ",") : ""; }
function jsonText(value: unknown, fallback: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return JSON.stringify(value, null, 2);
  return JSON.stringify(fallback, null, 2);
}
function parseJson(value: string, label: string) {
  try { return JSON.parse(value); } catch { throw new Error(`${label} deve conter JSON válido.`); }
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /></label>;
}

function EditVehiclePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    let ativo = true;
    const load = async () => {
      try {
        const response = await fetch("/admin/api", { headers: { Accept: "application/json" }, credentials: "include" });
        const data = await response.json() as { vehicles?: Vehicle[]; error?: string };
        if (!response.ok) throw new Error(data.error ?? "Não foi possível carregar o veículo.");
        const vehicle = (data.vehicles ?? []).find((item) => text(item["id"]) === id);
        if (!vehicle) throw new Error("Veículo não encontrado.");
        if (!ativo) return;
        const financing = vehicle["financing_json"] && typeof vehicle["financing_json"] === "string" ? JSON.parse(text(vehicle["financing_json"])) as Record<string, unknown> : (vehicle["financing_json"] as Record<string, unknown> | undefined);
        setForm({
          category: text(vehicle["category"]) || "carros",
          brand: text(vehicle["brand"]), model: text(vehicle["model"]), version: text(vehicle["version"]),
          year: numberString(vehicle["year"]), modelYear: numberString(vehicle["model_year"]), mileage: numberString(vehicle["mileage"] ?? 0),
          price: moneyToInput(vehicle["current_price_cents"] ?? vehicle["price_cents"]), status: (text(vehicle["status"]) || "disponivel") as FormState["status"],
          transmission: text(vehicle["transmission"]), fuel: text(vehicle["fuel"]), color: text(vehicle["color"]), vehicleType: text(vehicle["vehicle_type"]),
          cylinderCapacity: text(vehicle["cylinder_capacity"]), description: text(vehicle["description"]), seoDescription: text(vehicle["seo_description"]),
          published: Boolean(vehicle["published"]), featured: Boolean(vehicle["featured"]), displayOrder: numberString(vehicle["display_order"] ?? 0),
          entry: moneyToInput(financing?.["entradaMinima"]), rate: numberString(financing?.["taxaIndicativa"] ?? 1.89),
          terms: Array.isArray(financing?.["parcelas"]) ? financing["parcelas"].map(String).join(", ") : "24, 36, 48",
          equipment: jsonText(vehicle["equipment_json"], []), technical: jsonText(vehicle["technical_sheet_json"], { motor: "" }),
        });
      } catch (error) { if (ativo) setMessage(error instanceof Error ? error.message : "Não foi possível carregar o veículo."); }
      finally { if (ativo) setLoading(false); }
    };
    void load();
    return () => { ativo = false; };
  }, [id]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const priceCents = Math.round(Number(form.price.replace(".", "").replace(",", ".")) * 100);
      const entryCents = Math.round(Number((form.entry || "0").replace(".", "").replace(",", ".")) * 100);
      if (!form.brand.trim() || !form.model.trim()) throw new Error("Marca e modelo são obrigatórios.");
      if (!Number.isFinite(priceCents) || priceCents < 0) throw new Error("Informe um preço válido.");
      const data = {
        action: "updateVehicle", id, data: {
          category: form.category, brand: form.brand.trim(), model: form.model.trim(), version: form.version.trim() || null,
          year: Number(form.year), model_year: form.modelYear ? Number(form.modelYear) : null, mileage: Number(form.mileage),
          transmission: form.transmission.trim() || null, fuel: form.fuel.trim() || null, color: form.color.trim() || null,
          vehicle_type: form.vehicleType.trim() || null, cylinder_capacity: form.cylinderCapacity.trim() || null,
          description: form.description.trim(), seo_description: form.seoDescription.trim() || null,
          equipment_json: parseJson(form.equipment, "Equipamentos"), technical_sheet_json: parseJson(form.technical, "Ficha técnica"),
          price_cents: priceCents,
        },
      };
      let response = await fetch("/admin/api", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "include", body: JSON.stringify(data) });
      let result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível salvar os dados do veículo.");

      response = await fetch("/admin/api", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "include", body: JSON.stringify({ action: "setPrice", id, priceCents }) });
      result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível atualizar o preço.");

      const financing = { entradaMinima: entryCents, parcelas: form.terms.split(",").map((item) => Number(item.trim())).filter((item) => Number.isInteger(item) && item > 0), taxaIndicativa: Number(form.rate.replace(",", ".")) };
      response = await fetch("/admin/api", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "include", body: JSON.stringify({ action: "setFinancing", id, financing }) });
      result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível atualizar o financiamento.");

      response = await fetch("/admin/api", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "include", body: JSON.stringify({ action: "setStatus", id, status: form.status, reason: "Edição administrativa do veículo" }) });
      result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível atualizar o status.");

      response = await fetch("/admin/api", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "include", body: JSON.stringify({ action: "setFeatured", id, featured: form.featured }) });
      result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível atualizar o destaque.");

      response = await fetch("/admin/api", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "include", body: JSON.stringify({ action: "setInventory", id, published: form.published && form.status !== "vendido", order: Number(form.displayOrder) }) });
      result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível atualizar a publicação.");
      await navigate({ to: "/admin/estoque" });
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível salvar o veículo."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-12 text-sm text-muted-foreground">Carregando veículo…</div>;

  return <div className="min-h-[calc(100vh-120px)] bg-background"><div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
    <div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Painel administrativo</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Editar veículo</h1><p className="mt-2 text-sm text-muted-foreground">Atualize os dados sem alterar as relações de mídia e histórico.</p></div><Link to="/admin/estoque" className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><ArrowLeft className="h-4 w-4" />Voltar ao estoque</Link></div>
    {message && <div className="mb-5 rounded-sm border border-brand-red/30 bg-brand-red/5 px-4 py-3 text-sm text-brand-red">{message}</div>}
    <form onSubmit={submit} className="space-y-6">
      <section className="rounded-sm border border-border bg-card p-5 sm:p-6"><h2 className="font-bold">Identificação</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Categoria</span><select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm"><option value="carros">Carros</option><option value="motos">Motos</option></select></label>
        <Field label="Marca" value={form.brand} onChange={(v) => set("brand", v)} /><Field label="Modelo" value={form.model} onChange={(v) => set("model", v)} /><Field label="Versão" value={form.version} onChange={(v) => set("version", v)} /><Field label="Ano" value={form.year} onChange={(v) => set("year", v)} type="number" /><Field label="Ano do modelo" value={form.modelYear} onChange={(v) => set("modelYear", v)} type="number" /><Field label="Quilometragem" value={form.mileage} onChange={(v) => set("mileage", v)} type="number" /><Field label="Tipo do veículo" value={form.vehicleType} onChange={(v) => set("vehicleType", v)} /><Field label="Cilindrada" value={form.cylinderCapacity} onChange={(v) => set("cylinderCapacity", v)} />
      </div></section>
      <section className="rounded-sm border border-border bg-card p-5 sm:p-6"><h2 className="font-bold">Comercial</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Preço (R$)" value={form.price} onChange={(v) => set("price", v)} /><label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</span><select value={form.status} onChange={(e) => set("status", e.target.value as FormState["status"])} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm"><option value="disponivel">Disponível</option><option value="reservado">Reservado</option><option value="vendido">Vendido</option></select></label><Field label="Ordem de exibição" value={form.displayOrder} onChange={(v) => set("displayOrder", v)} type="number" /><Field label="Transmissão" value={form.transmission} onChange={(v) => set("transmission", v)} /><Field label="Combustível" value={form.fuel} onChange={(v) => set("fuel", v)} /><Field label="Cor" value={form.color} onChange={(v) => set("color", v)} /></div><div className="mt-5 flex flex-wrap gap-5 text-sm"><label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.published && form.status !== "vendido"} disabled={form.status === "vendido"} onChange={(e) => set("published", e.target.checked)} />Publicado no site</label><label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />Destacar veículo</label></div></section>
      <section className="rounded-sm border border-border bg-card p-5 sm:p-6"><h2 className="font-bold">Financiamento</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Entrada mínima (R$)" value={form.entry} onChange={(v) => set("entry", v)} /><Field label="Taxa indicativa (% a.m.)" value={form.rate} onChange={(v) => set("rate", v)} /><Field label="Prazos" value={form.terms} onChange={(v) => set("terms", v)} /></div><p className="mt-4 text-xs leading-relaxed text-muted-foreground">Parâmetros educativos: não representam aprovação ou proposta de crédito.</p></section>
      <section className="rounded-sm border border-border bg-card p-5 sm:p-6"><h2 className="font-bold">Conteúdo e SEO</h2><div className="mt-5 space-y-4"><label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Descrição</span><textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /></label><label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Descrição SEO</span><textarea value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} rows={3} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /></label></div></section>
      <section className="rounded-sm border border-border bg-card p-5 sm:p-6"><h2 className="font-bold">Dados técnicos avançados</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Mantidos como JSON para preservar o contrato atual do domínio e permitir edição sem perder campos técnicos.</p><div className="mt-5 grid gap-4 lg:grid-cols-2"><label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Equipamentos (JSON)</span><textarea value={form.equipment} onChange={(e) => set("equipment", e.target.value)} rows={12} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 font-mono text-xs outline-none focus:border-gold" /></label><label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Ficha técnica (JSON)</span><textarea value={form.technical} onChange={(e) => set("technical", e.target.value)} rows={12} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 font-mono text-xs outline-none focus:border-gold" /></label></div></section>
      <div className="flex justify-end gap-3"><Link to="/admin/estoque" className="rounded-sm border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary">Cancelar</Link><button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-sm bg-foreground px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Salvando…" : "Salvar alterações"}</button></div>
    </form>
  </div></div>;
}
