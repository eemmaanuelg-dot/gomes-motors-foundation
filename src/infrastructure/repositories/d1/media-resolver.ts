import imgCivic from "@/assets/veiculos/honda-civic-exl.jpg";
import imgCorolla from "@/assets/veiculos/toyota-corolla-gli.jpg";
import imgPolo from "@/assets/veiculos/vw-polo.jpg";
import imgOnix from "@/assets/veiculos/chevrolet-onix.jpg";
import imgCb500 from "@/assets/veiculos/honda-cb500f.jpg";
import imgMt03 from "@/assets/veiculos/yamaha-mt03.jpg";
import { mediaPublicUrl } from "@/infrastructure/storage/r2-storage";

const LEGACY_IMAGES: Record<string, string> = {
  "civic-exl": imgCivic,
  "corolla-gli": imgCorolla,
  polo: imgPolo,
  onix: imgOnix,
  cb500f: imgCb500,
  mt03: imgMt03,
};

export function resolveVehicleImage(reference: string | null, vehicleId: string): string {
  if (!reference) return "";
  if (reference.startsWith("r2://")) return mediaPublicUrl(reference.slice(5));
  if (!reference.startsWith("legacy://")) return reference;
  return LEGACY_IMAGES[vehicleId] ?? "";
}

export function resolveVehicleImages(references: string[], vehicleId: string): string[] {
  return references
    .map((reference) => resolveVehicleImage(reference, vehicleId))
    .filter((reference): reference is string => reference.length > 0);
}
