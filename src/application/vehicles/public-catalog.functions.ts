import { env } from "cloudflare:workers";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import {
  listarVeiculosPublicos,
  obterVeiculoPublicoPorId,
} from "@/application/vehicles/use-cases";
import {
  createCloudflareDependencies,
  createStaticDependencies,
} from "@/infrastructure/composition";
import type { AppBindings } from "@/infrastructure/cloudflare/bindings";

const getCloudflareBindings = createServerOnlyFn(
  (): Partial<AppBindings> => env as unknown as Partial<AppBindings>,
);

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

const listarCatalogoPublico = createServerFn({ method: "GET" }).handler(
  async () => {
    return listarVeiculosPublicos(getPublicCatalogDependencies());
  },
);

const obterCatalogoPublicoPorId = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return obterVeiculoPublicoPorId(
      getPublicCatalogDependencies(),
      data.id,
    );
  });

export const publicVehicleCatalog = {
  listar: listarCatalogoPublico,
  obterPorId: obterCatalogoPublicoPorId,
};
