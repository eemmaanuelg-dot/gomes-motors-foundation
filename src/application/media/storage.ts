export type StoredVehicleImage = {
  key: string;
  contentType: string;
  size: number;
};

export interface VehicleImageStorage {
  put(
    key: string,
    body: ArrayBuffer | ArrayBufferView | ReadableStream | string,
    options?: {
      contentType?: string;
      altText?: string;
    },
  ): Promise<StoredVehicleImage>;

  get(key: string): Promise<ReadableStream | null>;
  remove(key: string): Promise<void>;
}
