import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeDollarSign,
  Car,
  CreditCard,
  KeyRound,
  Repeat,
} from "lucide-react";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Gomes Motors" },
      {
        name: "description",
        content:
          "Comprar, vender, trocar, consignar e financiar: conheça os serviços da Gomes Motors em Campos dos Goytacazes, RJ.",
      },
      { property: "og:title", content: "Serviços — Gomes Motors" },
      {
        property: "og:description",
        content: "Comprar, vender, trocar, consignar e financiar com a Gomes Motors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicosPage,
});

const SERVICOS = [
  { icon: Car, title: "Comprar", description: "Veículos selecionados, revisados e com procedência garantida para você comprar com segurança." },
  { icon: BadgeDollarSign, title: "Vender", description: "Avaliamos seu veículo de forma justa e transparente, com pagamento rápido." },
  { icon: Repeat, title: "Trocar", description: "Use seu veículo atual como entrada e saia de carro novo com a melhor negociação." },
  { icon: KeyRound, title: "Consignar", description: "Deixe a venda do seu veículo com quem entende do mercado, sem preocupações." },
  { icon: CreditCard, title: "Financiar", description: "Condições flexíveis de financiamento com os principais bancos do mercado." },
];

function ServicosPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
          Gomes Motors
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Serviços
        </h1>
        <p className="mt-3 text-muted-foreground">
          Soluções completas para comprar, vender, trocar, consignar ou
          financiar seu veículo.
        </p>
      </header>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICOS.map((servico) => (
          <article
            key={servico.title}
            className="rounded-sm border border-border bg-card p-8"
          >
            <servico.icon className="h-9 w-9 text-gold" />
            <h2 className="mt-5 text-xl font-semibold text-foreground">
              {servico.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {servico.description}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
