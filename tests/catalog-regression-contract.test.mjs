import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("estoque mantém carregamento do catálogo público e navegação para detalhes", async () => {
  const source = await read("src/routes/estoque.tsx");

  assert.match(source, /loader: \(\) => publicVehicleCatalog\.listar\(\)/);
  assert.match(source, /href=\{`\/estoque\/\$\{veiculo\.id\}`\}/);
  assert.match(source, /Ver detalhes/);
  assert.match(source, /StatusBadge/);
  assert.match(source, /status === "vendido"/);
});

test("estoque mantém categorias, filtros dependentes e ordenação comercial", async () => {
  const source = await read("src/routes/estoque.tsx");

  for (const value of ["todos", "carros", "motos"]) {
    assert.match(source, new RegExp(`value: "${value}"`));
  }

  for (const key of [
    "marca", "modelo", "versao", "ano", "preco", "km",
    "cambio", "combustivel", "cilindrada", "tipo",
  ]) {
    assert.match(source, new RegExp(`\\b${key}\\b`), `filtro ausente: ${key}`);
  }

  for (const order of [
    "menor-preco", "maior-preco", "menor-km", "maior-km",
    "mais-novo", "mais-antigo",
  ]) {
    assert.match(source, new RegExp(order), `ordenação ausente: ${order}`);
  }

  assert.match(source, /obterFiltros/);
  assert.match(source, /correspondeFaixaPreco/);
  assert.match(source, /correspondeFaixaKm/);
  assert.match(source, /correspondeCilindrada/);
});

test("estoque mantém favoritos, interesse por veículo e continuidade via WhatsApp", async () => {
  const source = await read("src/routes/estoque.tsx");

  assert.match(source, /useFavoritos/);
  assert.match(source, /aria-pressed=\{favorito\}/);
  assert.match(source, /criarWhatsAppUrl/);
  assert.match(source, /mensagemInteressePorTipo/);
  assert.match(source, /Comprar/);
  assert.match(source, /Trocar/);
});

test("estoque mantém estados vazios, busca e paginação visual do catálogo", async () => {
  const source = await read("src/routes/estoque.tsx");

  assert.match(source, /Search/);
  assert.match(source, /SlidersHorizontal/);
  assert.match(source, /VISIVEIS_INICIAL/);
  assert.match(source, /Mais filtros/);
  assert.match(source, /FILTROS_VAZIOS/);
  assert.match(source, /Não encontramos veículos com esses critérios/);
  assert.match(source, /Limpar filtros/);
});
