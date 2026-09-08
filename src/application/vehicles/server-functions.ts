import { createServerFn } from "@tanstack/react-start";

import { createVehicleDependencies } from "@/infrastructure/repositories/create-vehicle-dependencies";
import {
  listarVeiculosPublicos,
  obterVeiculoPublicoPorId,
} from "./use-cases";

/**
 * Fronteira server-side do catálogo público.
 *
 * A leitura pública consulta diretamente a fonte operacional configurada
 * (D1 em produção). Leituras não executam sincronizações ou mutações
 * implícitas no banco.
 */
export const listarVeiculosPublicosServer = createServerFn({ method: "GET" }).handler(
  async () => listarVeiculosPublicos(createVehicleDependencies()),
);

export const obterVeiculoPublicoPorIdServer = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => obterVeiculoPublicoPorId(createVehicleDependencies(), data.id));
