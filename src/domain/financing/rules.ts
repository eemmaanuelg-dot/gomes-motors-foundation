import { fail, ok, type Result } from "../shared/types";
import type { FinancingProposalStatus } from "./types";

const TRANSITIONS: Record<FinancingProposalStatus, readonly FinancingProposalStatus[]> = {
  rascunho: ["enviada", "cancelada"],
  enviada: ["em_analise", "cancelada"],
  em_analise: ["aprovada", "recusada", "cancelada"],
  aprovada: ["cancelada"],
  recusada: [],
  cancelada: [],
};

export function validarTransicaoFinanciamento(
  atual: FinancingProposalStatus,
  proximo: FinancingProposalStatus,
): Result<true> {
  if (atual === proximo) {
    return fail("CONFLICT", "A proposta já está nesse status.");
  }

  if (!TRANSITIONS[atual].includes(proximo)) {
    return fail(
      "INVALID_TRANSITION",
      `Não é permitido alterar a proposta de ${atual} para ${proximo}.`,
    );
  }

  return ok(true);
}

export function validarEntrada(
  valorVeiculo: number,
  entrada: number,
): Result<true> {
  if (!Number.isFinite(valorVeiculo) || valorVeiculo <= 0) {
    return fail("INVALID_INPUT", "O valor do veículo deve ser maior que zero.");
  }

  if (!Number.isFinite(entrada) || entrada < 0 || entrada > valorVeiculo) {
    return fail(
      "INVALID_INPUT",
      "A entrada deve ser maior ou igual a zero e não pode superar o valor do veículo.",
    );
  }

  return ok(true);
}

export function validarPrazo(prazoMeses: number): Result<true> {
  if (!Number.isInteger(prazoMeses) || prazoMeses <= 0) {
    return fail("INVALID_INPUT", "O prazo deve ser um número inteiro positivo de meses.");
  }

  return ok(true);
}
