const DEFAULT_SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-Frame-Options": "DENY",
};

export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(DEFAULT_SECURITY_HEADERS)) {
    headers.set(name, value);
  }
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
