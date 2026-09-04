import { useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calculator, Check, ChevronLeft, ChevronRight, Heart, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { VEICULOS, obterTituloVeiculo } from "@/data/vehicles";
import type { Veiculo } from "@/data/vehicles";

export const Route = createFileRoute("/estoque/$id")({
  component: DetalhesVeiculo,
});

type Vehicle = Veiculo;

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarEntrada(valor: number) {
  return formatarPreco(valor);
}

function interpretarEntrada(valor: string) {
  const normalizado = valor.replace(/[^\d,.-]/g, "").trim();
  if (!normalizado) return null;

  let numero: number;
  if (normalizado.includes(",")) {
    numero = Number(normalizado.replace(/\./g, "").replace(",", "."));
  } else {
    const pontos = (normalizado.match(/\./g) ?? []).length;
    numero = pontos > 1 ? Number(normalizado.replace(/\./g, "")) : Number(normalizado);
  }

  return Number.isFinite(numero) ? numero : null;
}

function calcularParcela(preco: number, entrada: number, parcelas: number, taxaMensal: number) {
  const principal = Math.max(preco - entrada, 0);
  const taxa = taxaMensal / 100;
  if (principal <= 0) return 0;
  if (taxa === 0) return principal / parcelas;
  return principal * (taxa * (1 + taxa) ** parcelas) / ((1 + taxa) ** parcelas - 1);
}

function SimulacaoFinanciamento({ veiculo }: { veiculo: Vehicle }) {
  const entradaMinima = 1000;
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

    setEntrada(valorDigitado);
    setEntradaNumerica(valor);
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
            onFocus={(event) => event.currentTarget.select()}
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
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Valor financiado</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{formatarPreco(financiado)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Entrada de {percentualFormatado}%</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-sm border border-border p-4">
          <p className="text-xs text-muted-foreground">Prazo</p>
          <p className="mt-1 font-semibold text-foreground">{parcelas}x</p>
        </div>
        <div className="rounded-sm border border-border p-4">
          <p className="text-xs text-muted-foreground">Total das parcelas</p>
          <p className="mt-1 font-semibold text-foreground">{formatarPreco(totalParcelas)}</p>
        </div>
        <div className="rounded-sm border border-border p-4">
          <p className="text-xs text-muted-foreground">Total com entrada</p>
          <p className="mt-1 font-semibold text-foreground">{formatarPreco(totalEstimado)}</p>
        </div>
      </div>

      <a
        href={`https://wa.me/5522999999999?text=${encodeURIComponent(mensagemFinanciamento)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-4 py-3 text-sm font-bold text-black transition hover:brightness-95"
      >
        <MessageCircle className="h-4 w-4" />
        Quero financiar este veículo
      </a>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">A simulação é apenas demonstrativa. A aprovação, taxa e condições finais dependem da análise de crédito e da instituição financeira.</p>
    </section>
  );
}

function DetalhesVeiculo() {
  const { id } = useParams({ from: "/estoque/$id" });
  const veiculo = VEICULOS.find((item) => item.id === id);
  const [imagemAtual, setImagemAtual] = useState(0);
  const [favorito, setFavorito] = useState(false);

  if (!veiculo) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link to="/estoque" className="inline-flex items-center gap-2 text-sm font-semibold text-gold"><ArrowLeft className="h-4 w-4" />Voltar ao estoque</Link>
        <div className="mt-8 rounded-sm border border-border bg-card p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Veículo não encontrado</h1>
          <p className="mt-2 text-muted-foreground">O veículo solicitado não está disponível no estoque.</p>
        </div>
      </main>
    );
  }

  const imagens = veiculo.imagens.length ? veiculo.imagens : [veiculo.imagem];
  const imagemAnterior = () => setImagemAtual((atual) => (atual - 1 + imagens.length) % imagens.length);
  const imagemSeguinte = () => setImagemAtual((atual) => (atual + 1) % imagens.length);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/estoque" className="inline-flex items-center gap-2 text-sm font-semibold text-gold"><ArrowLeft className="h-4 w-4" />Voltar ao estoque</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]">
        <section>
          <div className="relative overflow-hidden rounded-sm border border-border bg-secondary">
            <img src={imagens[imagemAtual]} alt={obterTituloVeiculo(veiculo)} className="aspect-[16/10] w-full object-cover" />
            {imagens.length > 1 && <>
              <button type="button" aria-label="Imagem anterior" onClick={imagemAnterior} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" aria-label="Próxima imagem" onClick={imagemSeguinte} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white"><ChevronRight className="h-5 w-5" /></button>
            </>}
          </div>
          {imagens.length > 1 && <div className="mt-3 grid grid-cols-3 gap-3">{imagens.map((imagem, index) => <button key={imagem} type="button" onClick={() => setImagemAtual(index)} className={`overflow-hidden rounded-sm border ${index === imagemAtual ? "border-gold" : "border-border"}`}><img src={imagem} alt={`${obterTituloVeiculo(veiculo)} - foto ${index + 1}`} className="aspect-[4/3] w-full object-cover" /></button>)}</div>}
        </section>

        <aside className="space-y-5">
          <div className="rounded-sm border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">{veiculo.categoria === "motos" ? "Moto" : "Carro"}</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground">{obterTituloVeiculo(veiculo)}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{veiculo.ano} • {veiculo.km.toLocaleString("pt-BR")} km</p>
              </div>
              <button type="button" onClick={() => setFavorito((valor) => !valor)} aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${favorito ? "border-gold text-gold" : "border-border text-muted-foreground"}`}><Heart className={`h-5 w-5 ${favorito ? "fill-current" : ""}`} /></button>
            </div>
            <p className="mt-6 text-3xl font-black text-foreground">{formatarPreco(veiculo.preco)}</p>
            <a href={`https://wa.me/5522999999999?text=${encodeURIComponent(`Olá, Gomes Motors! Tenho interesse no ${obterTituloVeiculo(veiculo)} ${veiculo.ano}.`)}`} target="_blank" rel="noreferrer" className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-4 py-3 text-sm font-bold text-black"><MessageCircle className="h-4 w-4" />Tenho interesse</a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[['Câmbio', veiculo.cambio], ['Combustível', veiculo.combustivel], ['Carroceria', veiculo.tipo], ['Cilindrada', veiculo.cilindrada]].filter(([, valor]) => valor).map(([titulo, valor]) => <div key={titulo} className="rounded-sm border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{titulo}</p><p className="mt-1 text-sm font-semibold text-foreground">{valor}</p></div>)}
          </div>
        </aside>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]">
        <div className="space-y-8">
          <section className="rounded-sm border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground">Sobre este veículo</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{veiculo.descricao}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">{veiculo.equipamentos.map((equipamento) => <div key={equipamento} className="flex items-center gap-2 text-sm text-foreground"><Check className="h-4 w-4 shrink-0 text-gold" />{equipamento}</div>)}</div>
          </section>

          <section className="rounded-sm border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-gold" /><h2 className="text-xl font-bold text-foreground">Ficha técnica</h2></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">{Object.entries(veiculo.fichaTecnica).map(([chave, valor]) => <div key={chave} className="border-b border-border pb-3"><p className="text-xs uppercase tracking-wider text-muted-foreground">{chave}</p><p className="mt-1 text-sm font-semibold text-foreground">{valor}</p></div>)}</div>
          </section>
        </div>

        <div><SimulacaoFinanciamento veiculo={veiculo} /></div>
      </div>

      <section className="mt-8 rounded-sm border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3"><Star className="h-5 w-5 text-gold" /><div><h2 className="text-xl font-bold text-foreground">Compra segura</h2><p className="text-sm text-muted-foreground">Atendimento para esclarecer dúvidas e montar sua proposta.</p></div></div>
      </section>
    </main>
  );
}
