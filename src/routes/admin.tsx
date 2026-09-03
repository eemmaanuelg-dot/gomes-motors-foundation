import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileClock,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Package,
  Pencil,
  RefreshCw,
  Save,
  ShieldCheck,
  Star,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";

type AdminVehicle = {
  id: string;
  category: string;
  brand: string;
  model: string;
  version?: string | null;
  year: number;
  mileage: number;
  price_cents: number;
  status: "disponivel" | "reservado" | "vendido";
  featured: number;
  description?: string | null;
  image_url?: string | null;
  images_json: string;
  equipment_json: string;
  technical_sheet_json: string;
  financing_json: string;
  seo_description: string;
  cylinder_capacity?: string | null;
  vehicle_type?: string | null;
  published?: number | null;
  display_order?: number | null;
  entry_at?: string | null;
  exit_at?: string | null;
  current_price_cents?: number | null;
};

type Media = { id: string; vehicle_id: string; object_key: string; mime_type: string; display_order: number; alt_text?: string | null };
type Audit = { id: string; actor_id?: string | null; action: string; entity_type: string; entity_id?: string | null; result: string; occurred_at: string; metadata_json?: string | null };
type AdminData = { vehicles: AdminVehicle[]; media: Media[]; audits: Audit[] };

export const Route = createFileRoute("/admin")({ component: AdminPage });

const money = (cents: number | null | undefined) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((cents ?? 0) / 100);

const parseJson = <T,>(value: string | null | undefined, fallback: T): T => {
  try { return value ? (JSON.parse(value) as T) : fallback; } catch { return fallback; }
};

function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [identity, setIdentity] = useState<{ email?: string; name?: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/api", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(response.status === 401 ? "Acesso não autenticado pelo Cloudflare Access." : "Falha ao carregar o painel.");
      setData((await response.json()) as AdminData);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao carregar o painel.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    void load();
    fetch("/cdn-cgi/access/get-identity", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((value) => value && setIdentity(value as { email?: string; name?: string }))
      .catch(() => undefined);
  }, []);

  const vehicles = data?.vehicles ?? [];
  const available = vehicles.filter((v) => v.status === "disponivel").length;
  const reserved = vehicles.filter((v) => v.status === "reservado").length;
  const sold = vehicles.filter((v) => v.status === "vendido").length;
  const published = vehicles.filter((v) => v.published === 1 && v.status !== "vendido").length;
  const selected = vehicles.find((v) => v.id === selectedId) ?? null;

  const run = async (payload: Record<string, unknown>) => {
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/admin/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Operação não concluída.");
      setMessage("Alteração salva com sucesso.");
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Operação não concluída."); }
    finally { setSaving(false); }
  };

  if (loading && !data) return <AdminShell tab={tab} setTab={setTab} identity={identity}><Panel><div className="flex items-center gap-3 text-muted-foreground"><RefreshCw className="h-4 w-4 animate-spin" />Carregando dados administrativos…</div></Panel></AdminShell>;

  return (
    <AdminShell tab={tab} setTab={setTab} identity={identity}>
      {message && <div className="mb-5 flex items-center justify-between rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground"><span>{message}</span><button onClick={() => setMessage("")} aria-label="Fechar">×</button></div>}

      {tab === "dashboard" && (
        <div className="space-y-6">
          <Header title="Dashboard" description="Visão geral da operação da Gomes Motors." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={<Package />} label="Total de veículos" value={vehicles.length} />
            <Stat icon={<Truck />} label="Disponíveis" value={available} />
            <Stat icon={<Activity />} label="Reservados" value={reserved} />
            <Stat icon={<Check />} label="Vendidos" value={sold} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel><h2 className="font-bold">Publicação do estoque</h2><div className="mt-5 flex items-end justify-between"><span className="text-4xl font-bold text-gold">{published}</span><span className="text-sm text-muted-foreground">publicados de {vehicles.length}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-gold" style={{ width: `${vehicles.length ? Math.min(100, published / vehicles.length * 100) : 0}%` }} /></div></Panel>
            <Panel><h2 className="font-bold">Ações rápidas</h2><div className="mt-4 grid gap-2 sm:grid-cols-2"><QuickButton onClick={() => setTab("estoque")} icon={<Package />} text="Gerenciar estoque" /><QuickButton onClick={() => setTab("precos")} icon={<CircleDollarSign />} text="Preços e financiamento" /><QuickButton onClick={() => setTab("midia")} icon={<ImagePlus />} text="Mídia e fotos" /><QuickButton onClick={() => setTab("auditoria")} icon={<FileClock />} text="Ver auditoria" /></div></Panel>
          </div>
        </div>
      )}

      {tab === "estoque" && <InventoryTab vehicles={vehicles} selected={selected} setSelectedId={setSelectedId} run={run} saving={saving} />}
      {tab === "precos" && <PricingTab vehicles={vehicles} run={run} saving={saving} />}
      {tab === "midia" && <MediaTab vehicles={vehicles} media={data?.media ?? []} run={run} saving={saving} />}
      {tab === "auditoria" && <AuditTab audits={data?.audits ?? []} />}
    </AdminShell>
  );
}

