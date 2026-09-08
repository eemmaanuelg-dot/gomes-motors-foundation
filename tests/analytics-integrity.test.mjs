import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("analytics mantém whitelist, limite de payload e deduplicação por sessão", async () => {
  const source = await read("src/routes/api.analytics.ts");
  const migration = await read("db/migrations/0012_analytics_integrity.sql");

  assert.match(source, /const EVENTS = new Set/);
  assert.match(source, /exceedsBodyLimit\(request, 32 \* 1024\)/);
  assert.match(source, /DEDUPE_WINDOW_SECONDS = 5/);
  assert.match(source, /session_id = \?/);
  assert.match(source, /deduplicated: true/);
  assert.match(source, /INSERT INTO analytics_events/);
  assert.match(migration, /idx_analytics_dedupe/);
  assert.match(migration, /analytics_events\(session_id, event_name, vehicle_id, lead_id, occurred_at\)/);
});
