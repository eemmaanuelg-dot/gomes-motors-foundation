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
  assert.match(source, /keepalive: true/);
});

test("fluxos públicos com veículo usam o catálogo operacional e enviam o identificador selecionado", async () => {
  const source = await readProjectFile("src/routes/servicos.tsx");

  assert.match(source, /publicVehicleCatalog\.listar\(\)/);
  assert.doesNotMatch(source, /@\/data\/vehicles/);
  assert.doesNotMatch(source, /\\bVEICULOS\\b/);
  assert.match(source, /intent: "comprar", vehicleId: veiculo\.id/);
  assert.match(source, /intent: "trocar", vehicleId: veiculo\.id/);
  assert.match(source, /intent: "financiar", vehicleId: veiculo\.id/);
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

test("API pública de leads aplica as proteções básicas e restringe as intenções", async () => {
  const source = await readProjectFile("src/routes/api.leads.ts");

  assert.match(source, /isSameOriginRequest\(request\)/);
  assert.match(source, /hasAcceptableJsonContentType\(request\)/);
  assert.match(source, /exceedsBodyLimit\(request\)/);
  assert.match(source, /ALLOWED_INTENTS/);
  for (const intent of ["comprar", "trocar", "financiar", "vender", "consignar", "contato"]) {
    assert.match(source, new RegExp(`\\"${intent}\\"`));
  }
  assert.match(source, /if \(!phone && !email\)/);
});

test("API pública confirma veículos e persiste o lead com evento e auditoria", async () => {
  const source = await readProjectFile("src/routes/api.leads.ts");

  assert.match(source, /SELECT id FROM vehicles WHERE id = \?/);
  assert.match(source, /INSERT INTO leads/);
  assert.match(source, /INSERT INTO lead_events/);
  assert.match(source, /INSERT INTO audit_logs/);
  assert.match(source, /return json\(\{ ok: true, leadId \}\)/);
});

test("API mantém coerência entre veículo do lead e veículo da simulação", async () => {
  const source = await readProjectFile("src/routes/api.leads.ts");

  assert.match(source, /const simulation = safeSimulation\(body\.simulation\)/);
  assert.match(source, /simulationVehicleId/);
  assert.match(source, /if \(simulationVehicleId && vehicleId && simulationVehicleId !== vehicleId\)/);
  assert.match(source, /O veículo da simulação não corresponde ao veículo informado/);
});

test("formulário público somente confirma sucesso após a API aceitar o lead", async () => {
  const source = await readProjectFile("src/components/site/PublicLeadForm.tsx");

  assert.match(source, /await fetch\(\"\/api\/leads\"/);
  assert.match(source, /if \(!response\.ok \|\| !result\.ok\)/);
  assert.match(source, /setFeedback\(\{ ok: true/);
  assert.match(source, /trackAnalytics\(\{ eventName: \"lead_intent\"/);
});

test("superfícies públicas críticas possuem contrato responsivo para mobile e telas maiores", async () => {
  const routes = [
    "src/routes/index.tsx",
    "src/routes/estoque.tsx",
    "src/routes/servicos.tsx",
    "src/routes/contato.tsx",
  ];

  for (const route of routes) {
    const source = await readProjectFile(route);
    assert.match(source, /(?:sm|md|lg):[A-Za-z0-9\-\[\]/.%]+/, `${route} deve possuir utilitários responsivos`);
  }

  const home = await readProjectFile("src/routes/index.tsx");
  const stock = await readProjectFile("src/routes/estoque.tsx");
  const services = await readProjectFile("src/routes/servicos.tsx");
  const contact = await readProjectFile("src/routes/contato.tsx");

  assert.match(home, /grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5/);
  assert.match(home, /grid gap-5 sm:grid-cols-2 lg:grid-cols-3/);
  assert.match(stock, /grid-cols-2 gap-2/);
  assert.match(stock, /sm:grid-cols-3/);
  assert.match(services, /grid gap-4 sm:grid-cols-2/);
  assert.match(services, /sm:grid-cols-3/);
  assert.match(contact, /w-full max-w-md/);
  assert.match(contact, /sm:p-8/);
});
