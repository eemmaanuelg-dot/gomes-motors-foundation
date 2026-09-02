import type { InventoryRepository } from "@/domain/inventory/repository";
import type { InventoryEntry, InventoryUpdate } from "@/domain/inventory/types";
import type { Id } from "@/domain/shared/types";
import type { D1Database } from "@/infrastructure/cloudflare/bindings";

interface InventoryRow {
  vehicle_id: string;
  publicado: number;
  ordem: number;
  entrada_em: string | null;
  saida_em: string | null;
}

function mapRow(row: InventoryRow): InventoryEntry {
  return {
    vehicleId: row.vehicle_id,
    publicado: row.publicado === 1,
    ordem: row.ordem,
    ...(row.entrada_em ? { entradaEm: row.entrada_em } : {}),
    ...(row.saida_em ? { saidaEm: row.saida_em } : {}),
  };
}

export class D1InventoryRepository implements InventoryRepository {
  constructor(private readonly db: D1Database) {}

  async obterPorVeiculoId(vehicleId: Id): Promise<InventoryEntry | null> {
    const row = await this.db
      .prepare("SELECT * FROM inventory_entries WHERE vehicle_id = ? LIMIT 1")
      .bind(vehicleId)
      .first<InventoryRow>();

    return row ? mapRow(row) : null;
  }

  async criar(item: InventoryEntry): Promise<InventoryEntry> {
    await this.db
      .prepare(
        `INSERT INTO inventory_entries (
          vehicle_id, publicado, ordem, entrada_em, saida_em
        ) VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(
        item.vehicleId,
        item.publicado ? 1 : 0,
        item.ordem,
        item.entradaEm ?? null,
        item.saidaEm ?? null,
      )
      .run();

    return { ...item };
  }

  async atualizar(vehicleId: Id, dados: InventoryUpdate): Promise<InventoryEntry> {
    const atual = await this.obterPorVeiculoId(vehicleId);
    if (!atual) {
      throw new Error(`Entrada de estoque do veículo "${vehicleId}" não encontrada.`);
    }

    const fields: string[] = [];
    const values: unknown[] = [];
    const add = (column: string, value: unknown) => {
      fields.push(`${column} = ?`);
      values.push(value);
    };

    if (dados.publicado !== undefined) add("publicado", dados.publicado ? 1 : 0);
    if (dados.ordem !== undefined) add("ordem", dados.ordem);
    if (dados.entradaEm !== undefined) add("entrada_em", dados.entradaEm ?? null);
    if (dados.saidaEm !== undefined) add("saida_em", dados.saidaEm ?? null);

    if (fields.length === 0) return atual;

    values.push(vehicleId);
    await this.db
      .prepare(`UPDATE inventory_entries SET ${fields.join(", ")} WHERE vehicle_id = ?`)
      .bind(...values)
      .run();

    const atualizado = await this.obterPorVeiculoId(vehicleId);
    if (!atualizado) {
      throw new Error(`Entrada de estoque do veículo "${vehicleId}" não encontrada após atualização.`);
    }

    return atualizado;
  }
}
