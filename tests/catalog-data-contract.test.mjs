import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8");
}

test("catalogo estatico mantem os seis veiculos e a entrada minima demonstrativa", async () => {
  const source = await readProjectFile("src/data/vehicles.ts");
  const expectedIds = ["civic-exl", "corolla-gli", "polo", "onix", "cb500f", "mt03"];

  for (const id of expectedIds) {
    assert.match(source, new RegExp(`id: \\"${id}\\"`), `veiculo ausente: ${id}`);
  }

  assert.equal(
    (source.match(/entradaMinima: 1000/g) ?? []).length,
    expectedIds.length,
    "todos os veiculos devem usar entrada minima demonstrativa de R$ 1.000"
  );
  assert.match(source, /id: "onix"[\s\S]*?cambio: "Automático"/);
  assert.match(
    source,
    /id: "onix"[\s\S]*?seoDescription:[\s\S]*?câmbio automático/
  );
});

test("migration 0006 normaliza o D1 sem reescrever historico", async () => {
  const migration = await readProjectFile("db/migrations/0006_catalog_data_corrections.sql");
  const expectedIds = ["civic-exl", "corolla-gli", "polo", "onix", "cb500f", "mt03"];

  assert.match(migration, /UPDATE vehicles[\s\S]*?WHERE id = 'onix';/);
  assert.match(migration, /transmission = 'Automático'/);
  assert.match(migration, /seo_description = 'Chevrolet Onix LTZ 2022 usado/);
  assert.match(migration, /json_set\(financing_json, '\$\.entradaMinima', 1000\)/);

  for (const id of expectedIds) {
    assert.match(migration, new RegExp(`['\\\"]${id}['\\\"]`), `migration sem referencia a ${id}`);
  }

  assert.match(migration, /Não alteramos migrations históricas/);
});
