import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const bucket = "gomes-motors-media-2026";
const root = process.cwd();

const assets = [
  ["civic-exl", "src/assets/veiculos/honda-civic-exl.jpg"],
  ["corolla-gli", "src/assets/veiculos/toyota-corolla-gli.jpg"],
  ["polo", "src/assets/veiculos/vw-polo.jpg"],
  ["onix", "src/assets/veiculos/chevrolet-onix.jpg"],
  ["cb500f", "src/assets/veiculos/honda-cb500f.jpg"],
  ["mt03", "src/assets/veiculos/yamaha-mt03.jpg"],
];

const mimeByExtension = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };

function run(args) {
  const result = spawnSync("npx", ["wrangler", ...args], { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function sqlLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

for (const [vehicleId, relativePath] of assets) {
  const filePath = resolve(root, relativePath);
  if (!existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${relativePath}`);
    process.exit(1);
  }

  const extension = relativePath.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `vehicles/${vehicleId}/primary.${extension}`;
  const mime = mimeByExtension[extension] ?? "application/octet-stream";

  console.log(`\nEnviando ${relativePath} -> ${bucket}/${key}`);
  run(["r2", "object", "put", `${bucket}/${key}`, `--file=${filePath}`, `--content-type=${mime}`, "--cache-control=public, max-age=31536000, immutable", "--remote"]);

  const imagesJson = JSON.stringify([`r2://${key}`]);
  const sql = `UPDATE vehicles SET image_url = ${sqlLiteral(`r2://${key}`)}, images_json = ${sqlLiteral(imagesJson)}, updated_at = datetime('now') WHERE id = ${sqlLiteral(vehicleId)};`;
  console.log(`Atualizando referência D1 para ${vehicleId}`);
  run(["d1", "execute", "gomes-motors-db", "--remote", `--command=${sql}`]);
}

console.log("\nMigração concluída. Valide os seis veículos no site antes de remover qualquer asset legacy.");
