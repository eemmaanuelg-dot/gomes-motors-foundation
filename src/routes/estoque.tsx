import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Bike,
  Calculator,
  Car,
  ChevronDown,
  Heart,
  MessageCircle,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { publicVehicleCatalog } from "@/application/vehicles/public-catalog";
import type { Vehicle as Veiculo } from "@/domain/vehicles/types";
import { useFavoritos } from "@/lib/favorites";
import {
  criarWhatsAppUrl,
  formatarKm,
  formatarPreco,
  mensagemInteressePorTipo,
} from "@/lib/vehicle-utils";

export const Route = createFileRoute("/estoque")({
  validateSearch: (search): { favoritos?: boolean } => ({
    favoritos: search["favoritos"] === true || search["favoritos"] === "true",
  }),
  loader: (): Promise<Veiculo[]> => publicVehicleCatalog.listar(),
  head: () => ({
    meta: [
      { title: "Estoque — Gomes Motors" },
      {
        name: "description",
        content:
          "Carros e motos selecionados em Campos dos Goytacazes, RJ. Encontre seu próximo veículo no estoque da Gomes Motors.",
      },
      { property: "og:title", content: "Estoque — Gomes Motors" },
      {
        property: "og:description",
        content: "Carros e motos selecionados em Campos dos Goytacazes, RJ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EstoquePage,
});

type Categoria = "todos" | "carros" | "motos";
type Filtros = {
  marca: string;
  modelo: string;
  versao: string;
  ano: string;
  preco: string;
  km: string;
  cambio: string;
  combustivel: string;
  cilindrada: string;
  tipo: string;
};
type FiltroGrupo = { grupo: string; opcoes: string[] };
type Ordenacao =
  | "relevantes"
  | "menor-preco"
  | "maior-preco"
  | "menor-km"
  | "maior-km"
  | "mais-novo"
  | "mais-antigo";

const FILTROS_VAZIOS: Filtros = { marca: "", modelo: "", versao: "", ano: "", preco: "", km: "", cambio: "", combustivel: "", cilindrada: "", tipo: "" };
const CATEGORIAS: { value: Categoria; label: string; icon?: typeof Car }[] = [
  { value: "todos", label: "Todos" },
  { value: "carros", label: "Carros", icon: Car },
  { value: "motos", label: "Motos", icon: Bike },
];
const FAIXAS_PRECO_CARROS = ["Até R$ 80 mil", "R$ 80 mil a R$ 110 mil", "Acima de R$ 110 mil"];
const FAIXAS_PRECO_MOTOS = ["Até R$ 32 mil", "Acima de R$ 32 mil"];
const FAIXAS_KM_CARROS = ["Até 40.000 km", "40.000 a 60.000 km", "Acima de 60.000 km"];
const FAIXAS_KM_MOTOS = ["Até 20.000 km", "Acima de 20.000 km"];
const FAIXAS_CILINDRADA = ["Até 400 cc", "Acima de 400 cc"];
const VISIVEIS_INICIAL = 4;

function unicos(valores: (string | undefined)[]) {
  return [...new Set(valores.filter((valor): valor is string => Boolean(valor)))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function obterFiltros(veiculos: Veiculo[], categoria: Categoria, filtros: Filtros): FiltroGrupo[] {
  const base = veiculos.filter((veiculo) => categoria === "todos" || veiculo.categoria === categoria);
  const porMarca = filtros.marca ? base.filter((veiculo) => veiculo.marca === filtros.marca) : base;
  const porModelo = filtros.modelo ? porMarca.filter((veiculo) => veiculo.modelo === filtros.modelo) : porMarca;
  const grupos: FiltroGrupo[] = [
    { grupo: "Marca", opcoes: unicos(base.map((veiculo) => veiculo.marca)) },
    { grupo: "Modelo", opcoes: unicos(porMarca.map((veiculo) => veiculo.modelo)) },
    { grupo: "Versão", opcoes: unicos(porModelo.map((veiculo) => veiculo.versao)) },
    { grupo: "Ano", opcoes: [...new Set(base.map((veiculo) => String(veiculo.ano)))].sort((a, b) => Number(b) - Number(a)) },
    { grupo: "Preço", opcoes: categoria === "motos" ? FAIXAS_PRECO_MOTOS : FAIXAS_PRECO_CARROS },
    { grupo: "Quilometragem", opcoes: categoria === "motos" ? FAIXAS_KM_MOTOS : FAIXAS_KM_CARROS },
    { grupo: "Câmbio", opcoes: unicos(base.map((veiculo) => veiculo.cambio)) },
    { grupo: "Combustível", opcoes: unicos(base.map((veiculo) => veiculo.combustivel)) },
    { grupo: "Cilindrada", opcoes: base.some((veiculo) => veiculo.cilindrada) ? FAIXAS_CILINDRADA : [] },
    { grupo: "Tipo", opcoes: unicos(base.map((veiculo) => veiculo.tipo)) },
  ];
  return grupos.filter((grupo) => grupo.opcoes.length > 0);
}

function obterChaveFiltro(grupo: string): keyof Filtros {
  const mapa: Record<string, keyof Filtros> = { Marca: "marca", Modelo: "modelo", Versão: "versao", Ano: "ano", Preço: "preco", Quilometragem: "km", Câmbio: "cambio", Combustível: "combustivel", Cilindrada: "cilindrada", Tipo: "tipo" };
  return mapa[grupo] ?? "marca";
}

function extrairNumero(texto?: string) {
  if (!texto) return 0;
  const numero = Number(texto.replace(/\D/g, ""));
  return Number.isFinite(numero) ? numero : 0;
}

function correspondeFaixaPreco(preco: number, filtro: string) {
  switch (filtro) {
    case "Até R$ 80 mil": return preco <= 80000;
    case "R$ 80 mil a R$ 110 mil": return preco > 80000 && preco <= 110000;
    case "Acima de R$ 110 mil": return preco > 110000;
    case "Até R$ 32 mil": return preco <= 32000;
    case "Acima de R$ 32 mil": return preco > 32000;
    default: return true;
  }
}

function correspondeFaixaKm(km: number, filtro: string) {
  switch (filtro) {
    case "Até 40.000 km": return km <= 40000;
    case "40.000 a 60.000 km": return km > 40000 && km <= 60000;
    case "Acima de 60.000 km": return km > 60000;
    case "Até 20.000 km": return km <= 20000;
    case "Acima de 20.000 km": return km > 20000;
    default: return true;
  }
}

function correspondeCilindrada(cilindrada: string | undefined, filtro: string) {
  if (!filtro) return true;
  if (!cilindrada) return false;
  const valor = extrairNumero(cilindrada);
  if (filtro === "Até 400 cc") return valor <= 400;
  if (filtro === "Acima de 400 cc") return valor > 400;
  return true;
}

function FiltroSelect({ grupo, opcoes, valor, onChange }: { grupo: string; opcoes: string[]; valor: string; onChange: (valor: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{grupo}</span>
      <div className="relative">
        <select value={valor} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-sm border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-gold">
          <option value="">Todos</option>
          {opcoes.map((opcao) => <option key={opcao} value={opcao}>{opcao}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </label>
  );
}

function FiltrosLaterais({ veiculos, categoria, filtros, onChange }: { veiculos: Veiculo[]; categoria: Categoria; filtros: Filtros; onChange: (chave: keyof Filtros, valor: string) => void }) {
  const [expandido, setExpandido] = useState(false);
  const filtrosDisponiveis = useMemo(() => obterFiltros(veiculos, categoria, filtros), [veiculos, categoria, filtros]);
  const visiveis = expandido ? filtrosDisponiveis : filtrosDisponiveis.slice(0, VISIVEIS_INICIAL);
  return (
    <div className="space-y-4">
      {visiveis.map((filtro) => {
        const chave = obterChaveFiltro(filtro.grupo);
        return <FiltroSelect key={filtro.grupo} grupo={filtro.grupo} opcoes={filtro.opcoes} valor={filtros[chave]} onChange={(valor) => onChange(chave, valor)} />;
      })}
      {filtrosDisponiveis.length > VISIVEIS_INICIAL && (
        <button type="button" onClick={() => setExpandido((atual) => !atual)} className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-foreground">
          {expandido ? "Ver menos filtros" : `Mais filtros (${filtrosDisponiveis.length - VISIVEIS_INICIAL})`}
          <ChevronDown className={`h-4 w-4 transition-transform ${expandido ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Veiculo["status"] }) {
  const labels = { disponivel: "Disponível", reservado: "Reservado", vendido: "Vendido" };
  return <span className="rounded-sm border border-border bg-background/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground backdrop-blur">{labels[status]}</span>;
}

function CardVeiculo({ veiculo, favorito, onAlternarFavorito }: { veiculo: Veiculo; favorito: boolean; onAlternarFavorito: () => void }) {
  const [mostrarOpcoesInteresse, setMostrarOpcoesInteresse] = useState(false);
  const detalhes = [String(veiculo.ano), formatarKm(veiculo.km)];
  if (veiculo.cambio) detalhes.push(veiculo.cambio);
  if (veiculo.combustivel) detalhes.push(veiculo.combustivel);
  if (veiculo.cilindrada) detalhes.push(veiculo.cilindrada);
  if (veiculo.tipo) detalhes.push(veiculo.tipo);
  const titulo = `${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""}`;

  return (
    <article className="group overflow-hidden rounded-sm border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={veiculo.imagem} alt={`${titulo} ${veiculo.ano}`} width={1280} height={960} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute left-3 top-3"><StatusBadge status={veiculo.status} /></div>
        <button type="button" onClick={onAlternarFavorito} aria-pressed={favorito} aria-label={favorito ? `Remover ${titulo} dos favoritos` : `Favoritar ${titulo}`} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-foreground transition-colors hover:bg-background">
          <Heart className={`h-5 w-5 ${favorito ? "fill-brand-red text-brand-red" : "text-foreground"}`} />
        </button>
      </div>

      <div className="p-5">
        <h2 className="truncate text-lg font-bold text-foreground">{titulo}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{detalhes.join(" · ")}</p>
        <p className="mt-3 text-xl font-bold text-gold">{formatarPreco(veiculo.preco)}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <a href={`/estoque/${veiculo.id}`} className="inline-flex items-center justify-center rounded-sm border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent">Ver detalhes</a>
          <button type="button" onClick={() => setMostrarOpcoesInteresse((aberto) => !aberto)} disabled={veiculo.status === "vendido"} className={`inline-flex items-center justify-center gap-1.5 rounded-sm px-4 py-2.5 text-sm font-semibold transition-opacity ${veiculo.status === "vendido" ? "cursor-not-allowed bg-secondary text-muted-foreground" : "bg-brand-red text-brand-red-foreground hover:opacity-90"}`}>
            <MessageCircle className="h-4 w-4" />
            {veiculo.status === "vendido" ? "Veículo vendido" : veiculo.status === "reservado" ? "Consultar disponibilidade" : "Tenho interesse"}
          </button>
        </div>

        {mostrarOpcoesInteresse && veiculo.status !== "vendido" && (
          <div className="mt-3 rounded-sm border border-border bg-secondary p-4" aria-label="Opções de interesse">
            <p className="text-sm font-bold text-foreground">Como podemos ajudar?</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">O veículo já está identificado. Escolha uma opção e continue o atendimento diretamente pelo WhatsApp.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <a href={criarWhatsAppUrl(mensagemInteressePorTipo(veiculo, "comprar"))} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-card px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"><ShoppingCart className="h-4 w-4" />Comprar</a>
              <a href={criarWhatsAppUrl(mensagemInteressePorTipo(veiculo, "trocar"))} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-card px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"><ArrowLeftRight className="h-4 w-4" />Trocar</a>
              <a href={criarWhatsAppUrl(mensagemInteressePorTipo(veiculo, "financiar"))} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-card px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"><Calculator className="h-4 w-4" />Financiar</a>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function EstoquePage() {
  const veiculosDisponiveis = Route.useLoaderData();
  const { favoritos, alternarFavorito } = useFavoritos();
  const { favoritos: favoritosNaUrl } = Route.useSearch();
  const [categoria, setCategoria] = useState<Categoria>("todos");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("relevantes");

  const alterarCategoria = (novaCategoria: Categoria) => {
    setCategoria(novaCategoria);
    setFiltros(FILTROS_VAZIOS);
  };
  const alterarFiltro = (chave: keyof Filtros, valor: string) => {
    setFiltros((atual) => {
      const proximo = { ...atual, [chave]: valor };
      if (chave === "marca") { proximo.modelo = ""; proximo.versao = ""; }
      if (chave === "modelo") proximo.versao = "";
      return proximo;
    });
  };

  const veiculos = useMemo(() => {
    const termoBusca = busca.trim().toLocaleLowerCase("pt-BR");
    const filtrados = veiculosDisponiveis.filter((veiculo) => {
      if (categoria !== "todos" && veiculo.categoria !== categoria) return false;
      if (favoritosNaUrl && !favoritos.has(veiculo.id)) return false;
      if (termoBusca) {
        const camposBusca = [veiculo.marca, veiculo.modelo, veiculo.versao, String(veiculo.ano), veiculo.cambio, veiculo.combustivel, veiculo.cilindrada, veiculo.tipo].filter((valor): valor is string => Boolean(valor));
        if (!camposBusca.some((valor) => valor.toLocaleLowerCase("pt-BR").includes(termoBusca))) return false;
      }
      if (filtros.marca && veiculo.marca !== filtros.marca) return false;
      if (filtros.modelo && veiculo.modelo !== filtros.modelo) return false;
      if (filtros.versao && veiculo.versao !== filtros.versao) return false;
      if (filtros.ano && veiculo.ano !== Number(filtros.ano)) return false;
      if (filtros.preco && !correspondeFaixaPreco(veiculo.preco, filtros.preco)) return false;
      if (filtros.km && !correspondeFaixaKm(veiculo.km, filtros.km)) return false;
      if (filtros.cambio && veiculo.cambio !== filtros.cambio) return false;
      if (filtros.combustivel && veiculo.combustivel !== filtros.combustivel) return false;
      if (filtros.cilindrada && !correspondeCilindrada(veiculo.cilindrada, filtros.cilindrada)) return false;
      if (filtros.tipo && veiculo.tipo !== filtros.tipo) return false;
      return true;
    });
    switch (ordenacao) {
      case "menor-preco": return [...filtrados].sort((a, b) => a.preco - b.preco);
      case "maior-preco": return [...filtrados].sort((a, b) => b.preco - a.preco);
      case "menor-km": return [...filtrados].sort((a, b) => a.km - b.km);
      case "maior-km": return [...filtrados].sort((a, b) => b.km - a.km);
      case "mais-novo": return [...filtrados].sort((a, b) => b.ano - a.ano);
      case "mais-antigo": return [...filtrados].sort((a, b) => a.ano - b.ano);
      default: return filtrados;
    }
  }, [veiculosDisponiveis, busca, categoria, favoritos, favoritosNaUrl, filtros, ordenacao]);

  const possuiFiltrosAtivos = Object.values(filtros).some(Boolean) || busca.trim().length > 0 || ordenacao !== "relevantes";
  const limparFiltros = () => { setFiltros(FILTROS_VAZIOS); setBusca(""); setOrdenacao("relevantes"); };
  const textoResultados = veiculos.length === 1 ? "1 veículo encontrado" : `${veiculos.length} veículos encontrados`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Gomes Motors</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{favoritosNaUrl ? "Meus favoritos" : "Estoque"}</h1>
        <p className="mt-3 text-muted-foreground">{favoritosNaUrl ? "Veículos que você salvou para consultar depois." : "Encontre seu próximo veículo."}</p>
      </header>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-sm border border-border bg-card p-1" role="tablist" aria-label="Categoria de veículos">
          {CATEGORIAS.map((cat) => <button key={cat.value} type="button" role="tab" aria-selected={categoria === cat.value} onClick={() => alterarCategoria(cat.value)} className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors ${categoria === cat.value ? "bg-gold text-gold-foreground" : "text-muted-foreground hover:text-foreground"}`}>{cat.icon && <cat.icon className="h-4 w-4" />}{cat.label}</button>)}
        </div>
        {!favoritosNaUrl && <button type="button" onClick={() => setFiltrosAbertos(true)} className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-sm font-medium text-foreground lg:hidden"><SlidersHorizontal className="h-4 w-4" />Filtrar veículos</button>}
      </div>

      {!favoritosNaUrl && <div className="mt-8 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <label className="relative block"><span className="sr-only">Buscar no estoque</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="search" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por marca, modelo, ano ou característica..." className="w-full rounded-sm border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold" /></label>
        <label className="relative block"><span className="sr-only">Ordenar veículos</span><select value={ordenacao} onChange={(event) => setOrdenacao(event.target.value as Ordenacao)} className="w-full appearance-none rounded-sm border border-border bg-secondary px-3 py-2.5 pr-9 text-sm text-foreground outline-none transition-colors focus:border-gold"><option value="relevantes">Mais relevantes</option><option value="menor-preco">Menor preço</option><option value="maior-preco">Maior preço</option><option value="menor-km">Menor quilometragem</option><option value="maior-km">Maior quilometragem</option><option value="mais-novo">Mais novos</option><option value="mais-antigo">Mais antigos</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /></label>
      </div>}

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="Filtros de estoque">
          {!favoritosNaUrl && <FiltrosLaterais veiculos={veiculosDisponiveis} categoria={categoria} filtros={filtros} onChange={alterarFiltro} />}
          {possuiFiltrosAtivos && !favoritosNaUrl && <button type="button" onClick={limparFiltros} className="mt-5 text-sm font-medium text-brand-red hover:underline">Limpar filtros</button>}
        </aside>

        {filtrosAbertos && !favoritosNaUrl && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <div className="absolute inset-0 bg-background/80" onClick={() => setFiltrosAbertos(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-lg border-t border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between"><h2 className="text-lg font-semibold text-foreground">Filtros</h2><button type="button" aria-label="Fechar filtros" onClick={() => setFiltrosAbertos(false)} className="flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent"><X className="h-5 w-5" /></button></div>
            <FiltrosLaterais veiculos={veiculosDisponiveis} categoria={categoria} filtros={filtros} onChange={alterarFiltro} />
            {possuiFiltrosAtivos && <button type="button" onClick={limparFiltros} className="mt-5 text-sm font-medium text-brand-red hover:underline">Limpar filtros</button>}
            <button type="button" onClick={() => setFiltrosAbertos(false)} className="mt-8 w-full rounded-sm bg-brand-red px-4 py-3 text-sm font-semibold text-brand-red-foreground transition-opacity hover:opacity-90">Ver resultados</button>
          </div>
        </div>}

        <section aria-label="Veículos do estoque">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{textoResultados}</p>
            <div className="flex items-center gap-4">
              {!favoritosNaUrl && favoritos.size > 0 && <Link to="/estoque" search={{ favoritos: true }} className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-foreground"><Heart className="h-4 w-4" />Favoritos ({favoritos.size})</Link>}
              {favoritosNaUrl && <a href="/estoque" className="text-sm font-medium text-gold hover:text-foreground">Voltar ao estoque</a>}
              {possuiFiltrosAtivos && !favoritosNaUrl && <button type="button" onClick={limparFiltros} className="text-sm font-medium text-gold hover:text-foreground">Limpar filtros</button>}
            </div>
          </div>

          {veiculos.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{veiculos.map((veiculo) => <CardVeiculo key={veiculo.id} veiculo={veiculo} favorito={favoritos.has(veiculo.id)} onAlternarFavorito={() => alternarFavorito(veiculo.id)} />)}</div> : <div className="rounded-sm border border-border bg-card px-6 py-14 text-center"><Heart className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-4 text-lg font-semibold text-foreground">{favoritosNaUrl ? "Você ainda não salvou veículos." : "Não encontramos veículos com esses critérios."}</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{favoritosNaUrl ? "Use o coração nos cards para guardar os veículos que mais interessarem." : "Tente remover alguns filtros ou realizar uma nova busca."}</p>{!favoritosNaUrl && <button type="button" onClick={limparFiltros} className="mt-6 rounded-sm bg-brand-red px-5 py-2.5 text-sm font-semibold text-brand-red-foreground transition-opacity hover:opacity-90">Limpar filtros</button>}</div>}
        </section>
      </div>
    </main>
  );
}
