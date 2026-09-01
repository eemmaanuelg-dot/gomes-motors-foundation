import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Bike, Car, MessageCircle } from "lucide-react";

import { VEICULOS } from "@/data/vehicles";

export const Route = createFileRoute("/estoque/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do veículo — Gomes Motors" },
      {
        name: "description",
        content: "Confira os detalhes do veículo disponível no estoque da Gomes Motors.",
      },
    ],
  }),
  component: DetalhesVeiculoPage,
});

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

function DetalhesVeiculoPage() {
  const { id } = Route.useParams();
  const veiculo = VEICULOS.find((item) => item.id === id);

  if (!veiculo) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to="/estoque"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao estoque
        </Link>
        <div className="mt-12 rounded-sm border border-border bg-card px-6 py-14 text-center">
          <h1 className="text-2xl font-bold text-foreground">Veículo não encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O veículo que você procura não está disponível no estoque.
          </p>
        </div>
      </main>
    );
  }

  const titulo = `${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""}`;
  const mensagem = encodeURIComponent(
    `Olá, Gomes Motors! Tenho interesse no ${titulo} ${veiculo.ano}, anunciado por ${formatarPreco(veiculo.preco)}. Gostaria de mais informações.`,
  );
  const whatsappUrl = `https://wa.me/55229999908461?text=${mensagem}`;

  const especificacoes = [
    { label: "Ano", value: String(veiculo.ano) },
    { label: "Quilometragem", value: formatarKm(veiculo.km) },
    ...(veiculo.cambio ? [{ label: "Câmbio", value: veiculo.cambio }] : []),
    ...(veiculo.combustivel ? [{ label: "Combustível", value: veiculo.combustivel }] : []),
    ...(veiculo.cilindrada ? [{ label: "Cilindrada", value: veiculo.cilindrada }] : []),
    ...(veiculo.tipo ? [{ label: "Tipo", value: veiculo.tipo }] : []),
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/estoque"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao estoque
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="overflow-hidden rounded-sm border border-border bg-card">
          <img
            src={veiculo.imagem}
            alt={`${titulo} ${veiculo.ano}`}
            width={1280}
            height={960}
            className="h-auto w-full object-cover"
          />
        </div>

        <section className="rounded-sm border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold">
            {veiculo.categoria === "motos" ? (
              <Bike className="h-4 w-4" />
            ) : (
              <Car className="h-4 w-4" />
            )}
            {veiculo.categoria === "motos" ? "Moto" : "Carro"}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-foreground">{titulo}</h1>
          <p className="mt-3 text-2xl font-bold text-gold">{formatarPreco(veiculo.preco)}</p>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border">
            {especificacoes.map((item) => (
              <div key={item.label} className="bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-red px-5 py-3 text-sm font-semibold text-brand-red-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-5 w-5" />
            Tenho interesse
          </a>
        </section>
      </div>
    </main>
  );
}
