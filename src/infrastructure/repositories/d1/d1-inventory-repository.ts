import type { InventoryRepository } from "@/domain/inventory/repository";
import type { InventoryEntry, InventoryUpdate } from "@/domain/inventory/types";
import type { Id } from "@/domain/shared/types";
import type { D1DatabaseLike } from "./d1-types";

type InventoryRow = {
  vehicle_id: string;
  published: number;
  display_order: number;
  entry_at: string | null;
  exit_at: string | null;
};

function rowToEntry(row: InventoryRow): InventoryEntry {
  const entry: InventoryEntry = {
    vehicleId: row.vehicle_id,
    publicado: row.published === 1,
    ordem: row.display_order,
  };

  if (row.entry_at !== null) entry.entradaEm = row.entry_at;
  if (row.exit_at !== null) entry.saidaEm = row.exit_at;

  return entry;
}

export class D1InventoryRepository implements InventoryRepository {
  constructor(private readonly db: D1DatabaseLike) {}

  async obterPorVeiculoId(vehicleId: Id): Promise<InventoryEntry | null> {
    const result = await this.db
      .prepare(
        `SELECT vehicle_id, published, display_order, entry_at, exit_at
         FROM inventory_entries
         WHERE vehicle_id = ?
         LIMIT 1`,
      )
      .bind(vehicleId)
      .first<InventoryRow>();

    return result ? rowToEntry(result) : null;
  }

  async criar(item: InventoryEntry): Promise<InventoryEntry> {
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `INSERT INTO inventory_entries (
          id, vehicle_id, published, display_order, entry_at, exit_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        item.vehicleId,
        item.publicado ? 1 : 0,
        item.ordem,
        item.entradaEm ?? now,
        item.saidaEm ?? null,
        now,
        now,
      )
      .run();

    return (await this.obterPorVeiculoId(item.vehicleId)) as InventoryEntry;
  }

  async atualizar(vehicleId: Id, dados: InventoryUpdate): Promise<InventoryEntry> {
    const atual = await this.obterPorVeiculoId(vehicleId);
    if (!atual) {
      throw new Error(`Entrada de estoque do veículo "${vehicleId}" não encontrada.`);
    }

    const atualizado: InventoryEntry = { ...atual, ...dados };

    await this.db
      .prepare(
        `UPDATE inventory_entries SET
          published = ?, display_order = ?, entry_at = ?, exit_at = ?, updated_at = ?
         WHERE vehicle_id = ?`,
      )
      .bind(
        atualizado.publicado ? 1 : 0,
        atualizado.ordem,
        atualizado.entradaEm ?? null,
        atualizado.saidaEm ?? null,
        new Date().toISOString(),
        vehicleId,
      )
      .run();

    return (await this.obterPorVeiculoId(vehicleId)) as InventoryEntry;
  }
}
