import { fail, ok, type Result } from "../shared/types";
import type { EvaluationStatus, EvaluationType } from "./types";

const TRANSITIONS: Record<EvaluationStatus, readonly EvaluationStatus[]> = {
  solicitada: ["em_analise", "aguardando_informacao"],
  em_analise: ["aguardando_informacao", "avaliada", "recusada"],
  aguardando_informacao: ["em_analise", "recusada"],
  avaliada: ["aprovada", "recusada"],
  aprovada: [],
  recusada: [],
};

export function validarTransicaoAvaliacao(
  atual: EvaluationStatus,
  proximo: EvaluationStatus,
): Result<true> {
  if (atual === proximo) {
    return fail("CONFLICT", "A avaliação já está nesse status.");
  }

  if (!TRANSITIONS[atual].includes(proximo)) {
    return fail(
      "INVALID_TRANSITION",
      `Não é permitido alterar a avaliação de ${atual} para ${proximo}.`,
    );
  }

  return ok(true);
}

export function tipoAvaliacaoExigeVeiculo(
  tipo: EvaluationType,
): boolean {
  return tipo === "venda" || tipo === "troca" || tipo === "consignacao";
}
