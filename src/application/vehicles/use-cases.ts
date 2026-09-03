import type { InventoryRepository } from "@/domain/inventory/repository";
import type { InventoryEntry } from "@/domain/inventory/types";
import { fail, ok, type DomainErrorCode, type Result } from "@/domain/shared/types";
import { podeSerDestacado, validarTransicaoStatus } from "@/domain/vehicles/rules";
import type { VehicleRepository } from "@/domain/vehicles/repository";
import type { Vehicle, VehicleStatus, VehicleUpdate } from "@/domain/vehicles/types";

export type VehicleUseCaseDependencies = {
  vehicleRepository: VehicleRepository;
  inventoryRepository: InventoryRepository;
};

function erro<T>(code: DomainErrorCode, message: string): Result<T> {
  return fail(code, message);
}

export async function listarVeiculosPublicos(
  deps: VehicleUseCaseDependencies,
): Promise<Vehicle[]> {
  // O repositório é responsável por entregar apenas o catálogo publicável.
  // No D1 isso é resolvido em uma única consulta com JOIN no estoque, evitando
  // o padrão N+1 que existia na transição e que não escala com um estoque real.
  return deps.vehicleRepository.listarPublicados();
}

export async function obterVeiculoPublicoPorId(
  deps: VehicleUseCaseDependencies,
  id: string,
): Promise<Vehicle | null> {
  const veiculo = await deps.vehicleRepository.obterPorId(id);
  if (!veiculo || veiculo.status === "vendido") return null;

  const estoque = await deps.inventoryRepository.obterPorVeiculoId(id);
  return estoque?.publicado ? veiculo : null;
}

export async function obterVeiculoPorId(
  deps: VehicleUseCaseDependencies,
  id: string,
): Promise<Vehicle | null> {
  return deps.vehicleRepository.obterPorId(id);
}

export async function criarVeiculo(
  deps: VehicleUseCaseDependencies,
  veiculo: Vehicle,
): Promise<Vehicle> {
  return deps.vehicleRepository.criar(veiculo);
}

export async function editarVeiculo(
  deps: VehicleUseCaseDependencies,
  id: string,
  dados: VehicleUpdate,
): Promise<Result<Vehicle>> {
  const atual = await deps.vehicleRepository.obterPorId(id);
  if (!atual) return erro("NOT_FOUND", `Veículo "${id}" não encontrado.`);

  try {
    return ok(await deps.vehicleRepository.atualizar(id, dados));
  } catch (error) {
    return erro(
      "CONFLICT",
      error instanceof Error ? error.message : "Não foi possível atualizar o veículo.",
    );
  }
}

async function alterarStatus(
  deps: VehicleUseCaseDependencies,
  id: string,
  status: VehicleStatus,
): Promise<Result<Vehicle>> {
  const atual = await deps.vehicleRepository.obterPorId(id);
  if (!atual) return erro("NOT_FOUND", `Veículo "${id}" não encontrado.`);

  const validacao = validarTransicaoStatus(atual.status, status);
  if (!validacao.ok) {
    return erro(validacao.error.code, validacao.error.message);
  }

  try {
    return ok(await deps.vehicleRepository.atualizar(id, { status }));
  } catch (error) {
    return erro(
      "CONFLICT",
      error instanceof Error ? error.message : "Não foi possível alterar o status.",
    );
  }
}

export async function publicarVeiculo(
  deps: VehicleUseCaseDependencies,
  id: string,
): Promise<Result<InventoryEntry>> {
  const veiculo = await deps.vehicleRepository.obterPorId(id);
  if (!veiculo) return erro("NOT_FOUND", `Veículo "${id}" não encontrado.`);
  if (veiculo.status === "vendido") {
    return erro("CONFLICT", "Um veículo vendido não pode ser publicado.");
  }

  const atual = await deps.inventoryRepository.obterPorVeiculoId(id);
  if (!atual) {
    return ok(
      await deps.inventoryRepository.criar({
        vehicleId: id,
        publicado: true,
        ordem: Number.MAX_SAFE_INTEGER,
      }),
    );
  }

  if (atual.publicado) return erro("CONFLICT", "O veículo já está publicado.");

  return ok(await deps.inventoryRepository.atualizar(id, { publicado: true }));
}

export async function despublicarVeiculo(
  deps: VehicleUseCaseDependencies,
  id: string,
): Promise<Result<InventoryEntry>> {
  const atual = await deps.inventoryRepository.obterPorVeiculoId(id);
  if (!atual) {
    return erro(
      "NOT_FOUND",
      `Entrada de estoque do veículo "${id}" não encontrada.`,
    );
  }
  if (!atual.publicado) return erro("CONFLICT", "O veículo já está despublicado.");

  return ok(await deps.inventoryRepository.atualizar(id, { publicado: false }));
}

export async function destacarVeiculo(
  deps: VehicleUseCaseDependencies,
  id: string,
  destaque = true,
): Promise<Result<Vehicle>> {
  const atual = await deps.vehicleRepository.obterPorId(id);
  if (!atual) return erro("NOT_FOUND", `Veículo "${id}" não encontrado.`);
  if (destaque && !podeSerDestacado(atual.status)) {
    return erro("CONFLICT", "Um veículo vendido não pode ser destacado.");
  }

  try {
    return ok(await deps.vehicleRepository.atualizar(id, { destaque }));
  } catch (error) {
    return erro(
      "CONFLICT",
      error instanceof Error ? error.message : "Não foi possível alterar o destaque.",
    );
  }
}

export async function reservarVeiculo(
  deps: VehicleUseCaseDependencies,
  id: string,
): Promise<Result<Vehicle>> {
  return alterarStatus(deps, id, "reservado");
}

export async function venderVeiculo(
  deps: VehicleUseCaseDependencies,
  id: string,
): Promise<Result<Vehicle>> {
  const estoque = await deps.inventoryRepository.obterPorVeiculoId(id);
  if (!estoque) {
    return erro(
      "NOT_FOUND",
      `Entrada de estoque do veículo "${id}" não encontrada.`,
    );
  }

  const resultado = await alterarStatus(deps, id, "vendido");
  if (!resultado.ok) return resultado;

  await deps.inventoryRepository.atualizar(id, {
    publicado: false,
    saidaEm: new Date().toISOString(),
  });

  return resultado;
}

export async function liberarReserva(
  deps: VehicleUseCaseDependencies,
  id: string,
): Promise<Result<Vehicle>> {
  return alterarStatus(deps, id, "disponivel");
}
