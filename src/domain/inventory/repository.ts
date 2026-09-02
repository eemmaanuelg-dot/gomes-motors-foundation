import type { Id } from "../shared/types";
import type { InventoryEntry, InventoryUpdate } from "./types";

export interface InventoryRepository {
  obterPorVeiculoId(vehicleId: Id): Promise<InventoryEntry | null>;
  criar(item: InventoryEntry): Promise<InventoryEntry>;
  atualizar(vehicleId: Id, dados: InventoryUpdate): Promise<InventoryEntry>;
}
