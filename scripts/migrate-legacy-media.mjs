import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const bucket = "gomes-motors-media-2026";
const database = "gomes-motors-db";
const root = process.cwd();

const assets = [
  ["civic-exl", "src/assets/veiculos/honda-civic-exl.jpg"],
  ["corolla-gli", "src/assets/veiculos/toyota-corolla-gli.jpg"],
  ["polo", "src/assets/veiculos/vw-polo.jpg"],
  ["onix", "src/assets/veiculos/chevrolet-onix.jpg"],
  ["cb500f", "src/assets/veiculos/honda-cb500f.jpg"],
  ["mt03", "src/assets/veiculos/yamaha-mt03.jpg"],
];

const mimeByExtension = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

function run(args) {
  const result = spawnSync("npx", ["wrangler", ...args], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
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
  const r2Reference = `r2://${key}`;
  const imagesJson = JSON.stringify([r2Reference]);
  const now = new Date().toISOString();
  const mediaId = `legacy-${vehicleId}-primary`;
  const altText = `Imagem principal do veículo ${vehicleId}`;

  console.log(`\nEnviando ${relativePath} -> ${bucket}/${key}`);
  run([
    "r2",
    "object",
    "put",
    `${bucket}/${key}`,
    `--file=${filePath}`,
    `--content-type=${mime}`,
    "--cache-control=public, max-age=31536000, immutable",
    "--remote",
  ]);

  const updateSql = `UPDATE vehicles SET image_url = ${sqlLiteral(r2Reference)}, images_json = ${sqlLiteral(imagesJson)}, updated_at = datetime('now') WHERE id = ${sqlLiteral(vehicleId)};`;
  const deleteSql = `DELETE FROM vehicle_media WHERE object_key = ${sqlLiteral(key)};`;
  const insertSql = `INSERT INTO vehicle_media (id, vehicle_id, object_key, media_type, mime_type, display_order, alt_text, created_at, updated_at) VALUES (${sqlLiteral(mediaId)}, ${sqlLiteral(vehicleId)}, ${sqlLiteral(key)}, 'image', ${sqlLiteral(mime)}, 0, ${sqlLiteral(altText)}, ${sqlLiteral(now)}, ${sqlLiteral(now)});`;

  console.log(`Atualizando veículo e associação de mídia no D1 para ${vehicleId}`);
  run(["d1", "execute", database, "--remote", `--command=${updateSql}`]);
  run(["d1", "execute", database, "--remote", `--command=${deleteSql}`]);
  run(["d1", "execute", database, "--remote", `--command=${insertSql}`]);
}

console.log("\nMigração concluída. Valide os seis veículos no site e no Admin antes de remover qualquer asset legacy.");
