import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bike, Car, ChevronDown, Heart, SlidersHorizontal, X } from "lucide-react";

import imgCivic from "@/assets/veiculos/honda-civic-exl.jpg";
import imgCorolla from "@/assets/veiculos/toyota-corolla-gli.jpg";
import imgPolo from "@/assets/veiculos/vw-polo.jpg";
import imgOnix from "@/assets/veiculos/chevrolet-onix.jpg";
import imgCb500 from "@/assets/veiculos/honda-cb500f.jpg";
import imgMt03 from "@/assets/veiculos/yamaha-mt03.jpg";

export const Route = createFileRoute("/estoque")({
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

type Veiculo = {
  id: string;
  categoria: "carros" | "motos";
  marca: string;
  modelo: string;
  versao?: string;
  ano: number;
  km: number;
  preco: number;
  cambio?: string;
  combustivel?: string;
  cilindrada?: string;
  tipo?: string;
  imagem: string;
};

const VEICULOS: Veiculo[] = [
  {
    id: "civic-exl",
    categoria: "carros",
    marca: "Honda",
    modelo: "Civic",
    versao: "EXL",
    ano: 2020,
    km: 65000,
    preco: 109900,
    cambio: "Automático CVT",
    combustivel: "Flex",
    imagem: imgCivic,
  },
  {
    id: "corolla-gli",
    categoria: "carros",
    marca: "Toyota",
    modelo: "Corolla",
    versao: "GLi",
    ano: 2021,
    km: 58000,
    preco: 119900,
    cambio: "Automático CVT",
    combustivel: "Flex",
    imagem: imgCorolla,
  },
  {
    id: "polo",
    categoria: "carros",
    marca: "Volkswagen",
    modelo: "Polo",
    versao: "Highline TSI",
    ano: 2023,
    km: 42000,
    preco: 79900,
    cambio: "Automático",
    combustivel: "Flex",
    imagem: imgPolo,
  },
  {
    id: "onix",
    categoria: "carros",
    marca: "Chevrolet",
    modelo: "Onix",
    versao: "LTZ",
    ano: 2022,
    km: 38000,
    preco: 72900,
    cambio: "Manual",
    combustivel: "Flex",
    imagem: imgOnix,
  },
  {
    id: "cb500f",
    categoria: "motos",
    marca: "Honda",
    modelo: "CB 500F",
    ano: 2022,
    km: 21000,
    preco: 34900,
    cilindrada: "500 cc",
    tipo: "Naked",
    imagem: imgCb500,
  },
  {
    id: "mt03",
    categoria: "motos",
    marca: "Yamaha",
    modelo: "MT-03",
    ano: 2023,
    km: 17000,
    preco: 31900,
    cilindrada: "321 cc",
    tipo: "Naked",
    imagem: imgMt03,
  },
];

const CATEGORIAS: { value: Categoria; label: string; icon?: typeof Car }[] = [
  { value: "todos", label: "Todos" },
  { value: "carros", label: "Carros", icon: Car },
  { value: "motos", label: "Motos", icon: Bike },
];

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatarKm(km: number) {
  return `${km.toLocaleString("pt-BR")} km`;
}

const FILTROS_CARROS: { grupo: string; opcoes: string[] }[] = [
  { grupo: "Marca", opcoes: ["Chevrolet", "Honda", "Toyota", "Volkswagen"] },
  { grupo: "Modelo", opcoes: ["Civic", "Corolla", "Onix", "Polo"] },
  { grupo: "Versão", opcoes: ["EXL", "GLi", "Highline TSI", "LTZ"] },
  { grupo: "Ano", opcoes: ["2020", "2021", "2022", "2023"] },
  { grupo: "Preço", opcoes: ["Até R$ 80 mil", "R$ 80 mil a R$ 110 mil", "Acima de R$ 110 mil"] },
  { grupo: "Quilometragem", opcoes: ["Até 40.000 km", "40.000 a 60.000 km", "Acima de 60.000 km"] },
  { grupo: "Câmbio", opcoes: ["Manual", "Automático", "Automático CVT"] },
  { grupo: "Combustível", opcoes: ["Flex", "Gasolina", "Diesel"] },
];

const FILTROS_MOTOS: { grupo: string; opcoes: string[] }[] = [
  { grupo: "Marca", opcoes: ["Honda", "Yamaha"] },
  { grupo: "Modelo", opcoes: ["CB 500F", "MT-03"] },
  { grupo: "Ano", opcoes: ["2022", "2023"] },
  { grupo: "Preço", opcoes: ["Até R$ 32 mil", "Acima de R$ 32 mil"] },
  { grupo: "Quilometragem", opcoes: ["Até 20.000 km", "Acima de 20.000 km"] },
  { grupo: "Cilindrada", opcoes: ["Até 400 cc", "Acima de 400 cc"] },
  { grupo: "Tipo", opcoes: ["Naked", "Esportiva", "Custom"] },
];

const VISIVEIS_INICIAL = 4;

function FiltroSelect({ grupo, opcoes }: { grupo: string; opcoes: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {grupo}
      </span>
      <div className="relative">
        <select
          className="w-full appearance-none rounded-sm border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-gold"
          defaultValue=""
        >
          <option value="">Todos</option>
          {opcoes.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </label>
  );
}

function FiltrosLaterais({ categoria }: { categoria: Categoria }) {
  const [expandido, setExpandido] = useState(false);

  const filtros = useMemo(() => {
    if (categoria === "carros") return FILTROS_CARROS;
    if (categoria === "motos") return FILTROS_MOTOS;
    // "todos": união sem duplicar grupos equivalentes
    const grupos = new Map<string, Set<string>>();
    for (const f of [...FILTROS_CARROS, ...FILTROS_MOTOS]) {
      if (!grupos.has(f.grupo)) grupos.set(f.grupo, new Set());
      f.opcoes.forEach((op) => grupos.get(f.grupo)!.add(op));
    }
    return [...grupos.entries()].map(([grupo, ops]) => ({
      grupo,
      opcoes: [...ops],
    }));
  }, [categoria]);

  const visiveis = expandido ? filtros : filtros.slice(0, VISIVEIS_INICIAL);

  return (
    <div className="space-y-4">
      {visiveis.map((f) => (
        <FiltroSelect key={f.grupo} grupo={f.grupo} opcoes={f.opcoes} />
      ))}
      {filtros.length > VISIVEIS_INICIAL && (
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-foreground"
        >
          {expandido ? "Ver menos filtros" : `Mais filtros (${filtros.length - VISIVEIS_INICIAL})`}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandido ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}

function CardVeiculo({
  veiculo,
  favorito,
  onAlternarFavorito,
}: {
  veiculo: Veiculo;
  favorito: boolean;
  onAlternarFavorito: () => void;
}) {
  const detalhes: string[] = [String(veiculo.ano), formatarKm(veiculo.km)];
  if (veiculo.cambio) detalhes.push(veiculo.cambio);
  if (veiculo.combustivel) detalhes.push(veiculo.combustivel);
  if (veiculo.cilindrada) detalhes.push(veiculo.cilindrada);
  if (veiculo.tipo) detalhes.push(veiculo.tipo);

  return (
    <article className="group overflow-hidden rounded-sm border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={veiculo.imagem}
          alt={`${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""} ${veiculo.ano}`}
          width={1280}
          height={960}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <button
          type="button"
          onClick={onAlternarFavorito}
          aria-pressed={favorito}
          aria-label={
            favorito
              ? `Remover ${veiculo.marca} ${veiculo.modelo} dos favoritos`
              : `Favoritar ${veiculo.marca} ${veiculo.modelo}`
          }
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-foreground transition-colors hover:bg-background"
        >
          <Heart
            className={`h-5 w-5 ${
              favorito ? "fill-brand-red text-brand-red" : "text-foreground"
            }`}
          />
        </button>
      </div>

      <div className="p-5">
        <h2 className="truncate text-lg font-bold text-foreground">
          {veiculo.marca} {veiculo.modelo}
        </h2>
        {veiculo.versao && (
          <p className="mt-0.5 text-sm text-muted-foreground">{veiculo.versao}</p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">{detalhes.join(" · ")}</p>
        <p className="mt-3 text-xl font-bold text-gold">{formatarPreco(veiculo.preco)}</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-sm border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Ver detalhes
          </button>
          <button
            type="button"
            className="rounded-sm bg-brand-red px-4 py-2.5 text-sm font-semibold text-brand-red-foreground transition-colors hover:opacity-90"
          >
            Tenho interesse
          </button>
        </div>
      </div>
    </article>
  );
}

function EstoquePage() {
  const [categoria, setCategoria] = useState<Categoria>("todos");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());

  const veiculos = useMemo(
    () => VEICULOS.filter((v) => categoria === "todos" || v.categoria === categoria),
    [categoria],
  );

  const alternarFavorito = (id: string) =>
    setFavoritos((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
          Gomes Motors
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Estoque</h1>
        <p className="mt-3 text-muted-foreground">Encontre seu próximo veículo.</p>
      </header>

      {/* Seletor de categoria */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex rounded-sm border border-border bg-card p-1"
          role="tablist"
          aria-label="Categoria de veículos"
        >
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.value}
              role="tab"
              aria-selected={categoria === cat.value}
              onClick={() => setCategoria(cat.value)}
              className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
                categoria === cat.value
                  ? "bg-gold text-gold-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.icon && <cat.icon className="h-4 w-4" />}
              {cat.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setFiltrosAbertos(true)}
          className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-sm font-medium text-foreground lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar veículos
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Filtros laterais — desktop */}
        <aside className="hidden lg:block" aria-label="Filtros de estoque">
          <FiltrosLaterais categoria={categoria} />
        </aside>

        {/* Filtros — gaveta mobile/tablet */}
        {filtrosAbertos && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
          >
            <div
              className="absolute inset-0 bg-background/80"
              onClick={() => setFiltrosAbertos(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-lg border-t border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
                <button
                  type="button"
                  aria-label="Fechar filtros"
                  onClick={() => setFiltrosAbertos(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FiltrosLaterais categoria={categoria} />
              <button
                type="button"
                onClick={() => setFiltrosAbertos(false)}
                className="mt-8 w-full rounded-sm bg-brand-red px-4 py-3 text-sm font-semibold text-brand-red-foreground"
              >
                Ver resultados
              </button>
            </div>
          </div>
        )}

        {/* Grade de veículos */}
        <section aria-label="Veículos do estoque">
          <p className="mb-4 text-sm text-muted-foreground">
            {veiculos.length} {veiculos.length === 1 ? "veículo" : "veículos"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {veiculos.map((v) => (
              <CardVeiculo
                key={v.id}
                veiculo={v}
                favorito={favoritos.has(v.id)}
                onAlternarFavorito={() => alternarFavorito(v.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
