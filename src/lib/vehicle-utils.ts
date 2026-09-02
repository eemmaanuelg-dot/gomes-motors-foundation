import type { Veiculo } from "@/data/vehicles";
import { WHATSAPP_NUMERO } from "./contact";

export { WHATSAPP_NUMERO } from "./contact";

export type TipoInteresse = "comprar" | "trocar" | "financiar";

export function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatarKm(km: number) {
  return `${km.toLocaleString("pt-BR")} km`;
}

export function criarWhatsAppUrl(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemInteressePorTipo(veiculo: Veiculo, tipo: TipoInteresse) {
  const titulo = obterTituloVeiculo(veiculo);
  const valor = formatarPreco(veiculo.preco);
  const km = formatarKm(veiculo.km);

  if (tipo === "comprar") {
    return [
      "INTERESSE EM COMPRA",
      `Veículo: ${titulo} — ${veiculo.ano}`,
      `Valor anunciado: ${valor}`,
      `Quilometragem: ${km}`,
      "",
      "Olá! Tenho interesse neste veículo e gostaria de conversar sobre a compra.",
    ].join("\n");
  }

  if (tipo === "trocar") {
    return [
      "INTERESSE EM TROCA",
      `Veículo desejado: ${titulo} — ${veiculo.ano}`,
      `Valor anunciado: ${valor}`,
      `Quilometragem: ${km}`,
      "",
      "Olá! Tenho interesse neste veículo e gostaria de saber se posso utilizá-lo em uma negociação de troca. Tenho um veículo para oferecer.",
    ].join("\n");
  }

  return [
    "INTERESSE EM FINANCIAMENTO",
    `Veículo: ${titulo} — ${veiculo.ano}`,
    `Valor anunciado: ${valor}`,
    `Quilometragem: ${km}`,
    "",
    "Olá! Tenho interesse em financiar este veículo e gostaria de saber quais condições estão disponíveis.",
  ].join("\n");
}

export function mensagemComercial(veiculo: Veiculo, assunto: string) {
  return `Olá, Gomes Motors! Quero falar sobre o ${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""} ${veiculo.ano}. Tenho interesse em ${assunto}.`;
}

export function obterVeiculosRelacionados(veiculos: Veiculo[], atual: Veiculo, limite = 3) {
  return veiculos
    .filter((veiculo) => veiculo.id !== atual.id && veiculo.status !== "vendido")
    .sort((a, b) => {
      const pontuacaoA =
        (a.categoria === atual.categoria ? 3 : 0) +
        (a.marca === atual.marca ? 2 : 0) +
        (a.tipo === atual.tipo ? 1 : 0);
      const pontuacaoB =
        (b.categoria === atual.categoria ? 3 : 0) +
        (b.marca === atual.marca ? 2 : 0) +
        (b.tipo === atual.tipo ? 1 : 0);
      return pontuacaoB - pontuacaoA;
    })
    .slice(0, limite);
}

export function obterTituloVeiculo(veiculo: Veiculo) {
  return `${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""}`;
}
