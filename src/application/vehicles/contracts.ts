import type { Vehicle } from "@/domain/vehicles/types";

/**
 * Contrato estável da aplicação para o catálogo público de veículos.
 *
 * A UI depende desta interface, não da implementação concreta (server/D1).
 * Isso permite trocar a infraestrutura sem alterar as rotas e componentes.
 */
export interface PublicVehicleCatalog {
  listar(): Promise<Vehicle[]>;
  obterPorId(id: string): Promise<Vehicle | null>;
}
