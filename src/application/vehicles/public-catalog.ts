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
 * Ponto de entrada da aplicação para o catálogo público.
 * Rotas e componentes não precisam conhecer a fonte estática nem os
 * repositórios concretos.
 */
export const publicVehicleCatalog = {
  listar: () => listarVeiculosPublicos(dependencies),
  obterPorId: (id: string) => obterVeiculoPublicoPorId(dependencies, id),
};
