import { mediaPublicUrl } from "@/infrastructure/storage/r2-storage";

const IMAGE_VERSION = "20260905-4";
const R2_MEDIA_PREFIX = "vehicles/";

function withCacheVersion(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}gm=${IMAGE_VERSION}`;
}

const LEGACY_IMAGES: Record<string, string[]> = {
  "civic-exl": [
    "https://www.autocerto.com/fotos/1761/3248676/11_033817.jpg",
    "https://www.autocerto.com/fotos/1761/3248676/12_033817.jpg",
    "https://www.autocerto.com/fotos/1761/3248676/13_033817.jpg",
  ],
  "corolla-gli": [
    "https://upload.wikimedia.org/wikipedia/commons/b/b4/Toyota_Corolla_1.6_XLi_2021_%2850638290137%29.jpg",
    "https://www.dubicars.com/images/e999b1/w_1300x760/true-value-automobile/f971f831-0fcf-428c-9bb0-4836c9b2458b.jpeg",
    "https://www.dubicars.com/images/0cc623/w_1300x760/perfect-automobiles-trading-llc/fb264773-074b-45de-8c50-b8db8118ef93.jpg",
  ],
  polo: [
    "https://img1.icarros.com/dbimg/imgadicionalnoticia/4/117726_1.jpg",
    "https://cdn.diariodolitoral.com.br/uploads/dn_arquivo/2023/03/volkswagen-farol-polo-highl.jpg",
    "https://cdn.diariodolitoral.com.br/uploads/dn_arquivo/2023/03/volkswagen-lateral-polo-hig.jpg",
  ],
  onix: [
    "https://www.autocerto.com/fotos/1468/2677690/1.jpg",
    "https://www.autocerto.com/fotos/1468/2677690/2.jpg",
    "https://www.autocerto.com/fotos/1468/2677690/3.jpg",
  ],
  cb500f: [
    "https://www.honda.com.br/motos/sites/hda/files/2022-07/5F8A1615c.webp",
    "https://www.honda.com.br/motos/sites/hda/files/2022-07/5F8A2724c.webp",
    "https://www.honda.com.br/motos/sites/hda/files/2022-07/5F8A3379c.webp",
  ],
  mt03: [
    "https://motonewsbrasil.com/wp-content/uploads/2022/05/yamaha-mt-03-2023-brasil-cinza-frontal-direita.jpg",
    "https://motonewsbrasil.com/wp-content/uploads/2022/05/yamaha-mt-03-2023-brasil-cinza-lateral-direita-1000x667.jpg.webp",
    "https://motonewsbrasil.com/wp-content/uploads/2022/05/yamaha-mt-03-2023-brasil-cinza-traseira-esquerda-1000x667.jpg.webp",
  ],
};

function legacyImageIndex(reference: string): number {
  const match = reference.match(/\/(?:primary|image)-(\d+)$/i);
  if (match) return Math.max(0, Number(match[1]) - 1);
  return 0;
}

function resolveR2Reference(reference: string): string {
  const objectKey = reference.slice(5).trim();
  if (!objectKey || !objectKey.startsWith(R2_MEDIA_PREFIX) || objectKey.includes("..")) return "";
  return mediaPublicUrl(objectKey);
}

export function resolveVehicleImage(reference: string | null, vehicleId: string): string {
  if (!reference) return "";

  const normalized = reference.trim();
  if (!normalized) return "";

  if (normalized.startsWith("r2://")) {
    return resolveR2Reference(normalized);
  }

  if (normalized.startsWith("legacy://")) {
    const images = LEGACY_IMAGES[vehicleId] ?? [];
    const image = images[legacyImageIndex(normalized)] ?? images[0] ?? "";
    return image ? withCacheVersion(image) : "";
  }

  if (/^https?:\/\//i.test(normalized)) {
    return withCacheVersion(normalized);
  }

  return "";
}

export function resolveVehicleImages(references: string[], vehicleId: string): string[] {
  return references
    .map((reference) => resolveVehicleImage(reference, vehicleId))
    .filter((reference): reference is string => reference.length > 0);
}
