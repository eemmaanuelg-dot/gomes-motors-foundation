import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";

import { mediaPublicUrl, requireR2Bucket, type R2BucketLike } from "@/infrastructure/storage/r2-storage";

type RuntimeEnv = { MEDIA_BUCKET?: R2BucketLike };

const runtimeEnv = env as unknown as RuntimeEnv;

function notFound() {
  return new Response("Mídia não encontrada.", { status: 404 });
}

export const Route = createFileRoute("/media")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const key = url.searchParams.get("key")?.trim() ?? "";

        // Apenas objetos gerenciados pela aplicação podem ser servidos por esta rota.
        if (!key || !key.startsWith("vehicles/") || key.includes("..")) return notFound();

        try {
          const object = await requireR2Bucket(runtimeEnv.MEDIA_BUCKET).get(key);
          if (!object?.body) return notFound();

          const headers = new Headers();
          if (object.writeHttpMetadata) object.writeHttpMetadata(headers);
          else if (object.httpMetadata?.contentType) headers.set("Content-Type", object.httpMetadata.contentType);
          headers.set("Cache-Control", object.httpMetadata?.cacheControl ?? "public, max-age=31536000, immutable");
          if (object.httpEtag) headers.set("ETag", object.httpEtag);
          headers.set("X-Content-Type-Options", "nosniff");

          return new Response(object.body, { headers });
        } catch {
          return new Response("Armazenamento de mídia indisponível.", { status: 503 });
        }
      },
    },
  },
});

export { mediaPublicUrl };
