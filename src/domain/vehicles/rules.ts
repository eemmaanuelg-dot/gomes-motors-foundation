import { fail, ok, type Result } from "../shared/types";
import type { VehicleStatus } from "./types";

const TRANSITIONS: Record<VehicleStatus, readonly VehicleStatus[]> = {
  disponivel: ["reservado", "vendido"],
  reservado: ["disponivel", "vendido"],
  vendido: [],
};

export function podeAlterarStatus(
  atual: VehicleStatus,
  proximo: VehicleStatus,
): boolean {
  return TRANSITIONS[atual].includes(proximo);
}

export function validarTransicaoStatus(
  atual: VehicleStatus,
  proximo: VehicleStatus,
): Result<true> {
  if (atual === proximo) {
    return fail("CONFLICT", "O veículo já está nesse status.");
  }

  if (!podeAlterarStatus(atual, proximo)) {
    return fail(
      "INVALID_TRANSITION",
      `Não é permitido alterar o status de ${atual} para ${proximo}.`,
    );
  }

  return ok(true);
}

export function podeReceberNovoInteresse(status: VehicleStatus): boolean {
  return status === "disponivel";
}

export function podeSerDestacado(status: VehicleStatus): boolean {
  return status !== "vendido";
}
