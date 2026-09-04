import { mediaPublicUrl } from "@/infrastructure/storage/r2-storage";

const IMAGE_VERSION = "20260904-6";

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
    "https://diascarmultimarcas.com.br/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-16.02.07-4.jpeg",
    "https://diascarmultimarcas.com.br/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-16.02.07-2.jpeg",
    "https://diascarmultimarcas.com.br/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-14-at-16.02.07-3.jpeg",
  ],
  polo: [
    "https://cdn.diariodolitoral.com.br/uploads/dn_arquivo/2023/03/volkswagen-capa-polo-highli.jpg",
    "https://cdn.diariodolitoral.com.br/uploads/dn_arquivo/2023/03/volkswagen-farol-polo-highl.jpg",
    "https://cdn.diariodolitoral.com.br/uploads/dn_arquivo/2023/03/volkswagen-lateral-polo-hig.jpg",
  ],
  onix: [
    "https://randazzoar.vtexassets.com/arquivos/ids/519991-800-auto?aspect=true&height=auto&v=639021212415470000&width=800",
    "https://randazzoar.vtexassets.com/arquivos/ids/519992-800-auto?aspect=true&height=auto&v=639021212418430000&width=800",
    "https://randazzoar.vtexassets.com/arquivos/ids/519993-800-auto?aspect=true&height=auto&v=639021212424370000&width=800",
  ],
  cb500f: [
    "https://www.honda.com.br/motos/sites/hda/files/2022-07/5F8A1615c.webp",
    "https://www.honda.com.br/motos/sites/hda/files/2022-07/5F8A2724c.webp",
    "https://www.honda.com.br/motos/sites/hda/files/2022-07/5F8A3379c.webp",
  ],
  mt03: [
    "https://img.olx.com.br/images/97/976542404655508.webp",
    "https://img.olx.com.br/images/83/839429148259404.jpg",
    "https://motonewsbrasil.com/wp-content/uploads/2022/05/yamaha-mt-03-2023-brasil-cinza-frontal-direita.jpg",
  ],
};

export function resolveVehicleImage(reference: string | null, vehicleId: string): string {
  if (!reference) return "";

  // The six migrated demo vehicles are intentionally pinned to their
  // verified galleries. This prevents stale D1 image references from
  // reintroducing the old demo photos after a deployment.
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
