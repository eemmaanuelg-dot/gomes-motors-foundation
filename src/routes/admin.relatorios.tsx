import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";

type ReportData = {
  stock: { status: string; total: number }[];
  leadsByIntent: { intent: string; total: number }[];
  leadsByStatus: { status: string; total: number }[];
  evaluations: { decision: string; total: number }[];
  negotiations: { stage: string; total: number }[];
  reservations: { status: string; total: number }[];
  sales: { total: number; gross_cents: number; average_cents: number };
  financing: { status: string; total: number }[];
  analyticsLast30Days: { event_name: string; total: number }[];
  reviews: { status: string; total: number }[];
  conversion: { totalLeads: number; convertedLeads: number; lostLeads: number; ratePercent: number };
};

export const Route = createFileRoute("/admin/relatorios")({ component: ReportsPage });

const money = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
const labels: Record<string, string> = {
  disponivel: "Disponível", reservado: "Reservado", vendido: "Vendido",
  novo: "Novo", em_atendimento: "Em atendimento", aguardando_cliente: "Aguardando cliente", proposta_enviada: "Proposta enviada", negociacao: "Negociação", convertido: "Convertido", perdido: "Perdido",
  comprar: "Comprar", trocar: "Trocar", financiar: "Financiar", vender: "Vender", consignar: "Consignar", contato: "Contato",
  pendente: "Pendente", aprovada: "Aprovada", rejeitada: "Rejeitada", recusada: "Recusada", convertida: "Convertida",
  aberta: "Aberta", proposta: "Proposta", contraproposta: "Contraproposta", fechada: "Fechada", perdida: "Perdida",
  ativa: "Ativa", liberada: "Liberada", expirada: "Expirada", cancelada: "Cancelada",
  simulacao_interna: "Simulação interna", em_analise: "Em análise", aprovado: "Aprovado", recusado: "Recusado", contratado: "Contratado", cancelado: "Cancelado",
  page_view: "Visualizações", vehicle_view: "Visualização de veículo", whatsapp_click: "Cliques WhatsApp", favorite_add: "Favoritos adicionados", favorite_remove: "Favoritos removidos", filter_use: "Uso de filtros", lead_intent: "Intenções comerciais", simulation_complete: "Simulações concluídas", simulation_cta: "CTAs da simulação",
};

function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/admin/reports/api", { headers: { Accept: "application/json" } });
      const result = await response.json() as ReportData & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Não foi possível carregar os relatórios.");
      setData(result);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar os relatórios."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const section = (title: string, rows: { label: string; value: number }[]) => (
    <Panel><h2 className="font-bold">{title}</h2><div className="mt-4 space-y-2">{rows.length ? rows.map((row) => <div key={row.label} className="flex items-center justify-between border-b border-border/70 py-2.5 text-sm"><span>{row.label}</span><strong>{row.value}</strong></div>) : <p className="text-sm text-muted-foreground">Sem dados no período.</p>}</div></Panel>
  );

  if (loading) return <Shell><Panel><div className="flex items-center gap-3 text-muted-foreground"><RefreshCw className="h-4 w-4 animate-spin" />Carregando relatórios…</div></Panel></Shell>;
  if (error) return <Shell><Panel><p className="text-sm text-brand-red">{error}</p><button type="button" onClick={() => void load()} className="mt-4 rounded-sm border border-border px-4 py-2 text-sm font-semibold">Tentar novamente</button></Panel></Shell>;
  if (!data) return null;

  return <Shell><div className="space-y-6">
    <header><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Painel administrativo</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Relatórios operacionais</h1><p className="mt-2 text-sm text-muted-foreground">Indicadores consolidados do estoque, funil comercial, financiamento, avaliações e comportamento do site.</p></header>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat title="Vendas registradas" value={String(data.sales.total)} />
      <Stat title="Faturamento bruto" value={money(data.sales.gross_cents)} />
      <Stat title="Ticket médio" value={money(data.sales.average_cents)} />
      <Stat title="Conversão de leads" value={`${data.conversion.ratePercent.toLocaleString("pt-BR")} %`} />
    </div>
    <Panel><h2 className="font-bold">Resumo do funil</h2><div className="mt-4 grid gap-4 sm:grid-cols-3"><Metric label="Leads" value={data.conversion.totalLeads}/><Metric label="Convertidos" value={data.conversion.convertedLeads}/><Metric label="Perdidos" value={data.conversion.lostLeads}/></div></Panel>
    <div className="grid gap-6 lg:grid-cols-2">
      {section("Estoque por status", data.stock.map((r) => ({ label: labels[r.status] ?? r.status, value: r.total })))}
      {section("Leads por status", data.leadsByStatus.map((r) => ({ label: labels[r.status] ?? r.status, value: r.total })))}
      {section("Leads por intenção", data.leadsByIntent.map((r) => ({ label: labels[r.intent] ?? r.intent, value: r.total })))}
      {section("Avaliações de veículos", data.evaluations.map((r) => ({ label: labels[r.decision] ?? r.decision, value: r.total })))}
      {section("Avaliações públicas", data.reviews.map((r) => ({ label: labels[r.status] ?? r.status, value: r.total })))}
      {section("Negociações", data.negotiations.map((r) => ({ label: labels[r.stage] ?? r.stage, value: r.total })))}
      {section("Reservas", data.reservations.map((r) => ({ label: labels[r.status] ?? r.status, value: r.total })))}
      {section("Financiamento", data.financing.map((r) => ({ label: labels[r.status] ?? r.status, value: r.total })))}
      {section("Analytics — últimos 30 dias", data.analyticsLast30Days.map((r) => ({ label: labels[r.event_name] ?? r.event_name, value: r.total })))}
    </div>
  </div></Shell>;
}

function Shell({ children }: { children: React.ReactNode }) { return <div className="min-h-[calc(100vh-120px)] bg-background"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"><div className="mb-6 flex items-center justify-between"><Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Painel administrativo</Link><div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/10 text-gold"><ShieldCheck className="h-5 w-5" /></div></div>{children}</div></div>; }
function Panel({ children }: { children: React.ReactNode }) { return <section className="rounded-sm border border-border bg-card p-5 sm:p-6">{children}</section>; }
function Stat({ title, value }: { title: string; value: string }) { return <Panel><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p><p className="mt-3 text-3xl font-bold text-foreground">{value}</p></Panel>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-sm border border-border/70 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>; }
