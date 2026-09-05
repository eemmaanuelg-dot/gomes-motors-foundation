import type { Vehicle } from "./types";

/**
 * Regras de apresentação derivadas do domínio do veículo.
 *
 * Mantém critérios comerciais fora das rotas e da infraestrutura, permitindo
 * que a mesma regra seja reutilizada pelo site público e pelo futuro painel.
 */
export function obterTituloVeiculo(veiculo: Vehicle): string {
  return `${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""}`;
}

export function obterVeiculosRelacionados(
  veiculos: Vehicle[],
  atual: Vehicle,
  limite = 3,
): Vehicle[] {
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
