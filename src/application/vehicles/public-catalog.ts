import {
  listarVeiculosPublicosServer,
  obterVeiculoPublicoPorIdServer,
} from "./server-functions";

/**
 * Ponto de entrada da aplicação para o catálogo público.
 *
 * As rotas e componentes continuam consumindo este contrato, enquanto a
 * execução concreta atravessa a fronteira server-side de TanStack Start.
 */
export const publicVehicleCatalog = {
  listar: () => listarVeiculosPublicosServer(),
  obterPorId: (id: string) => obterVeiculoPublicoPorIdServer({ data: { id } }),
};
