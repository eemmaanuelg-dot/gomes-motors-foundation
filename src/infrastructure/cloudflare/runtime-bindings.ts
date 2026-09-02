import { env } from "cloudflare:workers";
import type { AppBindings } from "@/infrastructure/cloudflare/bindings";

/**
 * Resolve as bindings disponíveis no runtime do Cloudflare Worker.
 *
 * Mantemos o retorno parcial durante a transição da infraestrutura para que
 * a composição possa decidir entre D1/R2 e o fallback estático.
 */
export function getCloudflareBindings(): Partial<AppBindings> {
  return env as unknown as Partial<AppBindings>;
}
