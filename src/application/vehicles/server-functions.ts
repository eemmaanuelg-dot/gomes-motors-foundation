import { createServerFn } from "@tanstack/react-start";

import { createVehicleDependencies } from "@/infrastructure/repositories/create-vehicle-dependencies";
import {
  listarVeiculosPublicos,
  obterVeiculoPublicoPorId,
} from "./use-cases";

/**
 * Fronteira server-side do catálogo público.
 *
 * A fonte de dados é escolhida por requisição, mantendo o domínio independente
 * da infraestrutura e permitindo uma troca controlada de Static -> D1.
 */
export const listarVeiculosPublicosServer = createServerFn({ method: "GET" }).handler(
  async () => listarVeiculosPublicos(createVehicleDependencies()),
);

export const obterVeiculoPublicoPorIdServer = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) =>
    obterVeiculoPublicoPorId(createVehicleDependencies(), data.id),
  );
