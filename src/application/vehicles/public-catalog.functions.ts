import { createServerFn } from "@tanstack/react-start";
import {
  listarCatalogoPublicoServer,
  obterCatalogoPublicoPorIdServer,
} from "./public-catalog.server";

/**
 * Fronteira RPC do catálogo público.
 *
 * Este módulo é seguro para importação pelas rotas públicas. A implementação
 * server-only fica isolada em public-catalog.server.ts e é removida do bundle
 * do cliente pelo compilador do TanStack Start.
 */
export const publicVehicleCatalog = {
  listar: createServerFn({ method: "GET" }).handler(() =>
    listarCatalogoPublicoServer(),
  ),

  obterPorId: createServerFn({ method: "GET" })
    .validator((data: { id: string }) => data)
    .handler(({ data }) => obterCatalogoPublicoPorIdServer(data.id)),
};
