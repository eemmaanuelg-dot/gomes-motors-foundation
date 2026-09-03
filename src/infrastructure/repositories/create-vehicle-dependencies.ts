import { env } from "cloudflare:workers";

import type { VehicleUseCaseDependencies } from "@/application/vehicles/use-cases";
import { inventoryRepository as staticInventoryRepository } from "./static/inventory-repository";
import { vehicleRepository as staticVehicleRepository } from "./static/vehicle-repository";
import { createD1VehicleDependencies } from "./d1/create-d1-vehicle-dependencies";
import type { D1DatabaseLike } from "./d1/d1-types";

type RuntimeEnv = {
  DB: D1DatabaseLike;
  VEHICLE_DATA_SOURCE?: string;
};

const staticDependencies: VehicleUseCaseDependencies = {
  vehicleRepository: staticVehicleRepository,
  inventoryRepository: staticInventoryRepository,
};

/**
 * Seleciona a fonte persistente sem alterar os contratos da aplicação.
 *
 * A configuração permanece em `static` até que o seed D1 seja aplicado e
 * validado. O corte para D1 passa a ser uma decisão explícita de configuração,
 * evitando que uma base vazia ou parcialmente migrada afete o catálogo público.
 */
export function createVehicleDependencies(): VehicleUseCaseDependencies {
  const runtimeEnv = env as unknown as RuntimeEnv;

  if (runtimeEnv.VEHICLE_DATA_SOURCE === "d1") {
    return createD1VehicleDependencies(runtimeEnv.DB);
  }

  return staticDependencies;
}
