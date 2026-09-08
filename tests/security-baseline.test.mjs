import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("middleware global aplica cabeçalhos de segurança e preserva a resposta", async () => {
  const source = await read("src/start.ts");

  assert.match(source, /securityMiddleware = createMiddleware\(\)\.server/);
  assert.match(source, /applySecurityHeadersToHeaders\(result\.response\.headers\)/);
  assert.match(source, /requestMiddleware: \[securityMiddleware, errorMiddleware, csrfMiddleware\]/);
});

test("server functions mantêm proteção CSRF explícita quando src/start.ts existe", async () => {
  const source = await read("src/start.ts");

  assert.match(source, /createCsrfMiddleware/);
  assert.match(source, /filter: \(ctx\) => ctx\.handlerType === "serverFn"/);
});

test("helpers de segurança mantêm políticas mínimas de resposta e payload", async () => {
  const source = await read("src/lib/server-security.ts");

  assert.match(source, /X-Content-Type-Options/);
  assert.match(source, /Referrer-Policy/);
  assert.match(source, /Permissions-Policy/);
  assert.match(source, /X-Frame-Options/);
  assert.match(source, /isSameOriginRequest/);
  assert.match(source, /hasAcceptableJsonContentType/);
  assert.match(source, /exceedsBodyLimit/);
});

test("helper de segurança aplica os quatro cabeçalhos esperados", async () => {
  const { applySecurityHeaders } = await import("../src/lib/server-security.ts");
  const response = applySecurityHeaders(new Response("ok"));

  assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(response.headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.equal(response.headers.get("Permissions-Policy"), "camera=(), microphone=(), geolocation=()");
  assert.equal(response.headers.get("X-Frame-Options"), "DENY");
});
