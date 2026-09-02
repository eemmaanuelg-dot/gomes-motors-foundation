import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeDollarSign,
  Car,
  CreditCard,
  KeyRound,
  MapPin,
  Repeat,
} from "lucide-react";
import heroImage from "../assets/hero-showroom.jpg";
import { VEICULOS, obterTituloVeiculo } from "@/data/vehicles";
import { formatarKm, formatarPreco } from "@/lib/vehicle-utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gomes Motors — A escolha certa começa aqui" },
      {
        name: "description",
        content:
          "Revenda de veículos em Campos dos Goytacazes, RJ. Compre, venda, troque, consigne ou financie seu veículo com a Gomes Motors.",
      },
      { property: "og:title", content: "Gomes Motors — A escolha certa começa aqui" },
      {
        property: "og:description",
        content:
          "Veículos selecionados com transparência e atendimento próximo em Campos dos Goytacazes, RJ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const SERVICES = [
  { icon: Car, title: "Comprar", description: "Veículos selecionados, revisados e com procedência garantida." },
  { icon: BadgeDollarSign, title: "Vender", description: "Avaliação justa e pagamento rápido pelo seu veículo." },
  { icon: Repeat, title: "Trocar", description: "Use seu carro atual como entrada e saia de veículo novo." },
  { icon: KeyRound, title: "Consignar", description: "Deixe seu veículo com quem sabe vender, sem preocupação." },
  { icon: CreditCard, title: "Financiar", description: "Condições flexíveis com os principais bancos do mercado." },
];

const VEICULOS_DESTAQUE = VEICULOS.filter(
  (veiculo) => veiculo.destaque && veiculo.status !== "vendido",
).slice(0, 3);

function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Veículo premium em showroom da Gomes Motors"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            Gomes Motors
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            A escolha certa <span className="text-gold">começa aqui.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Veículos selecionados com rigor, transparência em cada negociação e
            atendimento próximo em Campos dos Goytacazes. Comprar, vender ou
            trocar de veículo nunca foi tão simples.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/estoque"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-red px-7 py-3.5 text-sm font-semibold text-brand-red-foreground transition-opacity hover:opacity-90"
            >
              Ver estoque
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/servicos"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-gold/60 px-7 py-3.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              Vender meu veículo
            </Link>
          </div>
        </div>
      </section>

      {/* Acesso rápido aos serviços */}
      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            O que você procura hoje?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
            Soluções completas para cada momento da sua jornada automotiva.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SERVICES.map((service) => (
              <Link
                key={service.title}
                to="/servicos"
                className="group flex flex-col items-center gap-4 rounded-sm border border-border bg-card p-6 text-center transition-colors hover:border-gold/50"
              >
                <service.icon className="h-8 w-8 text-gold transition-transform group-hover:scale-105" />
                <div>
                  <h3 className="font-semibold text-foreground">{service.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Veículos em destaque */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
                Seleção Gomes Motors
              </p>
              <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                Veículos em destaque
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Confira alguns dos veículos disponíveis em nosso estoque e encontre a opção que mais combina com você.
              </p>
            </div>
            <Link
              to="/estoque"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-foreground"
            >
              Ver estoque completo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VEICULOS_DESTAQUE.map((veiculo) => (
              <article
                key={veiculo.id}
                className="overflow-hidden rounded-sm border border-border bg-card"
              >
                <Link to="/estoque/$id" params={{ id: veiculo.id }} className="block">
                  <img
                    src={veiculo.imagem}
                    alt={obterTituloVeiculo(veiculo)}
                    width={800}
                    height={600}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                </Link>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                    {veiculo.categoria === "carros" ? "Carro" : "Moto"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {obterTituloVeiculo(veiculo)}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{veiculo.ano}</span>
                    <span>{formatarKm(veiculo.km)}</span>
                    {veiculo.cambio && <span>{veiculo.cambio}</span>}
                  </div>
                  <p className="mt-4 text-xl font-bold text-foreground">
                    {formatarPreco(veiculo.preco)}
                  </p>
                  <Link
                    to="/estoque/$id"
                    params={{ id: veiculo.id }}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-foreground"
                  >
                    Ver detalhes
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Apresentação da Gomes Motors */}
      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
                Sobre a Gomes Motors
              </p>
              <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                Confiança que se constrói em cada negociação
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                A Gomes Motors nasceu com uma proposta simples: aproximar pessoas de boas oportunidades no mercado automotivo, com informação clara, atendimento próximo e uma negociação transparente.
              </p>
              <Link
                to="/sobre"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-foreground"
              >
                Conhecer a Gomes Motors
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-sm border border-border bg-card p-7 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Nossa proposta
              </p>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
                <li>Informação objetiva sobre cada veículo.</li>
                <li>Atendimento comercial próximo e sem complicação.</li>
                <li>Soluções para comprar, vender, trocar ou consignar.</li>
                <li>Orientação para uma decisão mais segura.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Localização e contato */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 rounded-sm border border-border bg-card p-8 sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-gold">
                <MapPin className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.25em]">
                  Visite nossa loja
                </p>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
                Campos dos Goytacazes, RJ
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Atendimento na região de 28 de Março. Para consultar veículos,
                condições de negociação e disponibilidade da equipe, fale conosco.
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                WhatsApp: (22) 99999-08461
              </p>
            </div>
            <Link
              to="/contato"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-red px-7 py-3.5 text-sm font-semibold text-brand-red-foreground transition-opacity hover:opacity-90"
            >
              Fale conosco
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
