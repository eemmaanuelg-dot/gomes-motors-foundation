import { mediaPublicUrl } from "@/infrastructure/storage/r2-storage";

const IMAGE_VERSION = "20260904-8";

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
    "https://garagem360.com.br/wp-content/uploads/2024/04/polo-highline.jpg",
    "https://img1.icarros.com/dbimg/imgadicionalnoticia/4/117726_1.jpg",
    "https://portaln10.com.br/fipecarros/wp-content/uploads/2024/09/volkswagen-polo-1.0-170-tsi-highline-automatico-wmimagem10003259618-1280x960.jpg",
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
    "https://img.olx.com.br/images/97/976542404655508.webp",
    "https://img.olx.com.br/images/83/839429148259404.jpg",
    "https://img.olx.com.br/images/62/623668632277020.webp",
  ],
};

export function resolveVehicleImage(reference: string | null, vehicleId: string): string {
  if (!reference) return "";

  // The six migrated demo vehicles are intentionally pinned to verified
  // galleries so stale D1 image references cannot restore the old demo media.
  const mappedImage = LEGACY_IMAGES[vehicleId]?.[0];
  if (mappedImage) return withCacheVersion(mappedImage);

  if (reference.startsWith("r2://")) return mediaPublicUrl(reference.slice(5));
  return reference;
}

export function resolveVehicleImages(references: string[], vehicleId: string): string[] {
  const mappedImages = LEGACY_IMAGES[vehicleId];
  if (mappedImages) return mappedImages.map(withCacheVersion);

  return references
    .map((reference) => resolveVehicleImage(reference, vehicleId))
    .filter((reference): reference is string => reference.length > 0);
}