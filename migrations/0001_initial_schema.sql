PRAGMA foreign_keys = ON;

CREATE TABLE vehicles (
  id TEXT PRIMARY KEY NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('carros', 'motos')),
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  versao TEXT,
  ano INTEGER NOT NULL,
  km INTEGER NOT NULL,
  preco REAL NOT NULL,
  cambio TEXT,
  combustivel TEXT,
  cilindrada TEXT,
  tipo TEXT,
  imagem TEXT NOT NULL,
  imagens_json TEXT NOT NULL DEFAULT '[]',
  descricao TEXT NOT NULL,
  equipamentos_json TEXT NOT NULL DEFAULT '[]',
  ficha_tecnica_json TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('disponivel', 'reservado', 'vendido')),
  destaque INTEGER NOT NULL DEFAULT 0 CHECK (destaque IN (0, 1)),
  financiamento_json TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  criado_em TEXT NOT NULL,
  atualizado_em TEXT NOT NULL
);

CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_categoria ON vehicles(categoria);
CREATE INDEX idx_vehicles_destaque ON vehicles(destaque);

CREATE TABLE inventory_entries (
  vehicle_id TEXT PRIMARY KEY NOT NULL,
  publicado INTEGER NOT NULL DEFAULT 0 CHECK (publicado IN (0, 1)),
  ordem INTEGER NOT NULL,
  entrada_em TEXT,
  saida_em TEXT,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE INDEX idx_inventory_publicado_ordem
  ON inventory_entries(publicado, ordem);

CREATE TABLE vehicle_status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id TEXT NOT NULL,
  de_status TEXT NOT NULL CHECK (de_status IN ('disponivel', 'reservado', 'vendido')),
  para_status TEXT NOT NULL CHECK (para_status IN ('disponivel', 'reservado', 'vendido')),
  ocorrido_em TEXT NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE INDEX idx_vehicle_status_history_vehicle
  ON vehicle_status_history(vehicle_id, ocorrido_em);

CREATE TABLE media_assets (
  id TEXT PRIMARY KEY NOT NULL,
  vehicle_id TEXT NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('principal', 'galeria')),
  ordem INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  criado_em TEXT NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE INDEX idx_media_assets_vehicle
  ON media_assets(vehicle_id, ordem);
