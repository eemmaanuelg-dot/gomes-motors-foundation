import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("contrato R2 mantém bucket, binding e prefixo de mídia alinhados", async () => {
  const [wrangler, resolver, migration] = await Promise.all([
    read("wrangler.jsonc"),
    read("src/infrastructure/repositories/d1/media-resolver.ts"),
    read("scripts/migrate-legacy-media.mjs"),
  ]);

  assert.match(wrangler, /"binding": "MEDIA_BUCKET"/);
  assert.match(wrangler, /"bucket_name": "gomes-motors-media-2026"/);
  assert.match(resolver, /const R2_MEDIA_PREFIX = "vehicles\/"/);
  assert.match(resolver, /normalized\.startsWith\("r2:\\/\\/"\)/);
  assert.match(migration, /const bucket = "gomes-motors-media-2026"/);
  assert.match(migration, /const key = `vehicles\/\$\{vehicleId\}\/\$\{index \+ 1\}\.\$\{extension\}`/);
  assert.match(migration, /const reference = `r2:\/\/\$\{key\}`/);
});

test("migração R2 preserva exatamente três imagens por veículo e recria a galeria no D1", async () => {
  const source = await read("scripts/migrate-legacy-media.mjs");

  assert.match(source, /sources\.length !== 3/);
  assert.match(source, /DELETE FROM vehicle_media/);
  assert.match(source, /INSERT INTO vehicle_media/);
  assert.match(source, /display_order/);
  assert.match(source, /alt_text/);
  assert.match(source, /--remote/);
});
