import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("root mantém metadata essencial para compartilhamento e indexação", async () => {
  const source = await read("src/routes/__root.tsx");

  assert.match(source, /name: "description"/);
  assert.match(source, /property: "og:title"/);
  assert.match(source, /property: "og:description"/);
  assert.match(source, /property: "og:type"/);
  assert.match(source, /name: "twitter:card"/);
});

test("sitemap usa somente páginas públicas e catálogo público", async () => {
  const source = await read("src/routes/sitemap[.]xml.ts");

  assert.match(source, /\/estoque/);
  assert.match(source, /\/servicos/);
  assert.match(source, /\/sobre/);
  assert.match(source, /\/contato/);
  assert.match(source, /publicVehicleCatalog\.listar\(\)/);
  assert.doesNotMatch(source, /\/admin/);
});

test("robots bloqueia áreas administrativas e APIs", async () => {
  const source = await read("src/routes/robots[.]txt.ts");

  assert.match(source, /Disallow: \/admin/);
  assert.match(source, /Disallow: \/api\//);
  assert.match(source, /Sitemap: \$\{origin\}\/sitemap\.xml/);
});
