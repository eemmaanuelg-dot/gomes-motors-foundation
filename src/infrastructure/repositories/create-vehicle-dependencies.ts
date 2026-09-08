import { env } from "cloudflare:workers";

import type { VehicleUseCaseDependencies } from "@/application/vehicles/use-cases";
import { createD1VehicleDependencies } from "./d1/create-d1-vehicle-dependencies";
import type { D1DatabaseLike } from "./d1/d1-types";
import { inventoryRepository as staticInventoryRepository } from "./static/inventory-repository";
import { vehicleRepository as staticVehicleRepository } from "./static/vehicle-repository";

type RuntimeEnv = {
  DB: D1DatabaseLike;
  VEHICLE_DATA_SOURCE?: string;
};

const staticDependencies: VehicleUseCaseDependencies = {
  vehicleRepository: staticVehicleRepository,
  inventoryRepository: staticInventoryRepository,
};

/**
 * Production uses D1 as the operational source of truth. The static
 * repositories remain available only for isolated compatibility/test paths;
 * they are never selected when VEHICLE_DATA_SOURCE is "d1".
 */
export function createVehicleDependencies(): VehicleUseCaseDependencies {
  const runtimeEnv = env as unknown as RuntimeEnv;

  if (runtimeEnv.VEHICLE_DATA_SOURCE === "d1") {
    return createD1VehicleDependencies(runtimeEnv.DB);
  }

  return staticDependencies;
}
