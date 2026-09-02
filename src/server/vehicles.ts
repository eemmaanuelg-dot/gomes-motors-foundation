import { createServerFn } from "@tanstack/react-start";
import {
  listarVeiculosPublicos,
  obterVeiculoPublicoPorId,
} from "@/application/vehicles/use-cases";
import {
  createCloudflareDependencies,
  createStaticDependencies,
} from "@/infrastructure/composition";
import { getCloudflareBindings } from "./cloudflare-bindings";

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
 * Boundary server-side do catálogo público.
 *
 * Em produção, usa D1 quando as bindings estão disponíveis. Até o
 * provisionamento real, mantém o fallback estático para que a introdução da
 * infraestrutura não derrube o site público já aprovado.
 */
export const listarCatalogoPublico = createServerFn({ method: "GET" }).handler(
  async () => listarVeiculosPublicos(getPublicCatalogDependencies()),
);

export const obterCatalogoPublicoPorId = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return obterVeiculoPublicoPorId(getPublicCatalogDependencies(), data.id);
  });
