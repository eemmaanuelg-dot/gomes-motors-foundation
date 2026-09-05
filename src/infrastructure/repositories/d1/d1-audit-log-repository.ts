import type { AuditLogRepository } from "@/domain/audit/repository";
import type { AuditEntityType, AuditLog, AuditResult } from "@/domain/audit/types";
import type { D1DatabaseLike } from "./d1-types";

function serializeMetadata(metadata?: Record<string, unknown>): string | null {
  return metadata ? JSON.stringify(metadata) : null;
}

function parseMetadata(value: string | null): Record<string, unknown> | undefined {
  if (!value) return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

function mapRow(row: Record<string, unknown>): AuditLog {
  const log: AuditLog = {
    id: String(row["id"]),
    action: String(row["action"]),
    entityType: String(row["entity_type"]) as AuditEntityType,
    result: String(row["result"]) as AuditResult,
    occurredAt: String(row["occurred_at"]),
  };

  const actorId = row["actor_id"];
  if (actorId != null) {
    log.actorId = String(actorId);
  }

  const entityId = row["entity_id"];
  if (entityId != null) {
    log.entityId = String(entityId);
  }

  const metadata = parseMetadata(
    row["metadata_json"] == null ? null : String(row["metadata_json"]),
  );
  if (metadata !== undefined) {
    log.metadata = metadata;
  }

  return log;
}

export function createD1AuditLogRepository(db: D1DatabaseLike): AuditLogRepository {
  return {
    async registrar(log) {
      await db
        .prepare(
          `INSERT INTO audit_logs
            (id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          log.id,
          log.actorId ?? null,
          log.action,
          log.entityType,
          log.entityId ?? null,
          log.result,
          log.occurredAt,
          serializeMetadata(log.metadata),
        )
        .run();
    },

    async listarRecentes(limite = 50) {
      const seguro = Math.min(Math.max(Math.trunc(limite), 1), 200);
      const result = await db
        .prepare(
          `SELECT id, actor_id, action, entity_type, entity_id, result, occurred_at, metadata_json
           FROM audit_logs
           ORDER BY occurred_at DESC
           LIMIT ?`,
        )
        .bind(seguro)
        .all<Record<string, unknown>>();

      return result.results.map(mapRow);
    },
  };
}
