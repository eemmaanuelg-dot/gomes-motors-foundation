import type { D1DatabaseLike } from "./d1-types";

/**
 * Version of the controlled demo catalog.
 *
 * D1 is the runtime source of truth. This one-time synchronizer exists only
 * for the six demo vehicles that were seeded during the migration phase. A
 * version bump intentionally applies code-owned corrections once; subsequent
 * administrative edits remain persistent in D1 until another explicit version
 * is published.
 */
const DEMO_CATALOG_VERSION = "20260905-2";

const DEMO_VEHICLE_IDS = [
  "civic-exl",
  "corolla-gli",
  "polo",
  "onix",
  "cb500f",
  "mt03",
] as const;

let syncPromise: Promise<void> | undefined;

function legacyGalleryReferences(id: string): string[] {
  return [
    `legacy://vehicles/${id}/primary`,
    `legacy://vehicles/${id}/image-2`,
    `legacy://vehicles/${id}/image-3`,
  ];
}

async function syncDemoCatalog(db: D1DatabaseLike): Promise<void> {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS app_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
    )
    .run();

  const current = await db
    .prepare(`SELECT value FROM app_metadata WHERE key = 'demo_catalog_version' LIMIT 1`)
    .first<{ value: string }>();

  if (current?.value === DEMO_CATALOG_VERSION) return;

  const now = new Date().toISOString();
  const statements = DEMO_VEHICLE_IDS.map((id) => {
    const gallery = legacyGalleryReferences(id);
    return db
      .prepare(
        `UPDATE vehicles
         SET financing_json = json_set(financing_json, '$.entradaMinima', 1000),
             image_url = ?,
             images_json = ?,
             updated_at = ?
         WHERE id = ?`,
      )
      .bind(gallery[0], JSON.stringify(gallery), now, id);
  });

  // The original Onix seed had a stale transmission value. The verified
  // listing used for the current demo catalog is automatic.
  statements.push(
    db
      .prepare(
        `UPDATE vehicles
         SET transmission = 'Automático', updated_at = ?
         WHERE id = 'onix'`,
      )
      .bind(now),
  );

  statements.push(
    db
      .prepare(
        `INSERT INTO app_metadata (key, value, updated_at)
         VALUES ('demo_catalog_version', ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      )
      .bind(DEMO_CATALOG_VERSION, now),
  );

  await db.batch(statements);
}

/**
 * Runs once per Worker isolate and is guarded by a persisted D1 version.
 */
export function ensureDemoCatalogSynchronized(db: D1DatabaseLike): Promise<void> {
  if (!syncPromise) {
    syncPromise = syncDemoCatalog(db).catch((error) => {
      syncPromise = undefined;
      throw error;
    });
  }

  return syncPromise;
}
