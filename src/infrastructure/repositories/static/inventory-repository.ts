import type { InventoryRepository } from "@/domain/inventory/repository";
import type { InventoryEntry, InventoryUpdate } from "@/domain/inventory/types";
import type { Id } from "@/domain/shared/types";
import { VEICULOS } from "@/data/vehicles";

function clonarEntrada(item: InventoryEntry): InventoryEntry {
  return { ...item };
}

function carregarInventarioInicial(): InventoryEntry[] {
  return VEICULOS.map((veiculo, index) => ({
    vehicleId: veiculo.id,
    publicado: veiculo.status !== "vendido",
    ordem: index + 1,
  }));
}

/**
 * Repositório transitório do estoque. Mantém a publicação separada do
 * cadastro do veículo para que a futura persistência em D1 preserve o mesmo
 * contrato de domínio.
 */
export class StaticInventoryRepository implements InventoryRepository {
  private readonly entries: InventoryEntry[] = carregarInventarioInicial();

  async obterPorVeiculoId(vehicleId: Id): Promise<InventoryEntry | null> {
    const item = this.entries.find((entry) => entry.vehicleId === vehicleId);
    return item ? clonarEntrada(item) : null;
  }

  async criar(item: InventoryEntry): Promise<InventoryEntry> {
    if (this.entries.some((entry) => entry.vehicleId === item.vehicleId)) {
      throw new Error(`Já existe uma entrada de estoque para o veículo "${item.vehicleId}".`);
    }

    const novaEntrada = clonarEntrada(item);
    this.entries.push(novaEntrada);
    return clonarEntrada(novaEntrada);
  }

  async atualizar(vehicleId: Id, dados: InventoryUpdate): Promise<InventoryEntry> {
    const index = this.entries.findIndex((entry) => entry.vehicleId === vehicleId);

    if (index === -1) {
      throw new Error(`Entrada de estoque do veículo "${vehicleId}" não encontrada.`);
    }

    const atual = this.entries[index];
    if (!atual) {
      throw new Error(`Entrada de estoque do veículo "${vehicleId}" não encontrada.`);
    }

    const atualizado: InventoryEntry = {
      ...atual,
      ...dados,
      vehicleId: atual.vehicleId,
    };

    this.entries[index] = clonarEntrada(atualizado);
    return clonarEntrada(this.entries[index]);
  }
}

export const inventoryRepository: InventoryRepository = new StaticInventoryRepository();
