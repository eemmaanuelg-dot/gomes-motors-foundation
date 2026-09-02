import { FormEvent, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeDollarSign,
  Bike,
  Car,
  CheckCircle2,
  CreditCard,
  FileText,
  KeyRound,
  MessageCircle,
  Repeat,
  Search,
  Upload,
} from "lucide-react";

import { VEICULOS, obterTituloVeiculo } from "@/data/vehicles";
import { criarWhatsAppUrl, formatarPreco } from "@/lib/vehicle-utils";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Gomes Motors" },
      {
        name: "description",
        content:
          "Comprar, vender, trocar, consignar e financiar: escolha um serviço e envie seus dados para atendimento da Gomes Motors.",
      },
      { property: "og:title", content: "Serviços — Gomes Motors" },
      {
        property: "og:description",
        content: "Fluxos comerciais para comprar, vender, trocar, consignar e financiar veículos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicosPage,
});

const SERVICOS = [
  { id: "comprar", icon: Car, title: "Comprar", description: "Escolha um veículo do estoque e envie seus dados para iniciar o atendimento." },
  { id: "vender", icon: BadgeDollarSign, title: "Vender", description: "Envie os dados do seu veículo para uma avaliação comercial." },
  { id: "trocar", icon: Repeat, title: "Trocar", description: "Escolha o veículo desejado e informe os dados do seu veículo atual." },
  { id: "consignar", icon: KeyRound, title: "Consignar", description: "Envie seu veículo para analisarmos uma possível consignação." },
  { id: "financiar", icon: CreditCard, title: "Financiar", description: "Escolha um veículo, simule entrada e prazo e peça uma proposta real." },
];

const inputClass =
  "w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold";
const labelClass = "mb-1.5 block text-sm font-semibold text-foreground";

function Campo({ label, name, type = "text", required = false, placeholder, min, step }: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}{required && " *"}</span>
      <input className={inputClass} name={name} type={type} required={required} placeholder={placeholder} min={min} step={step} />
    </label>
  );
}

