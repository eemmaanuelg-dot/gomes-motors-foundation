import { createServerFn } from "@tanstack/react-start";
import {
  listarVeiculosPublicos,
  obterVeiculoPublicoPorId,
} from "@/application/vehicles/use-cases";
import type { Vehicle } from "@/domain/vehicles/types";
import {
  createCloudflareDependencies,
  createStaticDependencies,
} from "@/infrastructure/composition";
import type { AppBindings } from "@/infrastructure/cloudflare/bindings";

type PublicCatalogContext = {
  bindings: Partial<AppBindings>;
};

type PublicVehicleCatalog = {
  listar: () => Promise<Vehicle[]>;
  obterPorId: (options: { data: { id: string } }) => Promise<Vehicle | null>;
};

function getPublicCatalogDependencies(context: PublicCatalogContext) {
  const bindings = context.bindings;

  if (bindings.DB && bindings.VEHICLE_IMAGES) {
    return createCloudflareDependencies({
      DB: bindings.DB,
      VEHICLE_IMAGES: bindings.VEHICLE_IMAGES,
    });
  }

  return createStaticDependencies();
}

const listarCatalogoPublico = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    return listarVeiculosPublicos(
      getPublicCatalogDependencies(context as PublicCatalogContext),
    );
  },
);

const obterCatalogoPublicoPorId = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    return obterVeiculoPublicoPorId(
      getPublicCatalogDependencies(context as PublicCatalogContext),
      data.id,
    );
  });

export const publicVehicleCatalog: PublicVehicleCatalog = {
  listar: listarCatalogoPublico,
  obterPorId: obterCatalogoPublicoPorId,
};
