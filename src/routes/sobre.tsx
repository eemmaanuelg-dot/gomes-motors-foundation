import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Handshake, ShieldCheck, Target } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nós — Gomes Motors" },
      {
        name: "description",
        content:
          "Conheça a Gomes Motors: uma revendedora de veículos com foco em confiança, transparência, atendimento próximo e escolhas seguras.",
      },
      { property: "og:title", content: "Sobre nós — Gomes Motors" },
      {
        property: "og:description",
        content: "Confiança, transparência e atendimento próximo para encontrar o veículo certo para você.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SobrePage,
});

const valores = [
  {
    icon: ShieldCheck,
    titulo: "Transparência",
    texto: "Informações claras sobre veículos, condições comerciais e etapas da negociação.",
  },
  {
    icon: Handshake,
    titulo: "Atendimento próximo",
    texto: "Uma experiência comercial objetiva, respeitosa e focada no que realmente importa para cada cliente.",
  },
  {
    icon: Target,
    titulo: "Escolha consciente",
    texto: "Apresentamos opções para que você compare, avalie e tome sua decisão com mais segurança.",
  },
];

function SobrePage() {
  return (
    <main>
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Gomes Motors</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              A escolha certa começa aqui.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Somos uma revendedora de veículos com uma proposta simples: aproximar pessoas de boas oportunidades, com informação clara, atendimento próximo e uma negociação feita de forma transparente.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Quem somos</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground">Uma experiência de compra mais clara e humana.</h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
              <p>
                A Gomes Motors foi pensada para atender quem procura carros e motos novos, usados e seminovos sem transformar a compra em uma experiência complicada.
              </p>
              <p>
                Nosso trabalho combina variedade de opções, apresentação detalhada dos veículos e atendimento comercial direto. O objetivo é entender o momento do cliente e ajudar a encontrar uma alternativa que faça sentido para sua realidade.
              </p>
              <p>
                Além da compra, também trabalhamos com venda, troca, consignação e possibilidades de financiamento, reunindo diferentes caminhos em um só atendimento.
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Nossa proposta</p>
            <ul className="mt-6 space-y-5">
              {["Informação objetiva sobre cada veículo", "Atendimento comercial sem complicação", "Soluções para comprar, vender ou trocar", "Negociação orientada para uma decisão segura"].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">O que valorizamos</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground">Princípios que orientam nosso atendimento.</h2>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {valores.map(({ icon: Icon, titulo, texto }) => (
              <article key={titulo} className="rounded-sm border border-border bg-background p-7">
                <Icon className="h-7 w-7 text-gold" />
                <h3 className="mt-5 text-lg font-semibold text-foreground">{titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-sm border border-border bg-card p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Vamos conversar</p>
            <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Está procurando um veículo ou quer negociar o seu?</h2>
            <p className="mt-3 text-muted-foreground">Conheça nosso estoque ou fale diretamente com a equipe da Gomes Motors.</p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link to="/estoque" className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-5 py-3 text-sm font-semibold text-background hover:opacity-90">
              Ver estoque <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contato" className="inline-flex items-center justify-center rounded-sm border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent">
              Fale conosco
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
