import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8");
}

test("D1 foundation keeps the configured source of truth and migration chain", async () => {
  const wrangler = await readProjectFile("wrangler.jsonc");
  const packageJson = await readProjectFile("package.json");
  const migrationDir = new URL("db/migrations/", root);
  const files = (await readdir(migrationDir)).filter((file) => /^\d{4}_.+\.sql$/.test(file)).sort();

  assert.match(wrangler, /"binding": "DB"/);
  assert.match(wrangler, /"database_name": "gomes-motors-db"/);
  assert.match(wrangler, /"migrations_dir": "db\/migrations"/);
  assert.match(wrangler, /"VEHICLE_DATA_SOURCE": "d1"/);
  assert.match(packageJson, /"db:migrate:local": "wrangler d1 migrations apply gomes-motors-db --local"/);
  assert.match(packageJson, /"db:migrate:remote": "wrangler d1 migrations apply gomes-motors-db --remote"/);

  assert.deepEqual(
    files.map((file) => file.slice(0, 4)),
    Array.from({ length: files.length }, (_, index) => String(index + 1).padStart(4, "0")),
    "migrations must remain sequential without gaps"
  );
  assert.ok(files.length >= 10, "the current foundation must include the complete migration chain");
});

test("D1 foundation retains the commercial schema migration at the end of the current chain", async () => {
  const migration = await readProjectFile("db/migrations/0010_financing_sale_integrity.sql");
  const commercialMigration = await readProjectFile("db/migrations/0007_commercial_operations.sql");

  assert.match(commercialMigration, /CREATE TABLE IF NOT EXISTS leads/);
  assert.match(commercialMigration, /CREATE TABLE IF NOT EXISTS sales/);
  assert.match(commercialMigration, /CREATE TABLE IF NOT EXISTS financing_operations/);
  assert.match(migration, /CREATE UNIQUE INDEX IF NOT EXISTS/);
  assert.match(migration, /financing_operations/);
  assert.match(migration, /sales/);
});
