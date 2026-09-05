import type { Vehicle } from "@/domain/vehicles/types";
import {
  obterTituloVeiculo,
  obterVeiculosRelacionados,
} from "@/domain/vehicles/services";
import { dealershipConfig } from "@/config/dealership";
import { WHATSAPP_NUMERO } from "./contact";

export { WHATSAPP_NUMERO } from "./contact";
export { obterTituloVeiculo, obterVeiculosRelacionados } from "@/domain/vehicles/services";

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

export function mensagemInteressePorTipo(veiculo: Vehicle, tipo: TipoInteresse) {
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
      `Olá! Tenho interesse neste veículo e gostaria de conversar sobre a compra com a equipe da ${dealershipConfig.company.name}.`,
    ].join("\n");
  }

  if (tipo === "trocar") {
    return [
      "INTERESSE EM TROCA",
      `Veículo desejado: ${titulo} — ${veiculo.ano}`,
      `Valor anunciado: ${valor}`,
      `Quilometragem: ${km}`,
      "",
      `Olá! Tenho interesse neste veículo e gostaria de saber se posso utilizá-lo em uma negociação de troca com a ${dealershipConfig.company.name}. Tenho um veículo para oferecer.`,
    ].join("\n");
  }

  return [
    "INTERESSE EM FINANCIAMENTO",
    `Veículo: ${titulo} — ${veiculo.ano}`,
    `Valor anunciado: ${valor}`,
    `Quilometragem: ${km}`,
    "",
    `Olá! Tenho interesse em financiar este veículo e gostaria de saber quais condições estão disponíveis na ${dealershipConfig.company.name}.`,
  ].join("\n");
}

export function mensagemComercial(veiculo: Vehicle, assunto: string) {
  return `Olá, ${dealershipConfig.company.name}! Quero falar sobre o ${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""} ${veiculo.ano}. Tenho interesse em ${assunto}.`;
}
