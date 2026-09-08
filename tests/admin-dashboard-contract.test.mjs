import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("dashboard administrativo expõe visão operacional de estoque e comercial", async () => {
  const api = await read("src/routes/admin.api.ts");
  const ui = await read("src/routes/admin.tsx");

  assert.match(api, /dashboard:\s*\{/);
  assert.match(api, /estoque:\s*\{/);
  assert.match(api, /comercial:\s*\{/);
  assert.match(api, /atividadesRecentes/);
  assert.match(api, /countByEntity\("lead"\)/);
  assert.match(api, /countByEntity\("evaluation"\)/);
  assert.match(api, /countByEntity\("negotiation"\)/);
  assert.match(api, /countByEntity\("sale"\)/);

  assert.match(ui, /type AdminData =/);
  assert.match(ui, /AdminShell/);
  assert.match(ui, /Dashboard/);
});

test("dashboard administrativo mantém resposta sem cache e proteção de acesso", async () => {
  const api = await read("src/routes/admin.api.ts");

  assert.match(api, /Cache-Control.*no-store/);
  assert.match(api, /if \(!authorized\(request\)\) return json\(\{ error: "Acesso administrativo não autenticado\." \}, 401\)/);
  assert.match(api, /rejectCrossOrigin\(request\)/);
});
