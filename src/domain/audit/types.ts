import type { Id, IsoDateTime } from "../shared/types";

export type AuditResult = "success" | "failure";

export type AuditEntityType =
  | "vehicle"
  | "inventory"
  | "media"
  | "lead"
  | "customer"
  | "negotiation"
  | "sale"
  | "system";

export type AuditLog = {
  id: Id;
  actorId?: Id;
  action: string;
  entityType: AuditEntityType;
  entityId?: Id;
  result: AuditResult;
  occurredAt: IsoDateTime;
  metadata?: Record<string, unknown>;
};
