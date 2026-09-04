import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, RefreshCw, Save } from "lucide-react";

export const Route = createFileRoute("/admin/estoque")({ component: AdminStockPage });

type Vehicle = {
  id: string; category?: string; brand: string; model: string; version?: string | null; year?: number; mileage?: number;
  priceCents?: number; status: string; featured?: boolean; published?: boolean; displayOrder?: number;
};
type Dashboard = { vehicles?: Vehicle[] };

function money(cents = 0) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100); }

function AdminStockPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/admin/api", { headers: { Accept: "application/json" }, credentials: "include" });
      const data = await response.json() as Dashboard & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível carregar o estoque.");
      setVehicles(data.vehicles ?? []);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível carregar o estoque."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => vehicles.filter((vehicle) => {
    const text = `${vehicle.brand} ${vehicle.model} ${vehicle.version ?? ""}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (statusFilter === "todos" || vehicle.status === statusFilter);
  }), [vehicles, query, statusFilter]);

  const action = async (vehicle: Vehicle, actionName: string, payload: Record<string, unknown>) => {
    setSaving(vehicle.id); setMessage("");
    try {
      const response = await fetch("/admin/api", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "include", body: JSON.stringify({ action: actionName, vehicleId: vehicle.id, ...payload }) });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Operação não concluída.");
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Operação não concluída."); }
    finally { setSaving(null); }
  };

  return <div className="min-h-[calc(100vh-120px)] bg-background"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Operação administrativa</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Estoque</h1><p className="mt-2 text-sm text-muted-foreground">Controle operacional do estoque conectado ao D1.</p></div><div className="flex gap-2"><button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><RefreshCw className="h-4 w-4" />Atualizar</button><Link to="/admin/novo-veiculo" className="inline-flex items-center gap-2 rounded-sm bg-foreground px-3 py-2 text-sm font-semibold text-background"><Plus className="h-4 w-4" />Novo veículo</Link><Link to="/admin" className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><ArrowLeft className="h-4 w-4" />Admin</Link></div></div>
    {message && <div className="mb-5 rounded-sm border border-brand-red/30 bg-brand-red/5 px-4 py-3 text-sm text-brand-red">{message}</div>}
    <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_220px]"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar marca, modelo ou versão" className="rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm"><option value="todos">Todos os status</option><option value="disponivel">Disponíveis</option><option value="reservado">Reservados</option><option value="vendido">Vendidos</option></select></div>
    {loading ? <div className="rounded-sm border border-border bg-card p-8 text-center text-sm text-muted-foreground">Carregando estoque…</div> : <div className="space-y-3">{filtered.map((vehicle) => <VehicleRow key={vehicle.id} vehicle={vehicle} saving={saving === vehicle.id} onAction={action} />)}{!filtered.length && <div className="rounded-sm border border-border bg-card p-8 text-center text-sm text-muted-foreground">Nenhum veículo encontrado.</div>}</div>}
  </div></div>;
}

function VehicleRow({ vehicle, saving, onAction }: { vehicle: Vehicle; saving: boolean; onAction: (vehicle: Vehicle, action: string, payload: Record<string, unknown>) => Promise<void> }) {
  const [price, setPrice] = useState(String(((vehicle.priceCents ?? 0) / 100).toFixed(2)).replace(".", ","));
  const [published, setPublished] = useState(Boolean(vehicle.published));
  const [status, setStatus] = useState(vehicle.status);
  return <div className="rounded-sm border border-border bg-card p-4 sm:p-5"><div className="grid gap-4 lg:grid-cols-[1.5fr_160px_170px_180px_auto] lg:items-end">
    <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{vehicle.category === "motos" ? "Moto" : "Carro"}</p><h2 className="mt-1 font-bold text-foreground">{vehicle.brand} {vehicle.model} {vehicle.version ?? ""}</h2><p className="mt-1 text-xs text-muted-foreground">{vehicle.year ?? "—"} · {(vehicle.mileage ?? 0).toLocaleString("pt-BR")} km · {vehicle.id}</p></div>
    <label><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Preço</span><input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-sm border border-border bg-secondary px-2.5 py-2 text-sm" /></label>
    <label><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</span><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-sm border border-border bg-secondary px-2.5 py-2 text-sm"><option value="disponivel">Disponível</option><option value="reservado">Reservado</option><option value="vendido">Vendido</option></select></label>
    <label className="flex h-9 items-center gap-2 rounded-sm border border-border px-3 text-sm"><input type="checkbox" checked={published && status !== "vendido"} disabled={status === "vendido"} onChange={(e) => setPublished(e.target.checked)} />Publicado</label>
    <button disabled={saving} onClick={() => { const cents = Math.round(Number(price.replace(".", "").replace(",", ".")) * 100); void onAction(vehicle, "updateVehicle", { updates: { brand: vehicle.brand, model: vehicle.model, version: vehicle.version ?? null, year: vehicle.year ?? null, mileage: vehicle.mileage ?? 0, priceCents: cents } }).then(() => onAction(vehicle, "setStatus", { status })).then(() => onAction(vehicle, "setInventory", { published: published && status !== "vendido", displayOrder: vehicle.displayOrder ?? 0 })); }} className="inline-flex h-9 items-center justify-center gap-2 rounded-sm bg-foreground px-4 text-sm font-semibold text-background disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Salvando…" : "Salvar"}</button>
  </div><div className="mt-3 text-right text-xs text-muted-foreground">Atual: <strong className="text-foreground">{money(vehicle.priceCents)}</strong></div></div>;
}