function AdminShell({ children, tab, setTab, identity }: { children: React.ReactNode; tab: string; setTab: (value: string) => void; identity: { email?: string; name?: string } | null }) {
  const nav = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["estoque", "Estoque", Package],
    ["precos", "Preços e financiamento", CircleDollarSign],
    ["midia", "Mídia / fotos", ImagePlus],
    ["auditoria", "Auditoria", FileClock],
  ] as const;
  return <div className="min-h-[calc(100vh-120px)] bg-background"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8"><aside className="lg:w-64 lg:shrink-0"><div className="rounded-sm border border-border bg-card p-4 lg:sticky lg:top-6"><div className="flex items-center gap-3 border-b border-border pb-4"><div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/10 text-gold"><ShieldCheck className="h-5 w-5" /></div><div className="min-w-0"><p className="font-bold">Gomes Motors</p><p className="truncate text-xs text-muted-foreground">Administração</p></div></div><nav className="mt-4 space-y-1">{nav.map(([key, label, Icon]) => <button key={key} onClick={() => setTab(key)} className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm font-semibold transition-colors ${tab === key ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"}`}><Icon className="h-4 w-4" />{label}</button>)}</nav><div className="mt-5 border-t border-border pt-4"><div className="px-3 text-xs text-muted-foreground"><p className="font-semibold text-foreground">{identity?.name ?? "Usuário autenticado"}</p><p className="mt-1 truncate">{identity?.email ?? "Cloudflare Access"}</p></div><Link to="/" className="mt-3 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><LogOut className="h-4 w-4" />Voltar ao site</Link></div></div></aside><main className="min-w-0 flex-1">{children}</main></div></div>;
}

function Header({ title, description }: { title: string; description: string }) { return <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Painel administrativo</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>; }
function Panel({ children }: { children: React.ReactNode }) { return <section className="rounded-sm border border-border bg-card p-5 sm:p-6">{children}</section>; }
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="rounded-sm border border-border bg-card p-5"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-bold uppercase tracking-wider">{label}</span><span className="text-gold">{icon}</span></div><p className="mt-4 text-3xl font-bold text-foreground">{value}</p></div>; }
function QuickButton({ onClick, icon, text }: { onClick: () => void; icon: React.ReactNode; text: string }) { return <button onClick={onClick} className="flex items-center justify-between rounded-sm border border-border px-3 py-3 text-sm font-semibold hover:bg-secondary"><span className="flex items-center gap-2">{icon}{text}</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>; }

function InventoryTab({ vehicles, selected, setSelectedId, run, saving }: { vehicles: AdminVehicle[]; selected: AdminVehicle | null; setSelectedId: (id: string) => void; run: (payload: Record<string, unknown>) => Promise<void>; saving: boolean }) {
  const [filter, setFilter] = useState("");
  const filtered = vehicles.filter((v) => `${v.brand} ${v.model} ${v.version ?? ""}`.toLowerCase().includes(filter.toLowerCase()));
  return <div className="space-y-6"><Header title="Gestão do estoque" description="Cadastre, publique, destaque e altere o status dos veículos." /><Panel><div className="flex flex-col gap-3 sm:flex-row"><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Buscar por marca ou modelo…" className="flex-1 rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /><span className="self-center text-xs text-muted-foreground">{filtered.length} veículo(s)</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3">Veículo</th><th className="pb-3">Preço</th><th className="pb-3">Status</th><th className="pb-3">Publicação</th><th className="pb-3">Destaque</th><th /></tr></thead><tbody>{filtered.map((v) => <tr key={v.id} className="border-b border-border/70"><td className="py-3"><p className="font-semibold">{v.brand} {v.model} {v.version ?? ""}</p><p className="text-xs text-muted-foreground">{v.year} · {v.mileage.toLocaleString("pt-BR")} km</p></td><td className="py-3 font-semibold">{money(v.price_cents)}</td><td className="py-3"><select value={v.status} disabled={saving} onChange={(e) => void run({ action: "setStatus", id: v.id, status: e.target.value, reason: "Alteração pelo painel administrativo" })} className="rounded-sm border border-border bg-secondary px-2 py-1.5 text-xs"><option value="disponivel">Disponível</option><option value="reservado">Reservado</option><option value="vendido">Vendido</option></select></td><td className="py-3"><button disabled={saving || v.status === "vendido"} onClick={() => void run({ action: "setInventory", id: v.id, published: v.published !== 1, order: v.display_order ?? 0 })} className="rounded-sm border border-border px-2.5 py-1.5 text-xs font-semibold">{v.published === 1 ? "Publicado" : "Despublicado"}</button></td><td className="py-3"><button disabled={saving} onClick={() => void run({ action: "setFeatured", id: v.id, featured: v.featured !== 1 })} aria-label="Alternar destaque" className={v.featured === 1 ? "text-gold" : "text-muted-foreground"}><Star className="h-4 w-4" fill={v.featured === 1 ? "currentColor" : "none"} /></button></td><td className="py-3 text-right"><button onClick={() => setSelectedId(v.id)} className="inline-flex items-center gap-1 rounded-sm border border-border px-2.5 py-1.5 text-xs font-semibold"><Pencil className="h-3.5 w-3.5" />Editar</button></td></tr>)}</tbody></table></div></Panel>{selected && <VehicleEditor vehicle={selected} run={run} saving={saving} />}</div>;
}

function VehicleEditor({ vehicle, run, saving }: { vehicle: AdminVehicle; run: (payload: Record<string, unknown>) => Promise<void>; saving: boolean }) {
  const [brand, setBrand] = useState(vehicle.brand); const [model, setModel] = useState(vehicle.model); const [version, setVersion] = useState(vehicle.version ?? ""); const [year, setYear] = useState(String(vehicle.year)); const [km, setKm] = useState(String(vehicle.mileage)); const [description, setDescription] = useState(vehicle.description ?? "");
  return <Panel><div className="flex items-center justify-between"><div><h2 className="font-bold">Editar veículo</h2><p className="mt-1 text-xs text-muted-foreground">{vehicle.id}</p></div><Pencil className="h-4 w-4 text-gold" /></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Marca" value={brand} setValue={setBrand} /><Field label="Modelo" value={model} setValue={setModel} /><Field label="Versão" value={version} setValue={setVersion} /><Field label="Ano" value={year} setValue={setYear} type="number" /><Field label="Quilometragem" value={km} setValue={setKm} type="number" /></div><label className="mt-4 block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Descrição</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /></label><button disabled={saving} onClick={() => void run({ action: "updateVehicle", id: vehicle.id, data: { brand, model, version: version || null, year: Number(year), mileage: Number(km), description } })} className="mt-4 inline-flex items-center gap-2 rounded-sm bg-foreground px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-50"><Save className="h-4 w-4" />Salvar veículo</button></Panel>;
}

function PricingTab({ vehicles, run, saving }: { vehicles: AdminVehicle[]; run: (payload: Record<string, unknown>) => Promise<void>; saving: boolean }) {
  const [id, setId] = useState(vehicles[0]?.id ?? ""); const vehicle = vehicles.find((v) => v.id === id); const [price, setPrice] = useState(String((vehicle?.price_cents ?? 0) / 100)); const financing = parseJson<{ entradaMinima?: number; parcelas?: number[]; taxaIndicativa?: number }>(vehicle?.financing_json, {});
  useEffect(() => { if (vehicle) setPrice(String(vehicle.price_cents / 100)); }, [id, vehicle?.price_cents]);
  const [entry, setEntry] = useState(String((financing.entradaMinima ?? 0) / 100)); const [rate, setRate] = useState(String(financing.taxaIndicativa ?? 1.89)); const [terms, setTerms] = useState((financing.parcelas ?? [24, 36, 48]).join(", "));
  useEffect(() => { if (vehicle) { const f = parseJson<{ entradaMinima?: number; parcelas?: number[]; taxaIndicativa?: number }>(vehicle.financing_json, {}); setEntry(String((f.entradaMinima ?? 0) / 100)); setRate(String(f.taxaIndicativa ?? 1.89)); setTerms((f.parcelas ?? [24, 36, 48]).join(", ")); } }, [id, vehicle?.financing_json]);
  if (!vehicle) return <Panel>Nenhum veículo cadastrado.</Panel>;
  return <div className="space-y-6"><Header title="Preços e financiamento" description="Atualize preço comercial e parâmetros da simulação educativa." /><Panel><div className="grid gap-4 sm:grid-cols-2"><label className="block sm:col-span-2"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Veículo</span><select value={id} onChange={(e) => setId(e.target.value)} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm">{vehicles.map((v) => <option key={v.id} value={v.id}>{v.brand} {v.model} — {v.year}</option>)}</select></label><Field label="Preço (R$)" value={price} setValue={setPrice} type="number" /><Field label="Entrada mínima (R$)" value={entry} setValue={setEntry} type="number" /><Field label="Taxa indicativa (% a.m.)" value={rate} setValue={setRate} type="number" /><Field label="Prazos (parcelas)" value={terms} setValue={setTerms} /></div><div className="mt-4 rounded-sm border border-border bg-secondary/60 p-4 text-xs leading-relaxed text-muted-foreground">A taxa continua sendo apresentada no site como estimativa educativa. Alterar aqui não cria aprovação ou proposta de crédito.</div><div className="mt-5 flex flex-wrap gap-2"><button disabled={saving} onClick={() => void run({ action: "setPrice", id, priceCents: Math.round(Number(price.replace(",", ".")) * 100) })} className="inline-flex items-center gap-2 rounded-sm bg-foreground px-4 py-2.5 text-sm font-semibold text-background"><Tag className="h-4 w-4" />Salvar preço</button><button disabled={saving} onClick={() => void run({ action: "setFinancing", id, financing: { entradaMinima: Math.round(Number(entry.replace(",", ".")) * 100), parcelas: terms.split(",").map((v) => Number(v.trim())).filter((v) => Number.isInteger(v) && v > 0), taxaIndicativa: Number(rate.replace(",", ".")) } })} className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-sm font-semibold"><CircleDollarSign className="h-4 w-4" />Salvar financiamento</button></div></Panel></div>;
}

function MediaTab({ vehicles, media, run, saving }: { vehicles: AdminVehicle[]; media: Media[]; run: (payload: Record<string, unknown>) => Promise<void>; saving: boolean }) {
  const [id, setId] = useState(vehicles[0]?.id ?? ""); const [key, setKey] = useState(""); const [alt, setAlt] = useState(""); const [order, setOrder] = useState("0"); const current = media.filter((m) => m.vehicle_id === id);
  return <div className="space-y-6"><Header title="Mídia e fotos" description="Gerencie referências de objetos de mídia sem acoplar o catálogo ao provedor de armazenamento." /><Panel><div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Veículo</span><select value={id} onChange={(e) => setId(e.target.value)} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm">{vehicles.map((v) => <option key={v.id} value={v.id}>{v.brand} {v.model}</option>)}</select></label><Field label="Ordem" value={order} setValue={setOrder} type="number" /><Field label="Object key / referência" value={key} setValue={setKey} /><Field label="Texto alternativo" value={alt} setValue={setAlt} /></div><button disabled={saving || !key.trim()} onClick={() => void run({ action: "addMedia", id, objectKey: key, altText: alt || undefined, order: Number(order) || 0 })} className="mt-4 inline-flex items-center gap-2 rounded-sm bg-foreground px-4 py-2.5 text-sm font-semibold text-background"><ImagePlus className="h-4 w-4" />Adicionar referência</button></Panel><Panel><h2 className="font-bold">Mídias cadastradas</h2><div className="mt-4 space-y-2">{current.length ? current.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 rounded-sm border border-border p-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{item.object_key}</p><p className="text-xs text-muted-foreground">ordem {item.display_order} · {item.mime_type}</p></div><button disabled={saving} onClick={() => void run({ action: "removeMedia", mediaId: item.id })} className="shrink-0 text-muted-foreground hover:text-brand-red" aria-label="Remover mídia"><Trash2 className="h-4 w-4" /></button></div>) : <p className="text-sm text-muted-foreground">Nenhuma mídia R2 cadastrada. As referências legacy continuam sendo resolvidas pelo catálogo.</p>}</div></Panel></div>;
}

function AuditTab({ audits }: { audits: Audit[] }) { return <div className="space-y-6"><Header title="Auditoria" description="Histórico das operações administrativas gravadas no D1." /><Panel><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3">Data</th><th className="pb-3">Ator</th><th className="pb-3">Ação</th><th className="pb-3">Entidade</th><th className="pb-3">Resultado</th><th className="pb-3">Detalhes</th></tr></thead><tbody>{audits.map((a) => <tr key={a.id} className="border-b border-border/70"><td className="py-3 text-xs">{new Date(a.occurred_at).toLocaleString("pt-BR")}</td><td className="py-3 text-xs">{a.actor_id ?? "—"}</td><td className="py-3 font-semibold">{a.action}</td><td className="py-3 text-xs">{a.entity_type}{a.entity_id ? ` · ${a.entity_id}` : ""}</td><td className="py-3"><span className={`rounded-sm px-2 py-1 text-xs font-bold ${a.result === "success" ? "bg-secondary text-foreground" : "bg-brand-red/10 text-brand-red"}`}>{a.result === "success" ? "Sucesso" : "Falha"}</span></td><td className="max-w-xs truncate py-3 text-xs text-muted-foreground">{a.metadata_json ?? "—"}</td></tr>)}</tbody></table>{audits.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Nenhum evento administrativo registrado ainda.</p>}</div></Panel></div>; }

function Field({ label, value, setValue, type = "text" }: { label: string; value: string; setValue: (value: string) => void; type?: string }) { return <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span><input type={type} value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /></label>; }
