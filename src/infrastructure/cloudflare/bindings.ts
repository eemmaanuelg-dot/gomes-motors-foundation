/**
 * Contratos mínimos das bindings Cloudflare usadas pela infraestrutura.
 *
 * Mantemos estes tipos pequenos e independentes do código de apresentação.
 * Quando o projeto passar a usar `wrangler types`, os tipos gerados poderão
 * substituir estes contratos sem alterar os repositórios ou casos de uso.
 */
export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta?: Record<string, unknown>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<{ success: boolean; meta?: Record<string, unknown> }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<Array<{ success: boolean }>>;
}

export interface R2ObjectBody {
  body: ReadableStream;
  httpEtag?: string;
  httpMetadata?: Record<string, string | undefined>;
}

export interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(
    key: string,
    value: ArrayBuffer | ArrayBufferView | ReadableStream | string,
    options?: {
      httpMetadata?: Record<string, string>;
      customMetadata?: Record<string, string>;
    },
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

export type AppBindings = {
  DB: D1Database;
  VEHICLE_IMAGES: R2Bucket;
};
