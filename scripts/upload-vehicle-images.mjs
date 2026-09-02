import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const bucket = "gomes-motors-vehicle-images";
const images = [
  ["civic-exl", "src/assets/veiculos/honda-civic-exl.jpg"],
  ["corolla-gli", "src/assets/veiculos/toyota-corolla-gli.jpg"],
  ["polo", "src/assets/veiculos/vw-polo.jpg"],
  ["onix", "src/assets/veiculos/chevrolet-onix.jpg"],
  ["cb500f", "src/assets/veiculos/honda-cb500f.jpg"],
  ["mt03", "src/assets/veiculos/yamaha-mt03.jpg"],
];

for (const [vehicleId, relativePath] of images) {
  const file = resolve(relativePath);
  const key = `vehicles/${vehicleId}/0.jpg`;

  if (!existsSync(file)) {
    throw new Error(`Imagem não encontrada: ${file}`);
  }

  console.log(`Enviando ${relativePath} → ${bucket}/${key}`);
  execFileSync(
    "npx",
    ["wrangler", "r2", "object", "put", `${bucket}/${key}`, "--file", file, "--remote"],
    { stdio: "inherit" },
  );
}

console.log("Imagens dos seis veículos sincronizadas com o R2.");
