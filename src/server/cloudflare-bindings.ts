import { env } from "cloudflare:workers";
import type { AppBindings } from "@/infrastructure/cloudflare/bindings";

/**
 * Resolve as bindings do exist only at Worker runtime.
 *
 * This function must be called from server execution, never from components
 * or browser-only modules. The cast keeps the application independent from
 * generated Wrangler types while the bindings are still being provisioned.
 */
export function getCloudflareBindings(): AppBindings {
  return env as unknown as AppBindings;
}
