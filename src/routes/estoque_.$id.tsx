import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowLeftRight,
  Bike,
  Calculator,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  MessageCircle,
  Share2,
  ShoppingCart,
} from "lucide-react";

import { publicVehicleCatalog } from "@/application/vehicles/public-catalog";
import type { Vehicle } from "@/domain/vehicles/types";
import { VEICULOS, obterTituloVeiculo } from "@/data/vehicles";
import { useFavoritos } from "@/lib/favorites";
import {
  criarWhatsAppUrl,
  formatarKm,
  formatarPreco,
  mensagemComercial,
  mensagemInteressePorTipo,
  obterVeiculosRelacionados,
} from "@/lib/vehicle-utils";

export const Route = createFileRoute("/estoque/$id")({
  loader: async ({ params }) => {
    const [veiculo, veiculos] = await Promise.all([
      publicVehicleCatalog.obterPorId(params.id),
      publicVehicleCatalog.listar(),
    ]);

    return {
      veiculo,
      relacionados: veiculo ? obterVeiculosRelacionados(veiculos, veiculo) : [],
    };
  },
  head: ({ params }) => {
    const veiculo = VEICULOS.find((item) => item.id === params.id);
    if (!veiculo) {
      return {
        meta: [
          { title: "Veículo não encontrado — Gomes Motors" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const titulo = `${obterTituloVeiculo(veiculo)} ${veiculo.ano} — Gomes Motors`;
    return {
      meta: [
        { title: titulo },
        { name: "description", content: veiculo.seoDescription },
        { property: "og:title", content: titulo },
        { property: "og:description", content: veiculo.seoDescription },
        { property: "og:image", content: veiculo.imagem },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: titulo },
        { name: "twitter:description", content: veiculo.seoDescription },
        { name: "twitter:image", content: veiculo.imagem },
      ],
    };
  },
  component: DetalhesVeiculoPage,
});

function StatusBadge({ status }: { status: Vehicle["status"] }) {
  const labels = { disponivel: "Disponível", reservado: "Reservado", vendido: "Vendido" };
  return (
    <span className="inline-flex rounded-sm border border-border bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
      {labels[status]}
    </span>
  );
}

function calcularParcela(valor: number, entrada: number, parcelas: number, taxaMensal: number) {
  const financiado = Math.max(valor - entrada, 0);
  if (financiado === 0) return 0;
  const taxa = taxaMensal / 100;
  if (taxa === 0) return financiado / parcelas;
  return (financiado * (taxa * (1 + taxa) ** parcelas)) / ((1 + taxa) ** parcelas - 1);
}

function formatarEntrada(valor: number) {
  return formatarPreco(valor);
}

function interpretarEntrada(valor: string) {
  const texto = valor.trim();
  if (!texto) return null;

  const normalizado = texto.replace(/\s/g, "").replace(/R\$/gi, "");
  const temVirgula = normalizado.includes(",");
  const temPonto = normalizado.includes(".");

  if (temVirgula || (temPonto && /\.\d{1,2}$/.test(normalizado))) {
    const semMilhar = normalizado.replace(/\./g, "").replace(",", ".");
    const numero = Number(semMilhar.replace(/[^\d.-]/g, ""));
    return Number.isFinite(numero) ? numero : null;
  }

  const numero = Number(normalizado.replace(/\D/g, ""));
  return Number.isFinite(numero) ? numero : null;
}

function SimulacaoFinanciamento({ veiculo }: { veiculo: Vehicle }) {
  const entradaMinima = Math.max(1000, veiculo.financiamento.entradaMinima);
  const valorMaximoEntrada = Math.max(entradaMinima, veiculo.preco - 0.01);
  const [entrada, setEntrada] = useState(formatarEntrada(entradaMinima));
  const [entradaNumerica, setEntradaNumerica] = useState(entradaMinima);
  const [entradaValida, setEntradaValida] = useState(true);
  const [parcelas, setParcelas] = useState(veiculo.financiamento.parcelas[0] ?? 36);

  const atualizarEntrada = (valorDigitado: string) => {
    if (!valorDigitado.trim()) {
      setEntrada("");
      setEntradaNumerica(entradaMinima);
      setEntradaValida(false);
      return;
    }

    const valor = interpretarEntrada(valorDigitado);
    if (valor === null) {
      setEntrada(valorDigitado);
      setEntradaValida(false);
      return;
    }

    const valorLimitado = Math.min(Math.max(valor, entradaMinima), valorMaximoEntrada);
    setEntrada(formatarEntrada(valorLimitado));
    setEntradaNumerica(valorLimitado);
    setEntradaValida(valor >= entradaMinima && valor < veiculo.preco);
  };

  const confirmarEntrada = () => {
    if (!entrada.trim()) {
      setEntrada("");
      setEntradaNumerica(entradaMinima);
      setEntradaValida(false);
      return;
    }

    const valor = interpretarEntrada(entrada);
    if (valor === null || valor < entradaMinima) {
      setEntrada(formatarEntrada(entradaMinima));
      setEntradaNumerica(entradaMinima);
      setEntradaValida(false);
      return;
    }

    if (valor >= veiculo.preco) {
      setEntrada(formatarEntrada(valorMaximoEntrada));
      setEntradaNumerica(valorMaximoEntrada);
      setEntradaValida(true);
      return;
    }

    setEntrada(formatarEntrada(valor));
    setEntradaNumerica(valor);
    setEntradaValida(true);
  };

  const entradaEfetiva = Math.min(Math.max(entradaNumerica, entradaMinima), valorMaximoEntrada);
  const financiado = Math.max(veiculo.preco - entradaEfetiva, 0);
  const percentualEntrada = veiculo.preco > 0 ? (entradaEfetiva / veiculo.preco) * 100 : 0;
  const parcela = useMemo(
    () => calcularParcela(veiculo.preco, entradaEfetiva, parcelas, veiculo.financiamento.taxaIndicativa),
    [entradaEfetiva, parcelas, veiculo],
  );
  const totalParcelas = parcela * parcelas;
  const totalEstimado = entradaEfetiva + totalParcelas;
  const taxaFormatada = veiculo.financiamento.taxaIndicativa.toFixed(2).replace(".", ",");
  const percentualFormatado = percentualEntrada.toFixed(2).replace(".", ",");
  const mensagemFinanciamento = [
    `Olá, Gomes Motors! Tenho interesse no ${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""} ${veiculo.ano}.`,
    "",
    "*Intenção de financiamento:*",
    `• Valor do veículo: ${formatarPreco(veiculo.preco)}`,
    `• Entrada pretendida: ${formatarPreco(entradaEfetiva)} (${percentualFormatado}% do valor)`,
    `• Prazo: ${parcelas}x`,
    `• Parcela estimada: ${formatarPreco(parcela)} / mês`,
    `• Total estimado das parcelas: ${formatarPreco(totalParcelas)}`,
    `• Total estimado com entrada: ${formatarPreco(totalEstimado)}`,
    `• Taxa indicativa utilizada: ${taxaFormatada}% a.m.`,
    "",
    "Gostaria de receber uma proposta real de financiamento com as condições disponíveis.",
  ].join("\n");

  return (
    <section className="rounded-sm border border-border bg-card p-6 sm:p-8" aria-labelledby="financiamento">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/10 text-gold">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h2 id="financiamento" className="text-xl font-bold text-foreground">Simule seu financiamento</h2>
          <p className="text-sm text-muted-foreground">Simulação demonstrativa, sem compromisso.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">Entrada</span>
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={entrada}
            onChange={(event) => atualizarEntrada(event.target.value)}
            onBlur={confirmarEntrada}
            aria-invalid={!entradaValida && Boolean(entrada)}
            placeholder="R$ 1.000,00"
            className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
          />
          <span className="mt-1 block text-xs text-muted-foreground">Entrada livre, mínimo de {formatarPreco(entradaMinima)}. Não é exigido percentual mínimo.</span>
          <span className="mt-1 block text-xs font-medium text-foreground">{percentualFormatado}% do valor do veículo</span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">Prazo</span>
          <select value={parcelas} onChange={(event) => setParcelas(Number(event.target.value))} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold">
            {veiculo.financiamento.parcelas.map((opcao) => <option key={opcao} value={opcao}>{opcao}x</option>)}
          </select>
        </label>
      </div>

      {!entradaValida && <p className="mt-2 text-xs font-medium text-brand-red">Informe uma entrada de pelo menos {formatarPreco(entradaMinima)} e inferior ao valor do veículo.</p>}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-border bg-secondary p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parcela estimada</p>
          <p className="mt-1 text-3xl font-bold text-gold">{formatarPreco(parcela)} <span className="text-sm font-medium text-muted-foreground">/ mês</span></p>
        </div>
        <div className="rounded-sm border border-border bg-secondary p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total estimado</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{formatarPreco(totalEstimado)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Entrada + {parcelas} parcelas</p>
        </div>
      </div>

      <div className="mt-3 rounded-sm border border-border bg-secondary/60 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Valor estimado financiado</p>
          <p className="text-sm font-bold text-foreground">{formatarPreco(financiado)}</p>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Taxa indicativa de {taxaFormatada} % a.m. Esta é uma estimativa educativa; condições reais dependem da análise de crédito e da instituição financeira. O valor apresentado não representa uma proposta ou aprovação de crédito.</p>
      </div>

      <a href={criarWhatsAppUrl(mensagemFinanciamento)} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-red px-5 py-3 text-sm font-semibold text-brand-red-foreground transition-opacity hover:opacity-90">
        <MessageCircle className="h-4 w-4" />
        Quero uma proposta real
      </a>
    </section>
  );
}

function DetalhesVeiculoPage() {
  const { veiculo, relacionados } = Route.useLoaderData();
  const { favoritos, alternarFavorito } = useFavoritos();
  const [imagemAtual, setImagemAtual] = useState(0);
  const [compartilhado, setCompartilhado] = useState(false);
  const [mostrarOpcoesInteresse, setMostrarOpcoesInteresse] = useState(false);

  if (!veiculo) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link to="/estoque" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Voltar ao estoque</Link>
        <div className="mt-12 rounded-sm border border-border bg-card px-6 py-14 text-center"><h1 className="text-2xl font-bold text-foreground">Veículo não encontrado</h1><p className="mt-2 text-sm text-muted-foreground">O veículo que você procura não está disponível no estoque.</p></div>
      </main>
    );
  }

  const titulo = `${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""}`;
  const imagens = veiculo.imagens.length > 0 ? veiculo.imagens : [veiculo.imagem];
  const imagemSelecionada = imagens[Math.min(imagemAtual, imagens.length - 1)] ?? veiculo.imagem;
  const favorito = favoritos.has(veiculo.id);

  const compartilhar = async () => {
    const dados = { title: `${titulo} ${veiculo.ano} — Gomes Motors`, text: veiculo.seoDescription, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(dados);
      else await navigator.clipboard.writeText(window.location.href);
      setCompartilhado(true);
      window.setTimeout(() => setCompartilhado(false), 2200);
    } catch {
      // Cancelamento do compartilhamento nativo não precisa gerar erro visual.
    }
  };

  const moverImagem = (direcao: -1 | 1) => {
    setImagemAtual((atual) => (atual + direcao + imagens.length) % imagens.length);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link to="/" className="hover:text-foreground">Início</Link><span>/</span><Link to="/estoque" className="hover:text-foreground">Estoque</Link><span>/</span><span className="text-foreground">{titulo}</span></nav>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/estoque" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="h-4 w-4" />Voltar ao estoque</Link>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => alternarFavorito(veiculo.id)} aria-pressed={favorito} className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent"><Heart className={`h-4 w-4 ${favorito ? "fill-brand-red text-brand-red" : ""}`} />{favorito ? "Favoritado" : "Favoritar"}</button>
          <button type="button" onClick={compartilhar} className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent">{compartilhado ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}{compartilhado ? "Link copiado" : "Compartilhar"}</button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div>
          <div className="relative overflow-hidden rounded-sm border border-border bg-card">
            <img src={imagemSelecionada} alt={`${titulo} ${veiculo.ano}`} width={1280} height={960} className="aspect-[4/3] h-auto w-full object-cover" />
            {imagens.length > 1 && <><button type="button" onClick={() => moverImagem(-1)} aria-label="Imagem anterior" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background"><ChevronLeft className="h-5 w-5" /></button><button type="button" onClick={() => moverImagem(1)} aria-label="Próxima imagem" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background"><ChevronRight className="h-5 w-5" /></button></>}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">{imagens.map((imagem, index) => <button key={`${imagem}-${index}`} type="button" onClick={() => setImagemAtual(index)} className={`overflow-hidden rounded-sm border ${index === imagemAtual ? "border-gold" : "border-border"}`} aria-label={`Selecionar imagem ${index + 1}`}><img src={imagem} alt="" width={320} height={240} className="aspect-[4/3] w-full object-cover" /></button>)}</div>
        </div>

        <section className="rounded-sm border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold">{veiculo.categoria === "motos" ? <Bike className="h-4 w-4" /> : <Car className="h-4 w-4" />}{veiculo.categoria === "motos" ? "Moto" : "Carro"}<StatusBadge status={veiculo.status} /></div>
          <h1 className="mt-3 text-3xl font-bold text-foreground">{titulo}</h1>
          <p className="mt-3 text-2xl font-bold text-gold">{formatarPreco(veiculo.preco)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{veiculo.ano} · {formatarKm(veiculo.km)}</p>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border">{[["Ano", String(veiculo.ano)], ["Quilometragem", formatarKm(veiculo.km)], ...(veiculo.cambio ? [["Câmbio", veiculo.cambio]] : []), ...(veiculo.combustivel ? [["Combustível", veiculo.combustivel]] : []), ...(veiculo.cilindrada ? [["Cilindrada", veiculo.cilindrada]] : []), ...(veiculo.tipo ? [["Tipo", veiculo.tipo]] : [])].map(([label, value]) => <div key={label} className="bg-card p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold text-foreground">{value}</p></div>)}</div>

          <button type="button" onClick={() => setMostrarOpcoesInteresse((aberto) => !aberto)} disabled={veiculo.status === "vendido"} className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold transition-opacity ${veiculo.status === "vendido" ? "cursor-not-allowed bg-secondary text-muted-foreground" : "bg-brand-red text-brand-red-foreground hover:opacity-90"}`}><MessageCircle className="h-5 w-5" />{veiculo.status === "disponivel" ? "Tenho interesse" : veiculo.status === "reservado" ? "Consultar disponibilidade" : "Veículo vendido"}</button>

          {mostrarOpcoesInteresse && veiculo.status !== "vendido" && <div className="mt-3 rounded-sm border border-border bg-secondary p-4" aria-label="Opções de interesse"><p className="text-sm font-bold text-foreground">Como podemos ajudar?</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">O veículo já está identificado. Escolha uma opção e continue o atendimento diretamente pelo WhatsApp.</p><div className="mt-4 grid gap-2 sm:grid-cols-3">
            <a href={criarWhatsAppUrl(mensagemInteressePorTipo(veiculo, "comprar"))} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-card px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"><ShoppingCart className="h-4 w-4" />Comprar</a>
            <a href={criarWhatsAppUrl(mensagemInteressePorTipo(veiculo, "trocar"))} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-card px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"><ArrowLeftRight className="h-4 w-4" />Trocar</a>
            <a href={criarWhatsAppUrl(mensagemInteressePorTipo(veiculo, "financiar"))} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-card px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"><Calculator className="h-4 w-4" />Financiar</a>
          </div></div>}
        </section>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <section className="rounded-sm border border-border bg-card p-6 sm:p-8"><h2 className="text-xl font-bold text-foreground">Sobre este veículo</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{veiculo.descricao}</p></section>
          <section className="rounded-sm border border-border bg-card p-6 sm:p-8"><h2 className="text-xl font-bold text-foreground">Equipamentos</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{veiculo.equipamentos.map((equipamento) => <div key={equipamento} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{equipamento}</div>)}</div></section>
          <section className="rounded-sm border border-border bg-card p-6 sm:p-8"><h2 className="text-xl font-bold text-foreground">Ficha técnica</h2><dl className="mt-5 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">{Object.entries(veiculo.fichaTecnica).map(([chave, valor]) => <div key={chave} className="bg-card p-4"><dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{chave.replace(/^./, (letra) => letra.toUpperCase())}</dt><dd className="mt-1 text-sm font-semibold text-foreground">{valor}</dd></div>)}</dl></section>
          <section className="rounded-sm border border-border bg-card p-6 sm:p-8"><h2 className="text-xl font-bold text-foreground">Outras formas de negociar</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{[["Financiar", "uma proposta de financiamento"], ["Trocar", "uma troca pelo seu veículo"], ["Consignar", "deixar seu veículo em consignação"], ["Vender", "avaliar seu veículo para venda"]].map(([label, assunto]) => <a key={label} href={criarWhatsAppUrl(mensagemComercial(veiculo, assunto ?? ""))} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"><MessageCircle className="h-4 w-4 text-gold" />{label}</a>)}</div></section>
        </div>
        <aside><SimulacaoFinanciamento veiculo={veiculo} /></aside>
      </div>

      {relacionados.length > 0 && <section className="mt-12" aria-labelledby="relacionados"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Você também pode gostar</p><h2 id="relacionados" className="mt-2 text-2xl font-bold text-foreground">Veículos relacionados</h2></div><Link to="/estoque" className="hidden text-sm font-semibold text-gold hover:text-foreground sm:inline-flex">Ver todo o estoque</Link></div><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{relacionados.map((relacionado) => <Link key={relacionado.id} to="/estoque/$id" params={{ id: relacionado.id }} className="group overflow-hidden rounded-sm border border-border bg-card"><div className="aspect-[4/3] overflow-hidden"><img src={relacionado.imagem} alt={`${relacionado.marca} ${relacionado.modelo} ${relacionado.ano}`} width={640} height={480} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /></div><div className="p-5"><h3 className="font-bold text-foreground">{relacionado.marca} {relacionado.modelo}{relacionado.versao ? ` ${relacionado.versao}` : ""}</h3><p className="mt-1 text-sm text-muted-foreground">{relacionado.ano} · {formatarKm(relacionado.km)}</p><p className="mt-3 font-bold text-gold">{formatarPreco(relacionado.preco)}</p></div></Link>)}</div></section>}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6"><Link to="/estoque" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Voltar ao estoque</Link><button type="button" onClick={compartilhar} className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-foreground">{compartilhado ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}{compartilhado ? "Link copiado" : "Compartilhar veículo"}</button></div>
    </main>
  );
}
