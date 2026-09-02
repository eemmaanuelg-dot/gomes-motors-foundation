import { getCloudflareBindings } from "./cloudflare-bindings";

function contentTypeFor(key: string): string {
  const extension = key.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "avif":
      return "image/avif";
    case "webp":
      return "image/webp";
    case "png":
      return "image/png";
    case "svg":
      return "image/svg+xml";
    case "jpg":
    case "jpeg":
    default:
      return "image/jpeg";
  }
}

/**
 * Entrega somente objetos sob /media/ a partir do bucket R2 privado.
 *
 * O navegador conhece apenas a URL pública do Worker; a binding do R2 fica
 * exclusivamente no runtime server-side.
 */
export async function serveVehicleMedia(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/media/")) return null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  const key = decodeURIComponent(url.pathname.slice("/media/".length));
  if (!key || key.includes("..")) {
    return new Response("Not Found", { status: 404 });
  }

  const { VEHICLE_IMAGES } = getCloudflareBindings();
  const object = await VEHICLE_IMAGES.get(key);
  if (!object) return new Response("Not Found", { status: 404 });

  const headers = new Headers();
  headers.set("content-type", object.httpMetadata?.["content-type"] ?? contentTypeFor(key));
  headers.set("cache-control", "public, max-age=31536000, immutable");
  if (object.httpEtag) headers.set("etag", object.httpEtag);

  return new Response(request.method === "HEAD" ? null : object.body, {
    status: 200,
    headers,
  });
}
