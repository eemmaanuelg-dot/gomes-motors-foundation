import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("estilos globais preservam foco visível", async () => {
  const source = await read("src/styles.css");
  assert.match(source, /:where\(a, button, input, select, textarea, summary\):focus-visible/);
  assert.match(source, /outline: 2px solid var\(--color-ring\)/);
});

test("scroll respeita reduced motion", async () => {
  const source = await read("src/styles.css");
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /scroll-behavior: auto/);
});
