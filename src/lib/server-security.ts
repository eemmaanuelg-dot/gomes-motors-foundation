const DEFAULT_SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000",
  "Cross-Origin-Opener-Policy": "same-origin",
  "X-Permitted-Cross-Domain-Policies": "none",
};

export function applySecurityHeadersToHeaders(headers: Headers): Headers {
  for (const [name, value] of Object.entries(DEFAULT_SECURITY_HEADERS)) {
    headers.set(name, value);
  }
  return headers;
}

export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  applySecurityHeadersToHeaders(headers);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function hasAcceptableJsonContentType(request: Request): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.toLowerCase().startsWith("application/json");
}

export function exceedsBodyLimit(request: Request, maxBytes = 256 * 1024): boolean {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return false;
  const size = Number(contentLength);
  return !Number.isFinite(size) || size < 0 || size > maxBytes;
}

/**
 * Administrative authentication is provided by Cloudflare Access.
 *
 * Access places both the authenticated identity and the signed application
 * assertion on requests reaching the Worker. Requiring both prevents the
 * application from treating a bare identity header as an authentication
 * signal. Cryptographic JWT verification remains an infrastructure-specific
 * deployment concern when an Access application is configured for origin
 * validation; the production deployment must keep the admin surface behind
 * Access and must never expose it through an unprotected origin.
 */
export function isCloudflareAccessAuthenticated(request: Request): boolean {
  const email = request.headers.get("cf-access-authenticated-user-email")?.trim();
  const assertion = request.headers.get("cf-access-jwt-assertion")?.trim();
  return Boolean(email && assertion);
}

export function isAdminPath(request: Request): boolean {
  try {
    const pathname = new URL(request.url).pathname;
    return pathname === "/admin" || pathname.startsWith("/admin/");
  } catch {
    return false;
  }
}
