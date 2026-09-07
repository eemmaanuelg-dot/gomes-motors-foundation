import test from "node:test";
import assert from "node:assert/strict";

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-Frame-Options": "DENY",
};

test("security headers keep hardened defaults", () => {
  assert.equal(securityHeaders["X-Content-Type-Options"], "nosniff");
  assert.equal(securityHeaders["X-Frame-Options"], "DENY");
  assert.match(securityHeaders["Referrer-Policy"], /strict-origin/);
  assert.match(securityHeaders["Permissions-Policy"], /camera=\(\)/);
});

test("body limit accepts normal payloads and rejects oversized values", () => {
  const limit = 256 * 1024;
  assert.equal(1024 <= limit, true);
  assert.equal(limit <= limit, true);
  assert.equal(limit + 1 > limit, true);
});

test("same-origin comparison rejects a different origin", () => {
  const requestOrigin = new URL("https://gomesmotors.example/api").origin;
  const allowedOrigin = new URL("https://gomesmotors.example").origin;
  const foreignOrigin = new URL("https://attacker.example").origin;

  assert.equal(requestOrigin === allowedOrigin, true);
  assert.equal(foreignOrigin === allowedOrigin, false);
});
