import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, root), "utf8");
}

test("serviços mantém as cinco intenções comerciais persistidas como leads", async () => {
  const source = await readProjectFile("src/routes/servicos.tsx");

  assert.match(source, /intent: "comprar"/);
  assert.match(source, /type LeadIntent =/);
  for (const intent of ["comprar", "trocar", "financiar", "vender", "consignar"]) {
    assert.match(source, new RegExp(`\\"${intent}\\"`));
  }
  assert.match(source, /intent: tipo/);
  assert.ok(source.includes('fetch("/api/leads"'));
  assert.match(source, /credentials: "include"/);
});

test("simulação pública de financiamento permanece educativa e leva o contexto estimado ao atendimento", async () => {
  const source = await readProjectFile("src/routes/estoque_.$id.tsx");

  assert.match(source, /Simulação demonstrativa, sem compromisso/);
  assert.match(source, /Taxa indicativa/);
  assert.match(source, /não representa uma proposta ou aprovação de crédito/);
  assert.match(source, /intent=\"financiar\"/);
  assert.match(source, /simulation: true/);
  assert.match(source, /Entrada pretendida/);
  assert.match(source, /Prazo:/);
  assert.match(source, /Parcela estimada/);
});
