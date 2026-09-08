import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const ADMIN_UI_FILES = [
  "src/routes/admin.tsx",
  "src/routes/admin.crm.tsx",
  "src/routes/admin.operacao.tsx",
  "src/routes/admin.configuracoes.tsx",
  "src/routes/admin.relatorios.tsx",
];

test("telas administrativas não tratam falha de API como acesso concedido", async () => {
  const sources = await Promise.all(ADMIN_UI_FILES.map(read));

  for (const source of sources) {
    assert.match(source, /fetch\("\/admin/);
    assert.match(source, /!response\.ok|!r\.ok/);
    assert.match(source, /error|message/);
  }
});

test("telas administrativas mantêm APIs distintas por módulo", async () => {
  const [crm, operation, settings, reports] = await Promise.all([
    read("src/routes/admin.crm.tsx"),
    read("src/routes/admin.operacao.tsx"),
    read("src/routes/admin.configuracoes.tsx"),
    read("src/routes/admin.relatorios.tsx"),
  ]);

  assert.match(crm, /\/admin\/crm\/api/);
  assert.match(operation, /\/admin\/commercial\/api/);
  assert.match(settings, /\/admin\/settings\/api/);
  assert.match(reports, /\/admin\/reports\/api/);
});
