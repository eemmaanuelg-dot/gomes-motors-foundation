export type R2BucketLike = {
  get(key: string): Promise<R2ObjectLike | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob | null, options?: R2PutOptionsLike): Promise<R2ObjectLike | null>;
  delete(key: string): Promise<void>;
};

export type R2ObjectLike = {
  body?: ReadableStream;
  key: string;
  size: number;
  httpEtag?: string;
  httpMetadata?: {
    contentType?: string;
    cacheControl?: string;
    contentDisposition?: string;
    contentLanguage?: string;
    contentEncoding?: string;
    contentRange?: string;
    expires?: Date;
  };
  writeHttpMetadata?(headers: Headers): void;
};

type R2PutOptionsLike = {
  httpMetadata?: {
    contentType?: string;
    cacheControl?: string;
    contentDisposition?: string;
  };
  customMetadata?: Record<string, string>;
};

export function requireR2Bucket(bucket: R2BucketLike | undefined): R2BucketLike {
  if (!bucket) {
    throw new Error("Armazenamento R2 não configurado neste Worker.");
  }
  return bucket;
}

export function mediaObjectKey(vehicleId: string, extension: string): string {
  return `vehicles/${vehicleId}/${crypto.randomUUID()}.${extension}`;
}

export function mediaPublicUrl(objectKey: string): string {
  return `/media?key=${encodeURIComponent(objectKey)}`;
}
