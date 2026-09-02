import type { Veiculo } from "@/data/vehicles";

export const WHATSAPP_NUMERO = "55229999908461";

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

export function mensagemInteresse(veiculo: Veiculo) {
  return `Olá, Gomes Motors! Tenho interesse no ${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""} ${veiculo.ano}, anunciado por ${formatarPreco(veiculo.preco)}. Gostaria de mais informações.`;
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
