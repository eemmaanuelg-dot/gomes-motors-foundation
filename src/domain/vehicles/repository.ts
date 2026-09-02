import type { Vehicle, VehicleUpdate } from "./types";

export interface VehicleRepository {
  listarPublicados(): Promise<Vehicle[]>;
  listarTodos(): Promise<Vehicle[]>;
  obterPorId(id: string): Promise<Vehicle | null>;
  criar(veiculo: Vehicle): Promise<Vehicle>;
  atualizar(id: string, dados: VehicleUpdate): Promise<Vehicle>;
}
