-- Fase 37 — avaliações públicas com moderação administrativa.
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  vehicle_id TEXT,
  source TEXT NOT NULL DEFAULT 'site',
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_status_created
  ON reviews(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_vehicle_status
  ON reviews(vehicle_id, status);
