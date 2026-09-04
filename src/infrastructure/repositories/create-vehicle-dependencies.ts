import { env } from "cloudflare:workers";

import type { VehicleUseCaseDependencies } from "@/application/vehicles/use-cases";
import { createD1VehicleDependencies } from "./d1/create-d1-vehicle-dependencies";
import { ensureDemoCatalogSynchronized } from "./d1/demo-catalog-sync";
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
 * D1 is the production source of truth. The controlled demo catalog is
 * synchronized once per Worker isolate and guarded by a persisted version in
 * D1, so code-owned corrections reach an existing database without turning
 * every request into a write or overwriting later admin edits.
 */
export function createVehicleDependencies(): VehicleUseCaseDependencies {
  const runtimeEnv = env as unknown as RuntimeEnv;

  if (runtimeEnv.VEHICLE_DATA_SOURCE === "d1") {
    // Do not await here: the repositories remain synchronous to construct, and
    // the public use-cases await their first D1 query. The promise is exposed
    // through the D1 repository wrapper below instead of changing contracts.
    return createD1VehicleDependencies(runtimeEnv.DB);
  }

  return staticDependencies;
}

/**
 * Explicit synchronization hook for request handlers that need the database
 * corrections to be committed before querying it.
 */
export function synchronizeVehicleCatalogIfNeeded(): Promise<void> {
  const runtimeEnv = env as unknown as RuntimeEnv;
  if (runtimeEnv.VEHICLE_DATA_SOURCE !== "d1") return Promise.resolve();
  return ensureDemoCatalogSynchronized(runtimeEnv.DB);
}
