import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bike, Car, SlidersHorizontal, X } from "lucide-react";

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

const CATEGORIAS: { value: Categoria; label: string; icon?: typeof Car }[] = [
  { value: "todos", label: "Todos" },
  { value: "carros", label: "Carros", icon: Car },
  { value: "motos", label: "Motos", icon: Bike },
];

function FiltrosLaterais() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
          Categoria
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><Car className="h-4 w-4 text-gold" /> Carros</li>
          <li className="flex items-center gap-2"><Bike className="h-4 w-4 text-gold" /> Motos</li>
        </ul>
      </div>
      {["Marca", "Ano", "Preço", "Câmbio"].map((grupo) => (
        <div key={grupo} className="border-t border-border pt-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground">
            {grupo}
          </h3>
          <p className="text-xs text-muted-foreground">
            Filtro disponível na próxima etapa.
          </p>
        </div>
      ))}
    </div>
  );
}

function EstoquePage() {
  const [categoria, setCategoria] = useState<Categoria>("todos");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
          Gomes Motors
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Estoque
        </h1>
        <p className="mt-3 text-muted-foreground">
          Carros e motos selecionados, revisados e prontos para você.
        </p>
      </header>

      {/* Seletor de categoria */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-sm border border-border bg-card p-1" role="tablist" aria-label="Categoria de veículos">
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
          Filtros
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Filtros laterais — desktop */}
        <aside className="hidden lg:block" aria-label="Filtros de estoque">
          <FiltrosLaterais />
        </aside>

        {/* Filtros — gaveta mobile/tablet */}
        {filtrosAbertos && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
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
              <FiltrosLaterais />
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

        {/* Grade de veículos — área reservada */}
        <section aria-label="Veículos do estoque">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-card text-muted-foreground"
              >
                <Car className="h-8 w-8" />
                <p className="text-sm">Veículo em breve</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            O catálogo completo de veículos será disponibilizado na próxima etapa do projeto.
          </p>
        </section>
      </div>
    </main>
  );
}
