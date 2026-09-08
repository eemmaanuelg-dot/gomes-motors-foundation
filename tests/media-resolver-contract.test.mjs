import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("resolver de mídia mantém R2 como fonte definitiva e legado apenas como compatibilidade", async () => {
  const source = await read("src/infrastructure/repositories/d1/media-resolver.ts");

  assert.match(source, /if \(normalized\.startsWith\("r2:\/\/"\)\)/);
  assert.match(source, /return resolveR2Reference\(normalized\);/);
  assert.match(source, /if \(normalized\.startsWith\("legacy:\/\/"\)\)/);
  assert.match(source, /const LEGACY_IMAGES: Record<string, string\[\]> =/);

  const r2Branch = source.indexOf('normalized.startsWith("r2://")');
  const legacyBranch = source.indexOf('normalized.startsWith("legacy://")');
  assert.ok(r2Branch >= 0 && legacyBranch > r2Branch, "R2 deve ser avaliado antes do fallback legado");
});

test("resolver rejeita referências R2 fora do namespace de veículos e traversal", async () => {
  const source = await read("src/infrastructure/repositories/d1/media-resolver.ts");

  assert.match(source, /objectKey\.startsWith\(R2_MEDIA_PREFIX\)/);
  assert.match(source, /objectKey\.includes\("\.\."\)/);
  assert.match(source, /if \(!objectKey \|\| !objectKey\.startsWith\(R2_MEDIA_PREFIX\) \|\| objectKey\.includes\("\.\."\)\) return "";/);
});
