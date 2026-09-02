import { VEICULOS } from "@/data/vehicles";
import type { VehicleRepository } from "@/domain/vehicles/repository";
import type { Vehicle, VehicleUpdate } from "@/domain/vehicles/types";

function clonarVeiculo(veiculo: Vehicle): Vehicle {
  return {
    ...veiculo,
    imagens: [...veiculo.imagens],
    equipamentos: [...veiculo.equipamentos],
    fichaTecnica: { ...veiculo.fichaTecnica },
    financiamento: {
      ...veiculo.financiamento,
      parcelas: [...veiculo.financiamento.parcelas],
    },
  };
}

function carregarVeiculosIniciais(): Vehicle[] {
  return VEICULOS.map((veiculo) => clonarVeiculo(veiculo));
}

/**
 * Repositório de transição que mantém os seis veículos atuais fora das rotas.
 *
 * A implementação é deliberadamente em memória: ela prepara a aplicação para
 * trocar a fonte estática por D1 futuramente sem alterar o contrato do domínio.
 */
export class StaticVehicleRepository implements VehicleRepository {
  private readonly vehicles: Vehicle[] = carregarVeiculosIniciais();

  async listarPublicados(): Promise<Vehicle[]> {
    return this.vehicles
      .filter((veiculo) => veiculo.status !== "vendido")
      .map(clonarVeiculo);
  }

  async listarTodos(): Promise<Vehicle[]> {
    return this.vehicles.map(clonarVeiculo);
  }

  async obterPorId(id: string): Promise<Vehicle | null> {
    const veiculo = this.vehicles.find((item) => item.id === id);
    return veiculo ? clonarVeiculo(veiculo) : null;
  }

  async criar(veiculo: Vehicle): Promise<Vehicle> {
    if (this.vehicles.some((item) => item.id === veiculo.id)) {
      throw new Error(`Já existe um veículo com o ID "${veiculo.id}".`);
    }

    const novoVeiculo = clonarVeiculo(veiculo);
    this.vehicles.push(novoVeiculo);
    return clonarVeiculo(novoVeiculo);
  }

  async atualizar(id: string, dados: VehicleUpdate): Promise<Vehicle> {
    const index = this.vehicles.findIndex((veiculo) => veiculo.id === id);

    if (index === -1) {
      throw new Error(`Veículo "${id}" não encontrado.`);
    }

    const atual = this.vehicles[index];
    if (!atual) {
      throw new Error(`Veículo "${id}" não encontrado.`);
    }

    const atualizado: Vehicle = {
      ...atual,
      ...dados,
      id: atual.id,
    };

    this.vehicles[index] = clonarVeiculo(atualizado);
    return clonarVeiculo(this.vehicles[index]);
  }
}

export const vehicleRepository: VehicleRepository = new StaticVehicleRepository();
