import type { Id } from "../shared/types";
import type { VehicleMedia } from "./types";

export interface VehicleMediaRepository {
  listarPorVeiculo(vehicleId: Id): Promise<VehicleMedia[]>;
  obterPorId(id: Id): Promise<VehicleMedia | null>;
  adicionar(media: VehicleMedia): Promise<VehicleMedia>;
  atualizar(id: Id, dados: Partial<Omit<VehicleMedia, "id" | "vehicleId">>): Promise<VehicleMedia>;
  remover(id: Id): Promise<void>;
}
