import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("baseline final mantém rotas públicas e operacionais essenciais", async () => {
  const routes = await read("src/routeTree.gen.ts");

  for (const route of [
    "/",
    "/estoque",
    "/estoque/$id",
    "/servicos",
    "/sobre",
    "/contato",
    "/avaliacoes",
    "/admin",
    "/admin/estoque",
    "/admin/crm",
    "/admin/operacao",
    "/admin/relatorios",
    "/admin/configuracoes",
  ]) {
    assert.match(routes, new RegExp(route.replaceAll("$", "\\$")));
  }
});

test("baseline final mantém endpoints públicos e administrativos críticos", async () => {
  const [leads, analytics, reviews, commercial, settings] = await Promise.all([
    read("src/routes/api.leads.ts"),
    read("src/routes/api.analytics.ts"),
    read("src/routes/api.reviews.ts"),
    read("src/routes/admin.commercial.api.ts"),
    read("src/routes/admin.settings.api.ts"),
  ]);

  assert.match(leads, /POST/);
  assert.match(analytics, /page_view/);
  assert.match(reviews, /GET/);
  assert.match(commercial, /createSale/);
  assert.match(settings, /value_json/);
});

test("baseline final mantém controles de segurança e recuperação documentados", async () => {
  const [security, backup, r2] = await Promise.all([
    read("src/lib/server-security.ts"),
    read("docs/BACKUP-RECOVERY.md"),
    read("docs/R2-MEDIA.md"),
  ]);

  assert.match(security, /X-Content-Type-Options/);
  assert.match(security, /isSameOriginRequest/);
  assert.match(security, /hasAcceptableJsonContentType/);
  assert.match(backup, /backup-d1\.mjs/);
  assert.match(backup, /gomes-motors-db/);
  assert.match(r2, /gomes-motors-media-2026/);
  assert.match(r2, /MEDIA_BUCKET/);
});

test("baseline final mantém SEO, acessibilidade e performance protegidos por testes", async () => {
  const [seo, a11y, performance] = await Promise.all([
    read("tests/seo-baseline.test.mjs"),
    read("tests/accessibility-baseline.test.mjs"),
    read("tests/performance-assets.test.mjs"),
  ]);

  assert.match(seo, /og:title/);
  assert.match(seo, /sitemap/);
  assert.match(a11y, /prefers-reduced-motion/);
  assert.match(a11y, /aria-roledescription/);
  assert.match(performance, /fetchPriority/);
  assert.match(performance, /loading/);
});
