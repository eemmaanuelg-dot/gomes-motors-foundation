import type { ObjectBody, ObjectStorage, StoredObject } from "./object-storage";

/**
 * Interface estrutural mínima do binding R2 usado pelo adapter.
 * Mantém a aplicação desacoplada dos tipos específicos do runtime Cloudflare.
 */
export interface R2BucketLike {
  put(
    key: string,
    value: ObjectBody,
    options?: { httpMetadata?: Record<string, string> }
  ): Promise<unknown>;
  get(key: string): Promise<
    | {
        body: ReadableStream<Uint8Array> | null;
        key: string;
        size: number;
        httpMetadata?: Record<string, string>;
      }
    | null
  >;
  delete(keys: string | string[]): Promise<void>;
  head(key: string): Promise<unknown | null>;
}

/**
 * Adapter de infraestrutura para o R2.
 * Nenhuma regra de negócio deve depender diretamente do binding MEDIA.
 */
export class R2ObjectStorage implements ObjectStorage {
  constructor(private readonly bucket: R2BucketLike) {}

  async put(
    key: string,
    body: ObjectBody,
    options?: { httpMetadata?: Record<string, string> }
  ): Promise<void> {
    await this.bucket.put(key, body, options);
  }

  async get(key: string): Promise<StoredObject | null> {
    const object = await this.bucket.get(key);

    if (!object) {
      return null;
    }

    const storedObject: StoredObject = {
      body: object.body,
      key: object.key,
      size: object.size,
    };

    if (object.httpMetadata) {
      storedObject.httpMetadata = object.httpMetadata;
    }

    return storedObject;
  }

  async delete(key: string): Promise<void> {
    await this.bucket.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.bucket.head(key)) !== null;
  }
}
