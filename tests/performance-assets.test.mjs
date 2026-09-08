import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("hero mantém a primeira imagem prioritária e as demais lazy", async () => {
  const source = await read("src/components/site/HomeHeroSlider.tsx");

  assert.match(source, /fetchPriority=\{index === 0 \? "high" : "auto"\}/);
  assert.match(source, /loading=\{index === 0 \? "eager" : "lazy"\}/);
  assert.match(source, /decoding="async"/);
  assert.match(source, /width=\{1920\}/);
  assert.match(source, /height=\{1080\}/);
});

test("root antecipa a conexão com a origem das imagens do hero", async () => {
  const source = await read("src/routes/__root.tsx");
  assert.match(source, /rel: "preconnect", href: "https:\/\/images\.pexels\.com"/);
});
