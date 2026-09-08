import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const ADMIN_API_FILES = [
  "src/routes/admin.api.ts",
  "src/routes/admin.avaliacoes.api.ts",
  "src/routes/admin.crm.api.ts",
  "src/routes/admin.commercial.api.ts",
  "src/routes/admin.settings.api.ts",
  "src/routes/admin.media.ts",
];

test("contrato administrativo mantém autenticação server-side nos endpoints críticos", async () => {
  const sources = await Promise.all(ADMIN_API_FILES.map(read));

  for (const source of sources) {
    assert.match(source, /cf-access-authenticated-user-email/);
    assert.match(source, /Acesso administrativo não autenticado/);
    assert.match(source, /isSameOriginRequest/);
  }
});

test("contrato administrativo mantém proteção de payload nos endpoints JSON críticos", async () => {
  const [admin, crm, reviews, commercial, settings] = await Promise.all([
    read("src/routes/admin.api.ts"),
    read("src/routes/admin.crm.api.ts"),
    read("src/routes/admin.avaliacoes.api.ts"),
    read("src/routes/admin.commercial.api.ts"),
    read("src/routes/admin.settings.api.ts"),
  ]);

  for (const source of [admin, crm, reviews, commercial, settings]) {
    assert.match(source, /hasAcceptableJsonContentType/);
    assert.match(source, /exceedsBodyLimit/);
  }
});

test("contrato de mídia mantém limite específico para imagens e validação de R2", async () => {
  const source = await read("src/routes/admin.media.ts");

  assert.match(source, /MAX_IMAGE_BYTES = 10 \* 1024 \* 1024/);
  assert.match(source, /MAX_MULTIPART_BYTES/);
  assert.match(source, /requireR2Bucket/);
  assert.match(source, /image\/jpeg/);
  assert.match(source, /image\/png/);
  assert.match(source, /image\/webp/);
  assert.match(source, /image\/avif/);
});
