import { fail, ok, type Result } from "../shared/types";
import type { LeadStatus, LeadType } from "./types";

const TRANSITIONS: Record<LeadStatus, readonly LeadStatus[]> = {
  novo: ["em_atendimento", "perdido"],
  em_atendimento: ["aguardando_cliente", "proposta_enviada", "negociacao", "convertido", "perdido"],
  aguardando_cliente: ["em_atendimento", "negociacao", "convertido", "perdido"],
  proposta_enviada: ["aguardando_cliente", "negociacao", "convertido", "perdido"],
  negociacao: ["aguardando_cliente", "proposta_enviada", "convertido", "perdido"],
  convertido: [],
  perdido: ["novo"],
};

export function validarTransicaoLead(
  atual: LeadStatus,
  proximo: LeadStatus,
): Result<true> {
  if (atual === proximo) {
    return fail("CONFLICT", "O lead já está nesse status.");
  }

  if (!TRANSITIONS[atual].includes(proximo)) {
    return fail(
      "INVALID_TRANSITION",
      `Não é permitido alterar o lead de ${atual} para ${proximo}.`,
    );
  }

  return ok(true);
}

export function tipoLeadExigeVeiculo(tipo: LeadType): boolean {
  return tipo === "comprar" || tipo === "trocar" || tipo === "financiar";
}
