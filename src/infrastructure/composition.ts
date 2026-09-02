import type { VehicleUseCaseDependencies } from "@/application/vehicles/use-cases";
import type { AppBindings } from "@/infrastructure/cloudflare/bindings";
import { D1InventoryRepository } from "@/infrastructure/repositories/d1/inventory-repository";
import { D1VehicleRepository } from "@/infrastructure/repositories/d1/vehicle-repository";
import { inventoryRepository as staticInventoryRepository } from "@/infrastructure/repositories/static/inventory-repository";
import { vehicleRepository as staticVehicleRepository } from "@/infrastructure/repositories/static/vehicle-repository";

/**
 * Monta as dependências da aplicação.
 *
 * A regra é simples: domínio e aplicação conhecem apenas contratos; a
 * infraestrutura decide qual implementação concreta será usada.
 *
 * O modo estático continua sendo o fallback até D1/R2 estarem ligados no
 * Worker. Isso permite testar a arquitetura sem colocar IDs fictícios no
 * Wrangler ou quebrar o site público já aprovado.
 */
export function createStaticDependencies(): VehicleUseCaseDependencies {
  return {
    vehicleRepository: staticVehicleRepository,
    inventoryRepository: staticInventoryRepository,
  };
}

export function createCloudflareDependencies(
  bindings: AppBindings,
): VehicleUseCaseDependencies {
  return {
    vehicleRepository: new D1VehicleRepository(bindings.DB),
    inventoryRepository: new D1InventoryRepository(bindings.DB),
  };
}
