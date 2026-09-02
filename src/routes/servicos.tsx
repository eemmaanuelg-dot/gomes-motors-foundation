import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeDollarSign,
  Car,
  CreditCard,
  KeyRound,
  MessageCircle,
  Repeat,
} from "lucide-react";

import { criarWhatsAppUrl, mensagemComercial } from "@/lib/vehicle-utils";

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

const WHATSAPP = "55229999908461";

const SERVICOS = [
  {
    id: "comprar",
    icon: Car,
    title: "Comprar",
    description: "Encontre carros e motos no estoque e veja informações detalhadas antes de falar com a equipe.",
    detalhe:
      "Escolha o veículo que mais combina com você, consulte preço, quilometragem, equipamentos e ficha técnica. Quando encontrar uma opção interessante, fale pelo WhatsApp para avançar na negociação.",
    acao: "Ver estoque",
    href: "/estoque",
  },
  {
    id: "vender",
    icon: BadgeDollarSign,
    title: "Vender",
    description: "Quer negociar seu veículo? Envie as informações para iniciarmos uma avaliação comercial.",
    detalhe:
      "Informe modelo, ano, quilometragem e as principais características do seu veículo. A equipe pode entender o perfil do veículo e conversar com você sobre as possibilidades de negociação.",
    acao: "Quero vender meu veículo",
    mensagem: "Quero vender meu veículo para a Gomes Motors e gostaria de saber como funciona a avaliação.",
  },
  {
    id: "trocar",
    icon: Repeat,
    title: "Trocar",
    description: "Use seu veículo atual em uma negociação para encontrar outra opção no estoque.",
    detalhe:
      "A troca permite considerar seu veículo atual dentro da negociação de outro carro ou moto. Envie os dados do seu veículo e conte qual tipo de veículo você procura.",
    acao: "Quero fazer uma troca",
    mensagem: "Quero trocar meu veículo e gostaria de entender as opções disponíveis na Gomes Motors.",
  },
  {
    id: "consignar",
    icon: KeyRound,
    title: "Consignar",
    description: "Coloque seu veículo em negociação com a Gomes Motors e converse sobre as condições de consignação.",
    detalhe:
      "Na consignação, o veículo é apresentado para venda dentro de uma negociação comercial previamente alinhada. As condições, documentação e responsabilidades devem ser definidas antes da entrada do veículo no processo.",
    acao: "Quero consignar meu veículo",
    mensagem: "Quero saber como funciona a consignação de veículos na Gomes Motors.",
  },
  {
    id: "financiar",
    icon: CreditCard,
    title: "Financiar",
    description: "Veja as opções disponíveis para financiar um veículo e faça uma simulação demonstrativa.",
    detalhe:
      "Nos detalhes de cada veículo disponível, você encontra uma simulação educativa de financiamento. Para uma proposta real, é necessário consultar as condições da instituição financeira e passar pela análise de crédito.",
    acao: "Ver veículos disponíveis",
    href: "/estoque",
  },
];

function ServicosPage() {
  return (
    <main>
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Gomes Motors</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Serviços</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Comprar, vender, trocar, consignar ou financiar. Escolha o caminho que você precisa e veja como podemos iniciar o atendimento.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16" aria-label="Serviços disponíveis">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICOS.map(({ id, icon: Icon, title, description }) => (
            <a
              key={id}
              href={`#${id}`}
              className="group rounded-sm border border-border bg-card p-7 transition-colors hover:border-gold hover:bg-accent/30"
            >
              <Icon className="h-9 w-9 text-gold" />
              <h2 className="mt-5 text-xl font-semibold text-foreground">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                Saiba mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Como funciona</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground">Escolha uma opção e comece o atendimento.</h2>
          </div>

          <div className="mt-10 space-y-5">
            {SERVICOS.map(({ id, icon: Icon, title, detalhe, acao, href, mensagem }) => (
              <article id={id} key={id} className="scroll-mt-24 rounded-sm border border-border bg-background p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-3">
                      <Icon className="h-7 w-7 text-gold" />
                      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{detalhe}</p>
                  </div>

                  {href ? (
                    <Link
                      to={href as "/estoque"}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-gold px-5 py-3 text-sm font-semibold text-background hover:opacity-90"
                    >
                      {acao} <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <a
                      href={criarWhatsAppUrl(mensagem ?? `Quero saber mais sobre o serviço ${title} na Gomes Motors.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-brand-red px-5 py-3 text-sm font-semibold text-brand-red-foreground hover:opacity-90"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {acao}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-sm border border-border bg-card p-7 sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Ainda em dúvida?</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">Fale diretamente com a Gomes Motors.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Explique o que você procura e direcionaremos o atendimento para a melhor opção dentro do projeto.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá! Gostaria de falar com a Gomes Motors sobre um veículo.")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-brand-red px-5 py-3 text-sm font-semibold text-brand-red-foreground hover:opacity-90 lg:mt-0"
          >
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
