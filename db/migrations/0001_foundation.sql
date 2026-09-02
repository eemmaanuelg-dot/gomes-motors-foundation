PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('carros', 'motos')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT,
  year INTEGER NOT NULL,
  model_year INTEGER,
  mileage INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
  transmission TEXT,
  fuel TEXT,
  color TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  status TEXT NOT NULL CHECK (status IN ('disponivel', 'reservado', 'vendido')),
  condition TEXT,
  description TEXT,
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand_model ON vehicles(brand, model);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price_cents);

CREATE TABLE IF NOT EXISTS inventory_entries (
  id TEXT PRIMARY KEY NOT NULL,
  vehicle_id TEXT NOT NULL UNIQUE,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_inventory_published_order ON inventory_entries(published, display_order);

CREATE TABLE IF NOT EXISTS vehicle_prices (
  id TEXT PRIMARY KEY NOT NULL,
  vehicle_id TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  effective_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vehicle_prices_vehicle_effective ON vehicle_prices(vehicle_id, effective_at DESC);

CREATE TABLE IF NOT EXISTS vehicle_status_history (
  id TEXT PRIMARY KEY NOT NULL,
  vehicle_id TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL CHECK (to_status IN ('disponivel', 'reservado', 'vendido')),
  changed_at TEXT NOT NULL,
  reason TEXT,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vehicle_status_history_vehicle_changed ON vehicle_status_history(vehicle_id, changed_at DESC);

CREATE TABLE IF NOT EXISTS vehicle_media (
  id TEXT PRIMARY KEY NOT NULL,
  vehicle_id TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  media_type TEXT NOT NULL DEFAULT 'image',
  mime_type TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vehicle_media_vehicle_order ON vehicle_media(vehicle_id, display_order);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY NOT NULL,
  actor_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  result TEXT NOT NULL CHECK (result IN ('success', 'failure')),
  occurred_at TEXT NOT NULL,
  metadata_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_occurred ON audit_logs(occurred_at DESC);
