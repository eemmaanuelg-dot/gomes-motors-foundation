import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Gomes Motors" },
      {
        name: "description",
        content:
          "Fale com a Gomes Motors em Campos dos Goytacazes, RJ. Visite nossa loja ou chame no WhatsApp.",
      },
      { property: "og:title", content: "Contato — Gomes Motors" },
      {
        property: "og:description",
        content: "Fale com a Gomes Motors em Campos dos Goytacazes, RJ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
          Gomes Motors
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Contato
        </h1>
        <p className="mt-3 text-muted-foreground">
          Estamos prontos para atender você em Campos dos Goytacazes, RJ.
        </p>
      </header>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-sm border border-border bg-card p-8">
          <MapPin className="h-7 w-7 text-gold" />
          <h2 className="mt-4 font-semibold text-foreground">Localização</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Campos dos Goytacazes, RJ
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Endereço completo e mapa na próxima etapa.
          </p>
        </div>
        <div className="rounded-sm border border-border bg-card p-8">
          <Phone className="h-7 w-7 text-gold" />
          <h2 className="mt-4 font-semibold text-foreground">WhatsApp</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Atendimento comercial direto pelo WhatsApp.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Integração na próxima etapa.
          </p>
        </div>
        <div className="rounded-sm border border-border bg-card p-8">
          <Clock className="h-7 w-7 text-gold" />
          <h2 className="mt-4 font-semibold text-foreground">Horários</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Segunda a sexta — 9h às 18h
            <br />
            Sábado — 9h às 13h
          </p>
        </div>
      </div>
    </main>
  );
}
