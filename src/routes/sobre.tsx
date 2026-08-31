import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nós — Gomes Motors" },
      {
        name: "description",
        content:
          "Conheça a Gomes Motors, revenda de veículos em Campos dos Goytacazes, RJ. Confiança, transparência e atendimento próximo.",
      },
      { property: "og:title", content: "Sobre nós — Gomes Motors" },
      {
        property: "og:description",
        content: "Confiança, transparência e atendimento próximo em Campos dos Goytacazes, RJ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
          Gomes Motors
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Sobre nós
        </h1>
        <p className="mt-3 text-muted-foreground">
          Área reservada para a história, os valores e a equipe da Gomes
          Motors. Conteúdo institucional completo na próxima etapa do projeto.
        </p>
      </header>
    </main>
  );
}
