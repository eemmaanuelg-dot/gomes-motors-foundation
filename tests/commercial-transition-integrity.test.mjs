import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8");
}

test("integridade das transições comerciais impede reserva e venda em estado inválido", async () => {
  const migration = await readProjectFile("db/migrations/0011_commercial_transition_integrity.sql");
  const api = await readProjectFile("src/routes/admin.commercial.api.ts");

  assert.match(migration, /trg_reservation_vehicle_available/);
  assert.match(migration, /status = 'disponivel'/);
  assert.match(migration, /RAISE\(ABORT, 'Veículo não está disponível para nova reserva\.'/);
  assert.match(migration, /trg_sale_vehicle_available/);
  assert.match(migration, /status <> 'disponivel'/);
  assert.match(migration, /status = 'ativa'/);
  assert.match(migration, /RAISE\(ABORT, 'Veículo não está disponível para nova venda\.'/);

  assert.match(api, /await db\.batch\(\[/);
  assert.match(api, /UPDATE vehicles SET status = 'reservado'/);
  assert.match(api, /UPDATE vehicles SET status = 'vendido'/);
});
