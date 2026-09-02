import { VEICULOS } from "@/data/vehicles";
import type { VehicleMediaRepository } from "@/domain/media/repository";
import type { VehicleMedia } from "@/domain/media/types";
import type { Id } from "@/domain/shared/types";

function clonarMedia(media: VehicleMedia): VehicleMedia {
  return { ...media };
}

function criarMidiasIniciais(): VehicleMedia[] {
  const agora = new Date().toISOString();

  return VEICULOS.flatMap((veiculo) =>
    veiculo.imagens.map((_, index): VehicleMedia => ({
      id: `${veiculo.id}-media-${index + 1}`,
      vehicleId: veiculo.id,
      objectKey: `legacy/vehicles/${veiculo.id}/${index + 1}`,
      mediaType: "image",
      mimeType: "image/jpeg",
      displayOrder: index,
      altText: `${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""}`,
      createdAt: agora,
      updatedAt: agora,
    }))
  );
}

/**
 * Repositório de transição para os metadados das imagens atuais.
 *
 * As URLs importadas pelo catálogo continuam sendo a fonte visual durante a
 * migração. O objectKey já segue o formato que será usado pelo R2, permitindo
 * trocar a origem sem alterar o contrato do domínio.
 */
export class StaticVehicleMediaRepository implements VehicleMediaRepository {
  private readonly media: VehicleMedia[] = criarMidiasIniciais();

  async listarPorVeiculo(vehicleId: Id): Promise<VehicleMedia[]> {
    return this.media
      .filter((item) => item.vehicleId === vehicleId)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(clonarMedia);
  }

  async obterPorId(id: Id): Promise<VehicleMedia | null> {
    const media = this.media.find((item) => item.id === id);
    return media ? clonarMedia(media) : null;
  }

  async adicionar(media: VehicleMedia): Promise<VehicleMedia> {
    if (this.media.some((item) => item.id === media.id)) {
      throw new Error(`Já existe uma mídia com o ID "${media.id}".`);
    }

    const novaMedia = clonarMedia(media);
    this.media.push(novaMedia);
    return clonarMedia(novaMedia);
  }

  async atualizar(
    id: Id,
    dados: Partial<Omit<VehicleMedia, "id" | "vehicleId">>
  ): Promise<VehicleMedia> {
    const index = this.media.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Mídia "${id}" não encontrada.`);
    }

    const atual = this.media[index];
    if (!atual) {
      throw new Error(`Mídia "${id}" não encontrada.`);
    }

    const atualizado: VehicleMedia = {
      ...atual,
      ...dados,
      id: atual.id,
      vehicleId: atual.vehicleId,
      updatedAt: dados.updatedAt ?? new Date().toISOString(),
    };

    this.media[index] = clonarMedia(atualizado);
    return clonarMedia(this.media[index]);
  }

  async remover(id: Id): Promise<void> {
    const index = this.media.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Mídia "${id}" não encontrada.`);
    }

    this.media.splice(index, 1);
  }
}

export const vehicleMediaRepository: VehicleMediaRepository =
  new StaticVehicleMediaRepository();
