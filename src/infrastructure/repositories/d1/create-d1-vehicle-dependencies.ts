import type { VehicleUseCaseDependencies } from "@/application/vehicles/use-cases";
import { D1InventoryRepository } from "./d1-inventory-repository";
import { D1VehicleRepository } from "./d1-vehicle-repository";
import type { D1DatabaseLike } from "./d1-types";

/**
 * Monta as dependências da aplicação usando D1.
 *
 * O domínio continua recebendo apenas os contratos dos repositórios. A escolha
 * da infraestrutura fica concentrada neste ponto para permitir uma migração
 * controlada da implementação estática para persistência real.
 */
export function createD1VehicleDependencies(
  db: D1DatabaseLike,
): VehicleUseCaseDependencies {
  return {
    vehicleRepository: new D1VehicleRepository(db),
    inventoryRepository: new D1InventoryRepository(db),
  };
}
