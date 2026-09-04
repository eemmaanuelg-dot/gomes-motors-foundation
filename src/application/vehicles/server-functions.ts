import { createServerFn } from "@tanstack/react-start";

import {
  createVehicleDependencies,
  synchronizeVehicleCatalogIfNeeded,
} from "@/infrastructure/repositories/create-vehicle-dependencies";
import {
  listarVeiculosPublicos,
  obterVeiculoPublicoPorId,
} from "./use-cases";

/**
 * Fronteira server-side do catálogo público.
 *
 * D1 é a fonte de verdade em produção. Antes de cada leitura, a sincronização
 * versionada aplica apenas as correções de catálogo explicitamente publicadas
 * no código; depois disso a consulta é feita exclusivamente no D1.
 */
export const listarVeiculosPublicosServer = createServerFn({ method: "GET" }).handler(
  async () => {
    await synchronizeVehicleCatalogIfNeeded();
    return listarVeiculosPublicos(createVehicleDependencies());
  },
);

export const obterVeiculoPublicoPorIdServer = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await synchronizeVehicleCatalogIfNeeded();
    return obterVeiculoPublicoPorId(createVehicleDependencies(), data.id);
  });
