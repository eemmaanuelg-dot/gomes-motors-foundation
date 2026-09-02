import { createServerFn } from "@tanstack/react-start";

import { inventoryRepository } from "@/infrastructure/repositories/static/inventory-repository";
import { vehicleRepository } from "@/infrastructure/repositories/static/vehicle-repository";
import {
  listarVeiculosPublicos,
  obterVeiculoPublicoPorId,
  type VehicleUseCaseDependencies,
} from "./use-cases";

const dependencies: VehicleUseCaseDependencies = {
  vehicleRepository,
  inventoryRepository,
};

/**
 * Fronteira server-side do catálogo público.
 *
 * As implementações de repositório e os casos de uso são executados apenas no
 * servidor. O cliente recebe somente o resultado serializável da operação.
 */
export const listarVeiculosPublicosServer = createServerFn({ method: "GET" }).handler(
  async () => listarVeiculosPublicos(dependencies),
);

export const obterVeiculoPublicoPorIdServer = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => obterVeiculoPublicoPorId(dependencies, data.id));
