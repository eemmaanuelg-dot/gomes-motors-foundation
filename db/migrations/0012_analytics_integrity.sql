PRAGMA foreign_keys = ON;

-- Analytics is intentionally append-only, but repeated client retries should
-- not multiply the same event in a short window. The supporting index keeps the
-- server-side duplicate check bounded as the event table grows.
CREATE INDEX IF NOT EXISTS idx_analytics_dedupe
  ON analytics_events(session_id, event_name, vehicle_id, lead_id, occurred_at);
