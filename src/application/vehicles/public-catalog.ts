import { createServerFn } from "@tanstack/react-start";
import {
  listarVeiculosPublicos,
  obterVeiculoPublicoPorId,
} from "@/application/vehicles/use-cases";
import {
  createCloudflareDependencies,
  createStaticDependencies,
} from "@/infrastructure/composition";
import { getCloudflareBindings } from "@/server/cloudflare-bindings";

function getPublicCatalogDependencies() {
  const bindings = getCloudflareBindings();

  if (bindings.DB && bindings.VEHICLE_IMAGES) {
    return createCloudflareDependencies({
      DB: bindings.DB,
      VEHICLE_IMAGES: bindings.VEHICLE_IMAGES,
    });
  }

  return createStaticDependencies();
}

/**
 * Fronteira pública do catálogo.
 *
 * Estas funções são Server Functions e podem ser importadas pelas rotas
 * públicas com segurança: o TanStack Start substitui a implementação por
 * RPC no bundle do cliente e mantém o acesso a D1/R2 no Worker.
 */
export const publicVehicleCatalog = {
  listar: createServerFn({ method: "GET" }).handler(async () => {
    return listarVeiculosPublicos(getPublicCatalogDependencies());
  }),
  obterPorId: createServerFn({ method: "GET" })
    .validator((data: { id: string }) => data)
    .handler(async ({ data }) => {
      return obterVeiculoPublicoPorId(
        getPublicCatalogDependencies(),
        data.id,
      );
    }),
};
