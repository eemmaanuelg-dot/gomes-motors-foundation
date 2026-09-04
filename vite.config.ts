// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        external: ["cloudflare:workers"],
      },
    },
  },
  nitro: {
    cloudflare: {
      wrangler: {
        vars: {
          VEHICLE_DATA_SOURCE: "d1",
        },
        d1_databases: [
          {
            binding: "DB",
            database_name: "gomes-motors-db",
            migrations_dir: "db/migrations",
          },
        ],
        r2_buckets: [
          {
            binding: "MEDIA_BUCKET",
            bucket_name: "gomes-motors-media-2026",
          },
        ],
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
