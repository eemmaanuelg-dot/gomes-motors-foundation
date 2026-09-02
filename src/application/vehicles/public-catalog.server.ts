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

export async function listarCatalogoPublicoServer() {
  return listarVeiculosPublicos(getPublicCatalogDependencies());
}

export async function obterCatalogoPublicoPorIdServer(id: string) {
  return obterVeiculoPublicoPorId(getPublicCatalogDependencies(), id);
}
