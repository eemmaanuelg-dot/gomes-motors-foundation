import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone, X } from "lucide-react";

import { dealershipConfig } from "@/config/dealership";
import {
  WHATSAPP_DISPLAY,
  WHATSAPP_TELEFONE,
  WHATSAPP_TELEFONE_HREF,
} from "@/lib/contact";
import { criarWhatsAppUrl } from "@/lib/vehicle-utils";

const { company, contact, location, operations } = dealershipConfig;
const locationLabel = [location.city, location.state].filter(Boolean).join(", ");
const addressLabel = location.address || locationLabel;

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: `Contato — ${company.name}` },
      { name: "description", content: `Entre em contato com a ${company.name} em ${locationLabel}. Tire dúvidas, consulte veículos e fale com nossa equipe pelo WhatsApp.` },
      { property: "og:title", content: `Contato — ${company.name}` },
      { property: "og:description", content: `Fale com a ${company.name} e encontre a melhor forma de negociar seu próximo veículo.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContatoPage,
});

const whatsappUrl = criarWhatsAppUrl(`Olá! Gostaria de falar com a ${company.name} sobre um veículo e receber mais informações.`);

const contato = {
  email: contact.email,
  telefone: WHATSAPP_TELEFONE,
  telefoneHref: WHATSAPP_TELEFONE_HREF,
  whatsapp: WHATSAPP_DISPLAY,
  endereco: addressLabel,
};

function ContatoPage() {
  const [contatoAberto, setContatoAberto] = useState(false);

  return (
    <main>
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">{company.name}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Fale conosco.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Quer saber mais sobre um veículo, negociar o seu, avaliar uma troca ou conversar sobre financiamento? Nossa equipe está pronta para atender você.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-sm border border-border bg-card p-7">
            <MapPin className="h-7 w-7 text-gold" />
            <h2 className="mt-5 text-lg font-semibold text-foreground">Onde estamos</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{locationLabel}.</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">{location.address ? addressLabel : `Atendimento na região de ${location.city}.`}</p>
          </article>

          <article className="rounded-sm border border-border bg-card p-7">
            <MessageCircle className="h-7 w-7 text-gold" />
            <h2 className="mt-5 text-lg font-semibold text-foreground">WhatsApp</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Atendimento comercial direto para dúvidas, propostas e informações sobre o estoque.</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-foreground">Chamar no WhatsApp <ArrowUpRight className="h-4 w-4" /></a>
          </article>

          <article className="rounded-sm border border-border bg-card p-7">
            <Clock className="h-7 w-7 text-gold" />
            <h2 className="mt-5 text-lg font-semibold text-foreground">Horário de atendimento</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{operations.businessHours.map((hour, index) => <span key={hour}>{index > 0 && <br />}{hour}</span>)}</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Para outros horários, consulte a disponibilidade da equipe pelo WhatsApp.</p>
          </article>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-sm border border-border bg-card p-7 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Atendimento comercial</p>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Conte o que você precisa.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">Podemos ajudar em diferentes momentos da negociação: encontrar um carro ou uma moto no estoque, vender seu veículo, avaliar uma troca, conversar sobre consignação ou entender possibilidades de financiamento.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-red px-5 py-3 text-sm font-semibold text-brand-red-foreground hover:opacity-90"><MessageCircle className="h-4 w-4" />Falar pelo WhatsApp</a>
              <button type="button" onClick={() => setContatoAberto(true)} className="inline-flex items-center justify-center gap-2 rounded-sm border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent"><Phone className="h-4 w-4" />Ver contato</button>
            </div>
          </section>

          <section className="rounded-sm border border-border bg-card p-7 sm:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Canais</p>
            <div className="mt-6 space-y-5">
              <div className="flex gap-4"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><div><h3 className="font-semibold text-foreground">WhatsApp / telefone</h3><p className="mt-1 text-sm text-muted-foreground">{contato.whatsapp}</p></div></div>
              <div className="flex gap-4"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><div><h3 className="font-semibold text-foreground">Atendimento online</h3><p className="mt-1 text-sm text-muted-foreground">{contato.email || "E-mail comercial"}</p></div></div>
              <div className="flex gap-4"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><div><h3 className="font-semibold text-foreground">Região</h3><p className="mt-1 text-sm text-muted-foreground">{locationLabel}</p></div></div>
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-sm border border-dashed border-border bg-card/50 px-6 py-8 text-center">
          <MapPin className="mx-auto h-6 w-6 text-gold" />
          <h2 className="mt-3 text-lg font-semibold text-foreground">Localização no mapa</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">A localização exibida no contato é fictícia e serve apenas para apresentação do projeto. A integração com mapa poderá ser adicionada quando houver um endereço definitivo.</p>
        </div>
      </section>

      {contatoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setContatoAberto(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="contato-dialog-title" className="relative w-full max-w-md rounded-sm border border-border bg-card p-7 shadow-2xl sm:p-8">
            <button type="button" onClick={() => setContatoAberto(false)} aria-label="Fechar contato" className="absolute right-4 top-4 rounded-sm p-2 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="h-5 w-5" /></button>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">{company.name}</p>
            <h2 id="contato-dialog-title" className="mt-2 pr-8 text-2xl font-bold text-foreground">Nossos contatos</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Escolha a melhor forma de falar com a nossa equipe.</p>
            <div className="mt-6 space-y-4">
              {contato.email && <a href={`mailto:${contato.email}`} className="flex items-start gap-4 rounded-sm border border-border p-4 hover:bg-accent"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><span><strong className="block text-sm text-foreground">E-mail</strong><span className="text-sm text-muted-foreground">{contato.email}</span></span></a>}
              <a href={contato.telefoneHref} className="flex items-start gap-4 rounded-sm border border-border p-4 hover:bg-accent"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><span><strong className="block text-sm text-foreground">Telefone para ligação</strong><span className="text-sm text-muted-foreground">{contato.telefone}</span></span></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-sm border border-border p-4 hover:bg-accent"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><span><strong className="block text-sm text-foreground">WhatsApp</strong><span className="text-sm text-muted-foreground">{contato.whatsapp}</span></span></a>
              <div className="flex items-start gap-4 rounded-sm border border-border p-4"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><span><strong className="block text-sm text-foreground">Endereço da loja</strong><span className="text-sm leading-6 text-muted-foreground">{contato.endereco}</span></span></div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
