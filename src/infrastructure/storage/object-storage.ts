export type ObjectBody = ReadableStream<Uint8Array> | ArrayBuffer | ArrayBufferView | string;

export type StoredObject = {
  body: ReadableStream<Uint8Array> | null;
  key: string;
  size: number;
  httpMetadata?: Record<string, string>;
};

export interface ObjectStorage {
  put(
    key: string,
    body: ObjectBody,
    options?: { httpMetadata?: Record<string, string> }
  ): Promise<void>;
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}
