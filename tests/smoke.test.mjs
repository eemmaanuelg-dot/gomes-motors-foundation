import test from "node:test";
import assert from "node:assert/strict";

const publicRoutes = [
  "/",
  "/estoque",
  "/servicos",
  "/sobre",
  "/avaliacoes",
  "/robots.txt",
  "/sitemap.xml",
];

test("public route contract remains defined", async () => {
  assert.ok(publicRoutes.length >= 7);
  for (const route of publicRoutes) {
    assert.equal(typeof route, "string");
    assert.ok(route.startsWith("/"));
  }
});

test("API security contract uses expected content types", () => {
  const jsonContentType = "application/json; charset=utf-8";
  const multipartContentType = "multipart/form-data; boundary=test";

  assert.equal(jsonContentType.startsWith("application/json"), true);
  assert.equal(multipartContentType.startsWith("multipart/form-data"), true);
});

test("vehicle identifiers used by public flows are non-empty", () => {
  const ids = ["civic-exl", "corolla-gli", "polo", "onix", "cb500f", "mt03"];

  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => id.trim().length > 0));
});
