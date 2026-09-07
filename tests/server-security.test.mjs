import assert from "node:assert/strict";
import test from "node:test";

import {
  applySecurityHeaders,
  exceedsBodyLimit,
  hasAcceptableJsonContentType,
  isSameOriginRequest,
} from "../src/lib/server-security.ts";

test("aplica headers de segurança sem remover os headers existentes", () => {
  const response = applySecurityHeaders(
    new Response("ok", { headers: { "Content-Type": "application/json" } }),
  );

  assert.equal(response.headers.get("Content-Type"), "application/json");
  assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(response.headers.get("X-Frame-Options"), "DENY");
  assert.equal(response.headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.equal(
    response.headers.get("Permissions-Policy"),
    "camera=(), microphone=(), geolocation=()",
  );
});

test("aceita requisição same-origin e rejeita origin diferente", () => {
  const sameOrigin = new Request("https://gomes.example/api/test", {
    headers: { Origin: "https://gomes.example" },
  });
  const crossOrigin = new Request("https://gomes.example/api/test", {
    headers: { Origin: "https://evil.example" },
  });

  assert.equal(isSameOriginRequest(sameOrigin), true);
  assert.equal(isSameOriginRequest(crossOrigin), false);
});

test("requisição sem Origin continua compatível com clientes server-side", () => {
  const request = new Request("https://gomes.example/api/test");
  assert.equal(isSameOriginRequest(request), true);
});

test("valida Content-Type JSON de forma case-insensitive", () => {
  assert.equal(
    hasAcceptableJsonContentType(
      new Request("https://gomes.example/api/test", {
        headers: { "Content-Type": "Application/JSON; charset=utf-8" },
      }),
    ),
    true,
  );
  assert.equal(
    hasAcceptableJsonContentType(
      new Request("https://gomes.example/api/test", {
        headers: { "Content-Type": "text/plain" },
      }),
    ),
    false,
  );
});

test("bloqueia Content-Length inválido ou acima do limite", () => {
  assert.equal(
    exceedsBodyLimit(
      new Request("https://gomes.example/api/test", {
        headers: { "Content-Length": "1024" },
      }),
      2048,
    ),
    false,
  );
  assert.equal(
    exceedsBodyLimit(
      new Request("https://gomes.example/api/test", {
        headers: { "Content-Length": "4096" },
      }),
      2048,
    ),
    true,
  );
  assert.equal(
    exceedsBodyLimit(
      new Request("https://gomes.example/api/test", {
        headers: { "Content-Length": "not-a-number" },
      }),
      2048,
    ),
    true,
  );
});
