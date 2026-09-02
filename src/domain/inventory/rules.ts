import { fail, ok, type Result } from "../shared/types";
import type { VehicleStatus } from "../vehicles/types";

export function validarPublicacao(
  status: VehicleStatus,
  publicado: boolean,
): Result<true> {
  if (publicado && status === "vendido") {
    return fail(
      "CONFLICT",
      "Um veículo vendido não pode permanecer publicado no estoque público.",
    );
  }

  return ok(true);
}

export function podeEntrarNoEstoque(status: VehicleStatus): boolean {
  return status !== "vendido";
}
