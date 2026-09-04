import { defineConfig } from "nitro";

export default defineConfig({
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
});
