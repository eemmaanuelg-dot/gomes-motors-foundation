import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("rota administrativa principal trata ausência de autenticação do Cloudflare Access", async () => {
  const source = await read("src/routes/admin.tsx");

  assert.match(source, /fetch\("\/admin\/api"/);
  assert.match(source, /!response\.ok/);
  assert.match(source, /response\.status === 401/);
  assert.match(source, /Acesso não autenticado pelo Cloudflare Access\./);
});

test("shell administrativo consulta a identidade autenticada com credenciais da sessão", async () => {
  const source = await read("src/routes/admin.tsx");

  assert.match(source, /fetch\("\/cdn-cgi\/access\/get-identity"/);
  assert.match(source, /credentials: "include"/);
  assert.match(source, /cf-access-authenticated-user-email/);
});

test("endpoints administrativos críticos permanecem protegidos no servidor", async () => {
  const files = [
    "src/routes/admin.api.ts",
    "src/routes/admin.crm.api.ts",
    "src/routes/admin.commercial.api.ts",
    "src/routes/admin.settings.api.ts",
    "src/routes/admin.avaliacoes.api.ts",
    "src/routes/admin.media.ts",
  ];

  const sources = await Promise.all(files.map(read));

  for (const source of sources) {
    assert.match(source, /cf-access-authenticated-user-email/);
    assert.match(source, /isSameOriginRequest/);
  }
});
