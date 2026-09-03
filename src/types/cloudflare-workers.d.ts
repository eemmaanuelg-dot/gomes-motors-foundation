import type { D1DatabaseLike } from "@/infrastructure/repositories/d1/d1-types";

declare module "cloudflare:workers" {
  export const env: {
    DB: D1DatabaseLike;
    VEHICLE_DATA_SOURCE?: string;
  };
}
