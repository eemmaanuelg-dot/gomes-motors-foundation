import { createServerFn } from "@tanstack/react-start";

/**
 * Fronteira pública do catálogo.
 *
 * O módulo pode ser importado pelas rotas públicas sem carregar módulos
 * server-only no bundle do cliente. A implementação da aplicação e a
 * composição das dependências são carregadas somente dentro do handler
 * da Server Function, no Worker.
 */
export const publicVehicleCatalog = {
  listar: createServerFn({ method: "GET" }).handler(async () => {
    const [{ listarVeiculosPublicos }, { createCloudflareDependencies, createStaticDependencies }, { getCloudflareBindings }] = await Promise.all([
      import("@/application/vehicles/use-cases"),
      import("@/infrastructure/composition"),
      import("@/server/cloudflare-bindings"),
    ]);

    const bindings = getCloudflareBindings();
    const deps =
      bindings.DB && bindings.VEHICLE_IMAGES
        ? createCloudflareDependencies({
            DB: bindings.DB,
            VEHICLE_IMAGES: bindings.VEHICLE_IMAGES,
          })
        : createStaticDependencies();

    return listarVeiculosPublicos(deps);
  }),

  obterPorId: createServerFn({ method: "GET" })
    .validator((data: { id: string }) => data)
    .handler(async ({ data }) => {
      const [{ obterVeiculoPublicoPorId }, { createCloudflareDependencies, createStaticDependencies }, { getCloudflareBindings }] = await Promise.all([
        import("@/application/vehicles/use-cases"),
        import("@/infrastructure/composition"),
        import("@/server/cloudflare-bindings"),
      ]);

      const bindings = getCloudflareBindings();
      const deps =
        bindings.DB && bindings.VEHICLE_IMAGES
          ? createCloudflareDependencies({
              DB: bindings.DB,
              VEHICLE_IMAGES: bindings.VEHICLE_IMAGES,
            })
          : createStaticDependencies();

      return obterVeiculoPublicoPorId(deps, data.id);
    }),
};
