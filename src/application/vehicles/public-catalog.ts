import { listarCatalogoPublico, obterCatalogoPublicoPorId } from "@/server/vehicles";

/**
 * Fronteira pública do catálogo.
 *
 * As rotas continuam consumindo este contrato estável, mas a implementação
 * agora atravessa uma Server Function. Dessa forma, D1 permanece no Worker
 * e nunca é acessado diretamente pela apresentação.
 */
export const publicVehicleCatalog = {
  listar: () => listarCatalogoPublico(),
  obterPorId: (id: string) => obterCatalogoPublicoPorId({ data: { id } }),
};
