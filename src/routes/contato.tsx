import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { criarWhatsAppUrl } from "@/lib/vehicle-utils";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Gomes Motors" },
      {
        name: "description",
        content:
          "Entre em contato com a Gomes Motors em Campos dos Goytacazes, RJ. Tire dúvidas, consulte veículos e fale com nossa equipe pelo WhatsApp.",
      },
      { property: "og:title", content: "Contato — Gomes Motors" },
      {
        property: "og:description",
        content: "Fale com a Gomes Motors e encontre a melhor forma de negociar seu próximo veículo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContatoPage,
});

const whatsappUrl = criarWhatsAppUrl(
  "Olá! Gostaria de falar com a Gomes Motors sobre um veículo e receber mais informações.",
);

function ContatoPage() {
  return (
    <main>
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Gomes Motors</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Fale conosco.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Quer saber mais sobre um veículo, negociar o seu, avaliar uma troca ou conversar sobre financiamento? Nossa equipe está pronta para atender você.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-sm border border-border bg-card p-7">
            <MapPin className="h-7 w-7 text-gold" />
            <h2 className="mt-5 text-lg font-semibold text-foreground">Onde estamos</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Campos dos Goytacazes, Rio de Janeiro.</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Atendimento na região de 28 de Março. O endereço completo e a integração com mapa serão adicionados quando a localização definitiva da loja for definida.</p>
          </article>

          <article className="rounded-sm border border-border bg-card p-7">
            <MessageCircle className="h-7 w-7 text-gold" />
            <h2 className="mt-5 text-lg font-semibold text-foreground">WhatsApp</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Atendimento comercial direto para dúvidas, propostas e informações sobre o estoque.</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-foreground">
              Chamar no WhatsApp <ArrowUpRight className="h-4 w-4" />
            </a>
          </article>

          <article className="rounded-sm border border-border bg-card p-7">
            <Clock className="h-7 w-7 text-gold" />
            <h2 className="mt-5 text-lg font-semibold text-foreground">Horário de atendimento</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Segunda a sexta — 9h às 18h<br />Sábado — 9h às 13h</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Para outros horários, consulte a disponibilidade da equipe pelo WhatsApp.</p>
          </article>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-sm border border-border bg-card p-7 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Atendimento comercial</p>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Conte o que você precisa.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Podemos ajudar em diferentes momentos da negociação: encontrar um carro ou uma moto no estoque, vender seu veículo, avaliar uma troca, conversar sobre consignação ou entender possibilidades de financiamento.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-red px-5 py-3 text-sm font-semibold text-brand-red-foreground hover:opacity-90">
                <MessageCircle className="h-4 w-4" />
                Falar pelo WhatsApp
              </a>
              <a href="tel:+55229999908461" className="inline-flex items-center justify-center gap-2 rounded-sm border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent">
                <Phone className="h-4 w-4" />
                Ver telefone
              </a>
            </div>
          </section>

          <section className="rounded-sm border border-border bg-card p-7 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Canais</p>
            <div className="mt-6 space-y-5">
              <div className="flex gap-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-semibold text-foreground">WhatsApp / telefone</h3>
                  <p className="mt-1 text-sm text-muted-foreground">(22) 99999-08461</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-semibold text-foreground">Atendimento online</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Use o WhatsApp para iniciar sua conversa com a equipe.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-semibold text-foreground">Região</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Campos dos Goytacazes — RJ</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-sm border border-dashed border-border bg-card/50 px-6 py-8 text-center">
          <MapPin className="mx-auto h-6 w-6 text-gold" />
          <h2 className="mt-3 text-lg font-semibold text-foreground">Localização no mapa</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Esta área já está preparada para receber o mapa da loja. Como o projeto ainda não possui um endereço físico definitivo, não vamos inventar uma localização ou apontar o cliente para um lugar incorreto.
          </p>
        </div>
      </section>
    </main>
  );
}
