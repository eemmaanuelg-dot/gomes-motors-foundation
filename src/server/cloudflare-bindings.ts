import { env } from "cloudflare:workers";
import type { AppBindings } from "@/infrastructure/cloudflare/bindings";

/**
 * Resolve as bindings no runtime do Worker.
 *
 * Durante a transição, D1/R2 podem ainda não estar vinculados ao ambiente.
 * Por isso a camada retorna bindings parciais e a composição decide se deve
 * usar Cloudflare ou o fallback estático.
 */
export function getCloudflareBindings(): Partial<AppBindings> {
  return env as unknown as Partial<AppBindings>;
}