function SelectCampo({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}{required && " *"}</span>
      <select className={inputClass} name={name} required={required} defaultValue="">
        <option value="">Selecione</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TextareaCampo({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return (
    <label className="block sm:col-span-2">
      <span className={labelClass}>{label}</span>
      <textarea className={`${inputClass} min-h-24 resize-y`} name={name} placeholder={placeholder} />
    </label>
  );
}

function FotosCampo() {
  return (
    <label className="block sm:col-span-2">
      <span className={labelClass}>Fotos do veículo</span>
      <span className="mb-2 block text-xs text-muted-foreground">Frente, traseira, laterais, interior e painel/quilometragem.</span>
      <span className="flex cursor-pointer items-center gap-2 rounded-sm border border-dashed border-border bg-secondary px-3 py-3 text-sm text-muted-foreground hover:border-gold hover:text-foreground">
        <Upload className="h-4 w-4 text-gold" />
        Selecionar fotos
        <input className="sr-only" name="fotos" type="file" accept="image/*" multiple />
      </span>
      <span className="mt-2 block text-xs text-muted-foreground">As fotos selecionadas não são anexadas automaticamente ao WhatsApp; ao abrir a conversa, envie-as também pelo aplicativo.</span>
    </label>
  );
}

function VeiculoSelector({ value, onChange, label = "Veículo desejado" }: { value: string; onChange: (value: string) => void; label?: string }) {
  const [busca, setBusca] = useState("");
  const disponiveis = VEICULOS.filter((veiculo) => veiculo.status !== "vendido");
  const filtrados = disponiveis.filter((veiculo) => {
    const texto = `${veiculo.marca} ${veiculo.modelo} ${veiculo.versao ?? ""}`.toLowerCase();
    return texto.includes(busca.toLowerCase());
  });

  return (
    <div className="space-y-3">
      <label className="block">
        <span className={labelClass}>{label} *</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className={`${inputClass} pl-9`} value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por marca ou modelo" />
        </div>
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        {filtrados.map((veiculo) => {
          const selecionado = value === veiculo.id;
          return (
            <button
              key={veiculo.id}
              type="button"
              onClick={() => onChange(veiculo.id)}
              className={`flex items-center gap-3 rounded-sm border p-3 text-left transition-colors ${selecionado ? "border-gold bg-gold/10" : "border-border bg-secondary hover:border-gold/60"}`}
            >
              <img src={veiculo.imagem} alt="" className="h-16 w-20 rounded-sm object-cover" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">{obterTituloVeiculo(veiculo)}</span>
                <span className="block text-xs text-muted-foreground">{veiculo.ano} · {formatarPreco(veiculo.preco)}</span>
                <span className="block text-xs text-muted-foreground">{veiculo.categoria === "motos" ? "Moto" : "Carro"}</span>
              </span>
              {selecionado && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-gold" />}
            </button>
          );
        })}
      </div>
      {filtrados.length === 0 && <p className="text-sm text-muted-foreground">Nenhum veículo encontrado.</p>}
    </div>
  );
}

function FormularioComprar() {
  const [veiculoId, setVeiculoId] = useState("");
  const veiculo = VEICULOS.find((item) => item.id === veiculoId);
  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    if (!veiculo) return;
    const mensagem = [
      "Olá! Tenho interesse em comprar este veículo na Gomes Motors.",
      "",
      `Veículo: ${obterTituloVeiculo(veiculo)} ${veiculo.ano}`,
      `Preço anunciado: ${formatarPreco(veiculo.preco)}`,
      `Nome: ${String(dados.get("nome") ?? "")}`,
      `Cidade: ${String(dados.get("cidade") ?? "")}`,
      `Forma de pagamento: ${String(dados.get("pagamento") ?? "")}`,
      `Observações: ${String(dados.get("observacoes") || "Não informado")}`,
    ].join("\n");
    window.open(criarWhatsAppUrl(mensagem), "_blank", "noopener,noreferrer");
  };
  return (
    <form onSubmit={enviar} className="space-y-6">
      <VeiculoSelector value={veiculoId} onChange={setVeiculoId} />
      <input type="hidden" name="veiculo" value={veiculoId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Nome" name="nome" required placeholder="Seu nome" />
        <Campo label="Cidade" name="cidade" required placeholder="Sua cidade" />
        <SelectCampo label="Forma de pagamento" name="pagamento" required options={["À vista", "Financiamento", "Consórcio", "Ainda não decidi"]} />
        <TextareaCampo label="Observações" name="observacoes" placeholder="Conte algo que possa ajudar no atendimento." />
      </div>
      <BotaoWhatsApp disabled={!veiculo} texto="Enviar interesse pelo WhatsApp" />
    </form>
  );
}

function FormularioVeiculo({ tipo }: { tipo: "vender" | "consignar" }) {
  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    const fotos = dados.get("fotos") as FileList | null;
    const nomeServico = tipo === "vender" ? "avaliação para venda" : "consignação";
    const mensagem = [
      `Olá! Quero solicitar ${nomeServico} de um veículo na Gomes Motors.`,
      "",
      "DADOS DO VEÍCULO",
      `Marca: ${String(dados.get("marca") ?? "")}`,
      `Modelo: ${String(dados.get("modelo") ?? "")}`,
      `Versão: ${String(dados.get("versao") || "Não informado")}`,
      `Ano: ${String(dados.get("ano") ?? "")}`,
      `Quilometragem: ${String(dados.get("km") ?? "")} km`,
      `Combustível: ${String(dados.get("combustivel") ?? "")}`,
      `Câmbio: ${String(dados.get("cambio") ?? "")}`,
      `Estado de conservação: ${String(dados.get("conservacao") ?? "")}`,
      `Valor desejado: ${String(dados.get("valor") || "Não informado")}`,
      "",
      "COMERCIAL / DOCUMENTAÇÃO",
      `Financiado?: ${String(dados.get("financiado") ?? "")}`,
      `Quitado?: ${String(dados.get("quitado") ?? "")}`,
      `Documento em dia?: ${String(dados.get("documento") ?? "")}`,
      `Pendências: ${String(dados.get("pendencias") || "Nenhuma informada")}`,
      `Observações: ${String(dados.get("observacoes") || "Nenhuma")}`,
      "",
      "CONTATO",
      `Nome: ${String(dados.get("nome") ?? "")}`,
      `WhatsApp: ${String(dados.get("whatsapp") ?? "")}`,
      `Cidade: ${String(dados.get("cidade") ?? "")}`,
      `Fotos selecionadas: ${fotos?.length ? `${fotos.length} arquivo(s)` : "Nenhuma"}`,
      "",
      tipo === "vender"
        ? "Gostaria de receber uma avaliação e saber os próximos passos."
        : "Gostaria de saber as condições e os próximos passos para consignação.",
    ].join("\n");
    window.open(criarWhatsAppUrl(mensagem), "_blank", "noopener,noreferrer");
  };
  return (
    <form onSubmit={enviar} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Marca" name="marca" required placeholder="Ex.: Honda" />
        <Campo label="Modelo" name="modelo" required placeholder="Ex.: Civic" />
        <Campo label="Versão" name="versao" placeholder="Ex.: EXL" />
        <Campo label="Ano" name="ano" type="number" required min={1950} placeholder="2022" />
        <Campo label="Quilometragem" name="km" type="number" required min={0} placeholder="50000" />
        <SelectCampo label="Combustível" name="combustivel" required options={["Flex", "Gasolina", "Etanol", "Diesel", "Híbrido", "Elétrico"]} />
        <SelectCampo label="Câmbio" name="cambio" required options={["Manual", "Automático", "Automático CVT", "Automatizado", "Outro"]} />
        <SelectCampo label="Estado de conservação" name="conservacao" required options={["Excelente", "Bom", "Regular", "Precisa de reparos"]} />
        <Campo label="Valor desejado" name="valor" placeholder="Ex.: R$ 80.000" />
        <SelectCampo label="Está financiado?" name="financiado" required options={["Não", "Sim"]} />
        <SelectCampo label="Está quitado?" name="quitado" required options={["Sim", "Não", "Não se aplica"]} />
        <SelectCampo label="Documento em dia?" name="documento" required options={["Sim", "Não", "Preciso verificar"]} />
        <TextareaCampo label="Pendências / documentação" name="pendencias" placeholder="IPVA, multas, gravame ou qualquer pendência conhecida." />
        <FotosCampo />
        <TextareaCampo label="Observações" name="observacoes" placeholder="Conte detalhes importantes sobre o veículo." />
      </div>
      <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
        <Campo label="Nome" name="nome" required placeholder="Seu nome" />
        <Campo label="WhatsApp" name="whatsapp" required type="tel" placeholder="(22) 99999-9999" />
        <Campo label="Cidade" name="cidade" required placeholder="Campos dos Goytacazes" />
      </div>
      <BotaoWhatsApp texto={tipo === "vender" ? "Enviar veículo para avaliação" : "Quero colocar meu veículo em consignação"} />
    </form>
  );
}

function FormularioTroca() {
  const [veiculoId, setVeiculoId] = useState("");
  const veiculo = VEICULOS.find((item) => item.id === veiculoId);
  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    if (!veiculo) return;
    const mensagem = [
      "Olá! Quero avaliar uma troca com a Gomes Motors.",
      "",
      "VEÍCULO QUE TENHO INTERESSE",
      `Veículo desejado: ${obterTituloVeiculo(veiculo)} ${veiculo.ano}`,
      `Preço anunciado: ${formatarPreco(veiculo.preco)}`,
      "",
      "MEU VEÍCULO ATUAL",
      `Marca: ${String(dados.get("marca") ?? "")}`,
      `Modelo: ${String(dados.get("modelo") ?? "")}`,
      `Versão: ${String(dados.get("versao") || "Não informado")}`,
      `Ano: ${String(dados.get("ano") ?? "")}`,
      `Quilometragem: ${String(dados.get("km") ?? "")} km`,
      `Condição: ${String(dados.get("condicao") ?? "")}`,
      `Valor estimado/desejado: ${String(dados.get("valor") || "Não informado")}`,
      `Financiamento: ${String(dados.get("financiamento") ?? "")}`,
      `Observações: ${String(dados.get("observacoes") || "Nenhuma")}`,
      "",
      "CONTATO",
      `Nome: ${String(dados.get("nome") ?? "")}`,
      `WhatsApp: ${String(dados.get("whatsapp") ?? "")}`,
      `Cidade: ${String(dados.get("cidade") ?? "")}`,
      "Fotos do veículo atual serão enviadas na conversa.",
    ].join("\n");
    window.open(criarWhatsAppUrl(mensagem), "_blank", "noopener,noreferrer");
  };
  return (
    <form onSubmit={enviar} className="space-y-6">
      <VeiculoSelector value={veiculoId} onChange={setVeiculoId} label="1. Escolha o veículo que deseja" />
      <div className="border-t border-border pt-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">2. Informe seu veículo atual</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Marca" name="marca" required placeholder="Ex.: Chevrolet" />
          <Campo label="Modelo" name="modelo" required placeholder="Ex.: Onix" />
          <Campo label="Versão" name="versao" placeholder="Ex.: LTZ" />
          <Campo label="Ano" name="ano" type="number" required min={1950} placeholder="2020" />
          <Campo label="Quilometragem" name="km" type="number" required min={0} placeholder="60000" />
          <SelectCampo label="Condição" name="condicao" required options={["Excelente", "Bom", "Regular", "Precisa de reparos"]} />
          <Campo label="Valor estimado/desejado" name="valor" placeholder="Ex.: R$ 55.000" />
          <SelectCampo label="Está financiado?" name="financiamento" required options={["Não", "Sim", "Não sei informar"]} />
          <TextareaCampo label="Observações" name="observacoes" placeholder="Detalhes, acessórios, reparos ou outras informações." />
          <FotosCampo />
        </div>
      </div>
      <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
        <Campo label="Nome" name="nome" required placeholder="Seu nome" />
        <Campo label="WhatsApp" name="whatsapp" required type="tel" placeholder="(22) 99999-9999" />
        <Campo label="Cidade" name="cidade" required placeholder="Campos dos Goytacazes" />
      </div>
      <BotaoWhatsApp disabled={!veiculo} texto="Enviar proposta de troca pelo WhatsApp" />
    </form>
  );
}

function FormularioFinanciar() {
  const [veiculoId, setVeiculoId] = useState("");
  const veiculo = VEICULOS.find((item) => item.id === veiculoId);
  const [entrada, setEntrada] = useState("");
  const [prazo, setPrazo] = useState("");
  const simulacao = useMemo(() => {
    if (!veiculo || !entrada || !prazo) return null;
    const valorEntrada = Math.min(Math.max(Number(entrada), veiculo.financiamento.entradaMinima), veiculo.preco);
    const meses = Number(prazo);
    const taxa = veiculo.financiamento.taxaIndicativa / 100;
    const financiado = Math.max(veiculo.preco - valorEntrada, 0);
    const parcela = taxa === 0 ? financiado / meses : (financiado * (taxa * (1 + taxa) ** meses)) / ((1 + taxa) ** meses - 1);
    return { entrada: valorEntrada, meses, parcela };
  }, [entrada, prazo, veiculo]);
  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    if (!veiculo || !simulacao) return;
    const mensagem = [
      "Olá! Quero uma proposta real de financiamento pela Gomes Motors.",
      "",
      `Veículo: ${obterTituloVeiculo(veiculo)} ${veiculo.ano}`,
      `Preço anunciado: ${formatarPreco(veiculo.preco)}`,
      `Entrada simulada: ${formatarPreco(simulacao.entrada)}`,
      `Prazo: ${simulacao.meses}x`,
      `Parcela estimada: ${formatarPreco(simulacao.parcela)}/mês`,
      `Nome: ${String(dados.get("nome") ?? "")}`,
      `WhatsApp: ${String(dados.get("whatsapp") ?? "")}`,
      `Cidade: ${String(dados.get("cidade") ?? "")}`,
      `Observações: ${String(dados.get("observacoes") || "Nenhuma")}`,
      "",
      "A simulação é demonstrativa. Entendo que a proposta e as condições finais dependem de análise de crédito e da instituição financeira.",
    ].join("\n");
    window.open(criarWhatsAppUrl(mensagem), "_blank", "noopener,noreferrer");
  };
  return (
    <form onSubmit={enviar} className="space-y-6">
      <VeiculoSelector value={veiculoId} onChange={setVeiculoId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Entrada *</span>
          <input className={inputClass} name="entrada" type="number" min={veiculo?.financiamento.entradaMinima ?? 0} max={veiculo?.preco ?? undefined} step={500} required value={entrada} onChange={(event) => setEntrada(event.target.value)} placeholder={veiculo ? String(veiculo.financiamento.entradaMinima) : "Selecione o veículo"} />
          {veiculo && <span className="mt-1 block text-xs text-muted-foreground">Mínimo sugerido: {formatarPreco(veiculo.financiamento.entradaMinima)}</span>}
        </label>
        <label className="block">
          <span className={labelClass}>Prazo *</span>
          <select className={inputClass} name="prazo" required value={prazo} onChange={(event) => setPrazo(event.target.value)}>
            <option value="">Selecione</option>
            {(veiculo?.financiamento.parcelas ?? []).map((opcao) => <option key={opcao} value={opcao}>{opcao}x</option>)}
          </select>
        </label>
      </div>
      {simulacao && (
        <div className="rounded-sm border border-gold/40 bg-gold/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parcela estimada</p>
          <p className="mt-1 text-3xl font-bold text-gold">{formatarPreco(simulacao.parcela)} <span className="text-sm font-medium text-muted-foreground">/ mês</span></p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Estimativa educativa com taxa indicativa. Não representa aprovação de crédito nem proposta definitiva.</p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <Campo label="Nome" name="nome" required placeholder="Seu nome" />
        <Campo label="WhatsApp" name="whatsapp" required type="tel" placeholder="(22) 99999-9999" />
        <Campo label="Cidade" name="cidade" required placeholder="Campos dos Goytacazes" />
        <TextareaCampo label="Observações" name="observacoes" placeholder="Conte se já possui uma entrada definida ou outra informação relevante." />
      </div>
      <BotaoWhatsApp disabled={!simulacao} texto="Quero uma proposta real" />
    </form>
  );
}

function BotaoWhatsApp({ texto, disabled = false }: { texto: string; disabled?: boolean }) {
  return (
    <button type="submit" disabled={disabled} className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-red px-5 py-3 text-sm font-semibold text-brand-red-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
      <MessageCircle className="h-4 w-4" />
      {texto}
    </button>
  );
}

function Roteiro({ numero, texto }: { numero: string; texto: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">{numero}</span>
      <p className="pt-1 text-sm leading-6 text-muted-foreground">{texto}</p>
    </div>
  );
}

function ServicoBloco({ id, icon: Icon, title, detalhe, children }: { id: string; icon: typeof Car; title: string; detalhe: string; children: React.ReactNode }) {
  return (
    <article id={id} className="scroll-mt-24 border border-border bg-card">
      <div className="border-b border-border p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Icon className="h-7 w-7 text-gold" />
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{detalhe}</p>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </article>
  );
}

function ServicosPage() {
  return (
    <main>
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Gomes Motors</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Serviços</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">Cada serviço tem um caminho próprio: escolha o veículo quando fizer sentido, preencha as informações necessárias e abra uma conversa organizada no WhatsApp.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-label="Serviços disponíveis">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SERVICOS.map(({ id, icon: Icon, title, description }) => (
            <a key={id} href={`#${id}`} className="group border border-border bg-card p-5 transition-colors hover:border-gold">
              <Icon className="h-7 w-7 text-gold" />
              <h2 className="mt-4 font-semibold text-foreground">{title}</h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gold">Abrir fluxo <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <ServicoBloco id="comprar" icon={Car} title="Comprar" detalhe="Se você já sabe qual veículo quer, selecione-o abaixo. O nome, ano e preço são levados para o WhatsApp junto com seus dados.">
            <div className="mb-8 grid gap-4 border-b border-border pb-7 md:grid-cols-3">
              <Roteiro numero="1" texto="Escolha o carro ou a moto no estoque." />
              <Roteiro numero="2" texto="Informe nome, cidade e forma de pagamento." />
              <Roteiro numero="3" texto="Receba o resumo pronto no WhatsApp para continuar o atendimento." />
            </div>
            <FormularioComprar />
          </ServicoBloco>

          <ServicoBloco id="vender" icon={BadgeDollarSign} title="Vender" detalhe="Preencha os dados do veículo, documentação, condição e contato. O resumo será organizado para facilitar a avaliação inicial pelo WhatsApp.">
            <div className="mb-8 grid gap-4 border-b border-border pb-7 md:grid-cols-3">
              <Roteiro numero="1" texto="Informe as características e o histórico comercial do veículo." />
              <Roteiro numero="2" texto="Registre documentação, pendências e fotos que você pretende enviar." />
              <Roteiro numero="3" texto="Envie o veículo para avaliação e combine os próximos passos." />
            </div>
            <FormularioVeiculo tipo="vender" />
          </ServicoBloco>

          <ServicoBloco id="trocar" icon={Repeat} title="Trocar" detalhe="Primeiro escolha o veículo desejado no estoque. Depois informe os dados do seu veículo atual para que os dois lados da negociação cheguem juntos ao WhatsApp.">
            <div className="mb-8 grid gap-4 border-b border-border pb-7 md:grid-cols-3">
              <Roteiro numero="1" texto="Escolha o carro ou a moto que deseja." />
              <Roteiro numero="2" texto="Informe ano, km, condição, valor e financiamento do seu veículo atual." />
              <Roteiro numero="3" texto="Envie a intenção de troca com os dois veículos identificados." />
            </div>
            <FormularioTroca />
          </ServicoBloco>

          <ServicoBloco id="consignar" icon={KeyRound} title="Consignar" detalhe="A consignação tem um fluxo próprio. Envie informações completas do veículo para conversar sobre viabilidade, documentação e condições comerciais.">
            <div className="mb-8 grid gap-4 border-b border-border pb-7 md:grid-cols-3">
              <Roteiro numero="1" texto="Cadastre o veículo e o valor que você busca." />
              <Roteiro numero="2" texto="Informe condição, financiamento, documentação e fotos." />
              <Roteiro numero="3" texto="Envie a solicitação de consignação para alinhar as condições." />
            </div>
            <FormularioVeiculo tipo="consignar" />
          </ServicoBloco>

          <ServicoBloco id="financiar" icon={CreditCard} title="Financiar" detalhe="Selecione um veículo, informe entrada e prazo e veja uma estimativa antes de pedir uma proposta real. A simulação não representa aprovação de crédito.">
            <div className="mb-8 grid gap-4 border-b border-border pb-7 md:grid-cols-3">
              <Roteiro numero="1" texto="Escolha o veículo que deseja financiar." />
              <Roteiro numero="2" texto="Defina uma entrada e um prazo dentro das opções disponíveis." />
              <Roteiro numero="3" texto="Veja a parcela estimada e envie seus dados para uma proposta real." />
            </div>
            <FormularioFinanciar />
          </ServicoBloco>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-4 border border-border bg-card p-6 sm:p-8">
          <FileText className="mt-1 h-6 w-6 shrink-0 text-gold" />
          <div>
            <h2 className="font-semibold text-foreground">Sobre os formulários</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">As informações servem para organizar o primeiro contato comercial. Os dados não representam aprovação de financiamento, avaliação definitiva ou aceite de consignação. Condições reais devem ser confirmadas durante o atendimento.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
