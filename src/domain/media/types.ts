import type { Id, IsoDateTime } from "../shared/types";

export type VehicleMediaType = "image" | "document";

export type VehicleMedia = {
  id: Id;
  vehicleId: Id;
  objectKey: string;
  mediaType: VehicleMediaType;
  mimeType: string;
  displayOrder: number;
  altText?: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};
