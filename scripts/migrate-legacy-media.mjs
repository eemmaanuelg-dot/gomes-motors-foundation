import { existsSync, mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, join } from "node:path";

const bucket = "gomes-motors-media-2026";
const database = "gomes-motors-db";
const root = process.cwd();
const tempRoot = resolve(root, ".tmp-r2-migration");

const galleries = {
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

function extensionFromUrl(url) {
  const pathname = new URL(url).pathname.toLowerCase();
  const extension = pathname.split(".").pop();
  return extension && mimeByExtension[extension] ? extension : "jpg";
}

async function download(url, filePath) {
  const response = await fetch(url, {
    headers: { "user-agent": "Gomes-Motors-R2-Migration/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Falha ao baixar ${url}: HTTP ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 10_000) {
    throw new Error(`Arquivo suspeito ou vazio para ${url} (${buffer.length} bytes)`);
  }

  await Bun.write(filePath, buffer);
}

async function main() {
  for (const [vehicleId, sources] of Object.entries(galleries)) {
    if (sources.length !== 3) {
      throw new Error(`Galeria inválida para ${vehicleId}: esperado exatamente 3 imagens.`);
    }
  }

  mkdirSync(tempRoot, { recursive: true });

  try {
    for (const [vehicleId, sources] of Object.entries(galleries)) {
      const references = [];
      const mediaRows = [];

      console.log(`\n=== ${vehicleId} ===`);

      for (let index = 0; index < sources.length; index += 1) {
        const source = sources[index];
        const extension = extensionFromUrl(source);
        const mime = mimeByExtension[extension];
        const localPath = join(tempRoot, `${vehicleId}-${index + 1}.${extension}`);
        const key = `vehicles/${vehicleId}/${index + 1}.${extension}`;
        const reference = `r2://${key}`;
        const mediaId = `catalog-${vehicleId}-${index + 1}`;
        const altText = `Imagem ${index + 1} do veículo ${vehicleId}`;

        console.log(`Baixando imagem ${index + 1}: ${source}`);
        await download(source, localPath);

        console.log(`Enviando -> ${bucket}/${key}`);
        run([
          "r2",
          "object",
          "put",
          `${bucket}/${key}`,
          `--file=${localPath}`,
          `--content-type=${mime}`,
          "--cache-control=public, max-age=31536000, immutable",
          "--remote",
        ]);

        references.push(reference);
        mediaRows.push({ mediaId, key, mime, altText, now: new Date().toISOString() });
      }

      const imagesJson = JSON.stringify(references);
      const updateSql = `UPDATE vehicles SET image_url = ${sqlLiteral(references[0])}, images_json = ${sqlLiteral(imagesJson)}, updated_at = datetime('now') WHERE id = ${sqlLiteral(vehicleId)};`;
      const deleteSql = `DELETE FROM vehicle_media WHERE vehicle_id = ${sqlLiteral(vehicleId)};`;

      console.log(`Atualizando vehicles e vehicle_media no D1 para ${vehicleId}`);
      run(["d1", "execute", database, "--remote", `--command=${updateSql}`]);
      run(["d1", "execute", database, "--remote", `--command=${deleteSql}`]);

      for (let index = 0; index < mediaRows.length; index += 1) {
        const row = mediaRows[index];
        const insertSql = `INSERT INTO vehicle_media (id, vehicle_id, object_key, media_type, mime_type, display_order, alt_text, created_at, updated_at) VALUES (${sqlLiteral(row.mediaId)}, ${sqlLiteral(vehicleId)}, ${sqlLiteral(row.key)}, 'image', ${sqlLiteral(row.mime)}, ${index}, ${sqlLiteral(row.altText)}, ${sqlLiteral(row.now)}, ${sqlLiteral(row.now)});`;
        run(["d1", "execute", database, "--remote", `--command=${insertSql}`]);
      }
    }

    console.log("\nMigração concluída: 18 imagens aprovadas foram enviadas para R2 e associadas aos seis veículos no D1.");
  } finally {
    if (existsSync(tempRoot)) rmSync(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error("\nMigração interrompida:", error instanceof Error ? error.message : error);
  process.exit(1);
});
