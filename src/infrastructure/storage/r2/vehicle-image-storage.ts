import type {
  R2Bucket,
} from "@/infrastructure/cloudflare/bindings";
import type {
  StoredVehicleImage,
  VehicleImageStorage,
} from "@/application/media/storage";

export class R2VehicleImageStorage implements VehicleImageStorage {
  constructor(private readonly bucket: R2Bucket) {}

  async put(
    key: string,
    body: ArrayBuffer | ArrayBufferView | ReadableStream | string,
    options?: { contentType?: string; altText?: string },
  ): Promise<StoredVehicleImage> {
    const contentType = options?.contentType ?? "application/octet-stream";
    const customMetadata = options?.altText ? { altText: options.altText } : undefined;

    await this.bucket.put(key, body, {
      httpMetadata: { "content-type": contentType },
      ...(customMetadata ? { customMetadata } : {}),
    });

    let size = 0;
    if (body instanceof ArrayBuffer) size = body.byteLength;
    else if (ArrayBuffer.isView(body)) size = body.byteLength;

    return { key, contentType, size };
  }

  async get(key: string): Promise<ReadableStream | null> {
    const object = await this.bucket.get(key);
    return object?.body ?? null;
  }

  async remove(key: string): Promise<void> {
    await this.bucket.delete(key);
  }
}
