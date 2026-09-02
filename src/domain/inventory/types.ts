import type { Id, IsoDateTime, Money } from "../shared/types";
import type { VehicleStatus } from "../vehicles/types";

export type InventoryEntry = {
  vehicleId: Id;
  publicado: boolean;
  ordem: number;
  entradaEm?: IsoDateTime;
  saidaEm?: IsoDateTime;
};

export type InventoryUpdate = Partial<
  Pick<InventoryEntry, "publicado" | "ordem" | "entradaEm" | "saidaEm">
>;

export type InventorySnapshot = {
  vehicleId: Id;
  status: VehicleStatus;
  publicado: boolean;
  destaque: boolean;
  preco: Money;
  km: number;
  ordem: number;
};
