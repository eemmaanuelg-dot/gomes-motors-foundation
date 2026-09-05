import type { AuditLog } from "./types";

export interface AuditLogRepository {
  registrar(log: AuditLog): Promise<void>;
  listarRecentes(limite?: number): Promise<AuditLog[]>;
}
