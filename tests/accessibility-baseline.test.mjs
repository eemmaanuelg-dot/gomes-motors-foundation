import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("hero mantém estrutura acessível de carrossel", async () => {
  const source = await read("src/components/site/HomeHeroSlider.tsx");

  assert.match(source, /aria-label="Destaques Gomes Motors"/);
  assert.match(source, /aria-roledescription="carousel"/);
  assert.match(source, /aria-roledescription="slide"/);
  assert.match(source, /aria-current=\{index === activeIndex\}/);
  assert.match(source, /tabIndex=\{index === activeIndex \? 0 : -1\}/);
  assert.match(source, /aria-label="Destaque anterior"/);
  assert.match(source, /aria-label="Próximo destaque"/);
});

test("hero respeita preferência do usuário por movimento reduzido", async () => {
  const source = await read("src/components/site/HomeHeroSlider.tsx");

  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /if \(paused \|\| reducedMotion\) return;/);
});
