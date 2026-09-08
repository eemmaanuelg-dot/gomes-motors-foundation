import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("checklist de produção mantém os gates críticos de D1, R2 e segurança", async () => {
  const checklist = await read("docs/PRODUCTION-CHECKLIST.md");

  assert.match(checklist, /Cloudflare Access/i);
  assert.match(checklist, /gomes-motors-db/);
  assert.match(checklist, /gomes-motors-media-2026/);
  assert.match(checklist, /0012_analytics_integrity\.sql/);
  assert.match(checklist, /18 imagens/);
  assert.match(checklist, /vehicle_media/);
  assert.match(checklist, /legacy:\/\//);
  assert.match(checklist, /backup/i);
});

test("checklist de produção preserva a regra de retorno após falha", async () => {
  const checklist = await read("docs/PRODUCTION-CHECKLIST.md");

  assert.match(checklist, /falh\S*[\s\S]{0,160}(?:correção|corrigida|corrigir)/i);
  assert.match(checklist, /correção|corrigida|corrigir/i);
  assert.match(checklist, /revalid/i);
});
