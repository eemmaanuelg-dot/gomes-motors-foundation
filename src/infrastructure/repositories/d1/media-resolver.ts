import { mediaPublicUrl } from "@/infrastructure/storage/r2-storage";

const IMAGE_VERSION = "20260904-5";

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
    "https://www.usadofacil.com.br/fotoscarrosano/2026/09/1382042.jpg",
    "https://www.usadofacil.com.br/fotoscarrosano/2026/09/1382042-2.jpg",
    "https://www.usadofacil.com.br/fotoscarrosano/2026/09/1382042-3.jpg",
  ],
  polo: [
    "https://imgserver.autocarro.com.br/fotos/grande/volkswagen-polo-1.0-tsi-170-highline-12v-2023-chumbo_31e2613d915.jpg",
    "https://imgserver.autocarro.com.br/fotos/grande/volkswagen-polo-1.0-tsi-170-highline-12v-2023-chumbo_1e2613d9159.jpg",
    "https://imgserver.autocarro.com.br/fotos/grande/volkswagen-polo-1.0-tsi-170-highline-12v-2023-chumbo_2613d91599d.jpg",
  ],
  onix: [
    "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2024%2F06%2Fchevrolet-onix-2022-1-0-turbo-flex-ltz-automatico-flex-124597-u1ln38.jpg&w=810&zc=1",
    "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2024%2F06%2Fchevrolet-onix-2022-1-0-turbo-flex-ltz-automatico-flex-124597-zfr60k.jpg&w=810&zc=1",
    "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2024%2F06%2Fchevrolet-onix-2022-1-0-turbo-flex-ltz-automatico-flex-124597-ab28ou.jpg&w=810&zc=1",
  ],
  cb500f: [
    "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2022%2F10%2Fhonda-cb-500f-2022-cb-500f-108030-luegwn.jpg&w=810&zc=1",
    "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2022%2F10%2Fhonda-cb-500f-2022-cb-500f-108030-hjqxuf.jpg&w=810&zc=1",
    "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2022%2F10%2Fhonda-cb-500f-2022-cb-500f-108030-k00la7.jpg&w=810&zc=1",
  ],
  mt03: [
    "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2023%2F01%2Fyamaha-mt-03-abs-2023-mt-03-abs-gasolina-111152-4g6qfz.jpg&w=810&zc=1",
    "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2023%2F01%2Fyamaha-mt-03-abs-2023-mt-03-abs-gasolina-111152-dwxbsq.jpg&w=810&zc=1",
    "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2023%2F01%2Fyamaha-mt-03-abs-2023-mt-03-abs-gasolina-111152-m9u1na.jpg&w=810&zc=1",
  ],
};

export function resolveVehicleImage(reference: string | null, vehicleId: string): string {
  if (!reference) return "";

  // The six migrated demo vehicles are intentionally pinned to their
  // verified external galleries. This makes the resolver independent of
  // whether D1 still contains the original legacy reference or a previously
  // persisted direct URL.
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
