import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MessageSquare, RefreshCw, UserRound } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  aguardando_cliente: "Aguardando cliente",
  proposta_enviada: "Proposta enviada",
  negociacao: "Negociação",
  convertido: "Convertido",
  perdido: "Perdido",
};
const INTENT_LABELS: Record<string, string> = { comprar: "Comprar", trocar: "Trocar", financiar: "Financiar", vender: "Vender", consignar: "Consignar", contato: "Contato" };

type Lead = { id: string; customer_name: string; customer_phone: string | null; customer_email: string | null; source: string; intent: string; status: string; assigned_to: string | null; vehicle_id: string | null; brand: string | null; model: string | null; version: string | null; message: string | null; notes: string | null; created_at: string; updated_at: string };
type Event = { id: string; lead_id: string; event_type: string; from_status?: string | null; to_status?: string | null; actor_id?: string | null; note?: string | null; occurred_at: string };
type CRMData = { leads: Lead[]; events: Event[]; evaluations: unknown[]; negotiations: unknown[]; reservations: unknown[]; sales: unknown[]; financing: unknown[] };

export const Route = createFileRoute("/admin/crm")({ component: CRMPage });

function CRMPage() {
  const [data, setData] = useState<CRMData | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/crm/api", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(response.status === 401 ? "Acesso não autenticado pelo Cloudflare Access." : "Falha ao carregar o CRM.");
      setData((await response.json()) as CRMData);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Falha ao carregar o CRM."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const leads = data?.leads ?? [];
  const filtered = useMemo(() => leads.filter((lead) => {
    const term = search.trim().toLowerCase();
    const matchesText = !term || `${lead.customer_name} ${lead.customer_phone ?? ""} ${lead.customer_email ?? ""} ${lead.brand ?? ""} ${lead.model ?? ""} ${lead.vehicle_id ?? ""}`.toLowerCase().includes(term);
    return matchesText && (statusFilter === "todos" || lead.status === statusFilter);
  }), [leads, search, statusFilter]);
  const selected = leads.find((lead) => lead.id === selectedId) ?? filtered[0] ?? null;
  const events = (data?.events ?? []).filter((event) => event.lead_id === selected?.id).sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));

  const run = async (payload: Record<string, unknown>) => {
    if (!selected) return;
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/admin/crm/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: selected.id }) });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Operação não concluída.");
      setNote(""); setMessage("Alteração salva com sucesso."); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Operação não concluída."); }
    finally { setSaving(false); }
  };

  return <main className="min-h-[calc(100vh-120px)] bg-background"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Operação comercial</p><h1 className="mt-1 text-3xl font-bold tracking-tight">CRM / Leads</h1><p className="mt-2 text-sm text-muted-foreground">Centralize os atendimentos e acompanhe cada oportunidade até a conversão.</p></div><Link to="/admin" className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-sm font-semibold hover:bg-accent"><ArrowLeft className="h-4 w-4" />Painel</Link></div>
    {message && <div className="mt-5 rounded-sm border border-border bg-card px-4 py-3 text-sm">{message}</div>}
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      <section className="rounded-sm border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3"><h2 className="font-bold">Leads <span className="text-muted-foreground">({filtered.length})</span></h2><button onClick={() => void load()} disabled={loading} className="rounded-sm p-2 text-muted-foreground hover:bg-accent" aria-label="Atualizar"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente, telefone ou veículo…" className="rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold sm:col-span-2" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm"><option value="todos">Todos os status</option>{Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        <div className="mt-4 space-y-2">{filtered.length === 0 ? <p className="rounded-sm border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhum lead encontrado.</p> : filtered.map((lead) => <button key={lead.id} onClick={() => setSelectedId(lead.id)} className={`w-full rounded-sm border p-4 text-left transition-colors ${selected?.id === lead.id ? "border-gold bg-secondary" : "border-border hover:bg-accent"}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{lead.customer_name}</p><p className="mt-1 truncate text-xs text-muted-foreground">{INTENT_LABELS[lead.intent] ?? lead.intent}{lead.brand ? ` · ${lead.brand} ${lead.model ?? ""}` : ""}</p></div><span className="shrink-0 rounded-sm bg-secondary px-2 py-1 text-[11px] font-semibold">{STATUS_LABELS[lead.status] ?? lead.status}</span></div><p className="mt-2 text-xs text-muted-foreground">{new Date(lead.updated_at).toLocaleString("pt-BR")}</p></button>)}</div>
      </section>
      <section className="rounded-sm border border-border bg-card p-5">
        {!selected ? <div className="flex min-h-[420px] items-center justify-center text-center text-sm text-muted-foreground">Selecione um lead para visualizar o atendimento.</div> : <div>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5"><div><p className="text-xs font-bold uppercase tracking-wider text-gold">{INTENT_LABELS[selected.intent] ?? selected.intent}</p><h2 className="mt-1 text-2xl font-bold">{selected.customer_name}</h2><p className="mt-1 text-sm text-muted-foreground">{selected.customer_phone ?? "Sem telefone"}{selected.customer_email ? ` · ${selected.customer_email}` : ""}</p></div><UserRound className="h-7 w-7 text-gold" /></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2"><Info label="Veículo" value={selected.brand ? `${selected.brand} ${selected.model ?? ""} ${selected.version ?? ""}` : selected.vehicle_id ?? "Não informado"} /><Info label="Origem" value={selected.source} /><Info label="Criado em" value={new Date(selected.created_at).toLocaleString("pt-BR")} /><Info label="Responsável" value={selected.assigned_to ?? "Não atribuído"} /></div>
          {selected.message && <div className="mt-5 rounded-sm border border-border bg-secondary p-4"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mensagem</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{selected.message}</p></div>}
          <div className="mt-6"><label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status do atendimento</label><select value={selected.status} disabled={saving} onChange={(e) => void run({ action: "status", status: e.target.value })} className="mt-2 w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm"><option value="novo">Novo</option><option value="em_atendimento">Em atendimento</option><option value="aguardando_cliente">Aguardando cliente</option><option value="proposta_enviada">Proposta enviada</option><option value="negociacao">Negociação</option><option value="convertido">Convertido</option><option value="perdido">Perdido</option></select></div>
          <div className="mt-5"><label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Adicionar observação</label><div className="mt-2 flex gap-2"><textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Registrar informação importante do atendimento…" className="min-w-0 flex-1 resize-none rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /><button disabled={saving || !note.trim()} onClick={() => void run({ action: "note", note })} className="self-end rounded-sm bg-foreground px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-50"><MessageSquare className="h-4 w-4" /></button></div></div>
          <div className="mt-6"><h3 className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4 text-gold" />Histórico</h3><div className="mt-3 space-y-3">{events.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma atividade registrada.</p> : events.map((event) => <div key={event.id} className="border-l-2 border-border pl-4"><p className="text-sm font-semibold">{event.event_type === "status_changed" ? `${STATUS_LABELS[event.from_status ?? ""] ?? event.from_status ?? ""} → ${STATUS_LABELS[event.to_status ?? ""] ?? event.to_status ?? ""}` : event.event_type === "note_added" ? "Observação adicionada" : "Atividade registrada"}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(event.occurred_at).toLocaleString("pt-BR")}{event.actor_id ? ` · ${event.actor_id}` : ""}</p>{event.note && <p className="mt-1 text-sm text-muted-foreground">{event.note}</p>}</div>)}</div></div>
        </div>}
      </section>
    </div>
  </div></main>;
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-sm border border-border p-3"><p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 truncate text-sm font-semibold">{value}</p></div>; }
