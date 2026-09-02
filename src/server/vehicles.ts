import { createServerFn } from "@tanstack/react-start";
import {
  listarVeiculosPublicos,
  obterVeiculoPublicoPorId,
} from "@/application/vehicles/use-cases";
import { createCloudflareDependencies } from "@/infrastructure/composition";
import { getCloudflareBindings } from "./cloudflare-bindings";

/**
 * Boundary server-side do catálogo público.
 *
 * Rotas/componentes podem chamar estas funções sem conhecer D1, R2 ou as
 * bindings do Worker. A persistência fica obrigatoriamente no servidor.
 */
export const listarCatalogoPublico = createServerFn({ method: "GET" }).handler(
  async () => {
    const dependencies = createCloudflareDependencies(getCloudflareBindings());
    return listarVeiculosPublicos(dependencies);
  },
);

export const obterCatalogoPublicoPorId = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: { id: string } }) => {
    const dependencies = createCloudflareDependencies(getCloudflareBindings());
    return obterVeiculoPublicoPorId(dependencies, data.id);
  },
);
