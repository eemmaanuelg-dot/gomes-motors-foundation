PRAGMA foreign_keys = ON;

-- CRM base: a lead is the durable record created by any commercial intent.
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  source TEXT NOT NULL DEFAULT 'site',
  intent TEXT NOT NULL CHECK (intent IN ('comprar', 'trocar', 'financiar', 'vender', 'consignar', 'contato')),
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em_atendimento', 'aguardando_cliente', 'proposta_enviada', 'negociacao', 'convertido', 'perdido')),
  assigned_to TEXT,
  vehicle_id TEXT,
  message TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_leads_status_updated ON leads(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_intent_created ON leads(intent, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_vehicle ON leads(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(customer_phone);

CREATE TABLE IF NOT EXISTS lead_events (
  id TEXT PRIMARY KEY NOT NULL,
  lead_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  actor_id TEXT,
  note TEXT,
  occurred_at TEXT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lead_events_lead_occurred ON lead_events(lead_id, occurred_at DESC);

-- Vehicle appraisal requests for trade-in, sale and consignment.
CREATE TABLE IF NOT EXISTS vehicle_evaluations (
  id TEXT PRIMARY KEY NOT NULL,
  lead_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  vehicle_description TEXT NOT NULL,
  plate TEXT,
  year INTEGER,
  mileage INTEGER,
  condition TEXT,
  requested_value_cents INTEGER CHECK (requested_value_cents >= 0),
  evaluated_value_cents INTEGER CHECK (evaluated_value_cents >= 0),
  decision TEXT NOT NULL DEFAULT 'pendente' CHECK (decision IN ('pendente', 'aprovada', 'recusada', 'convertida')),
  assigned_to TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vehicle_evaluations_decision_updated ON vehicle_evaluations(decision, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_evaluations_lead ON vehicle_evaluations(lead_id);

-- Commercial negotiation is separate from the public financing simulator.
CREATE TABLE IF NOT EXISTS negotiations (
  id TEXT PRIMARY KEY NOT NULL,
  lead_id TEXT,
  vehicle_id TEXT,
  stage TEXT NOT NULL DEFAULT 'aberta' CHECK (stage IN ('aberta', 'proposta', 'contraproposta', 'fechada', 'perdida')),
  proposed_price_cents INTEGER CHECK (proposed_price_cents >= 0),
  trade_in_value_cents INTEGER CHECK (trade_in_value_cents >= 0),
  down_payment_cents INTEGER CHECK (down_payment_cents >= 0),
  final_price_cents INTEGER CHECK (final_price_cents >= 0),
  notes TEXT,
  assigned_to TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_negotiations_stage_updated ON negotiations(stage, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_negotiations_lead ON negotiations(lead_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_vehicle ON negotiations(vehicle_id);

CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY NOT NULL,
  lead_id TEXT,
  vehicle_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'liberada', 'convertida', 'expirada', 'cancelada')),
  reserved_until TEXT,
  responsible TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  released_at TEXT,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reservations_vehicle_status ON reservations(vehicle_id, status);
CREATE INDEX IF NOT EXISTS idx_reservations_status_until ON reservations(status, reserved_until);

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY NOT NULL,
  lead_id TEXT,
  vehicle_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  final_price_cents INTEGER NOT NULL CHECK (final_price_cents >= 0),
  down_payment_cents INTEGER NOT NULL DEFAULT 0 CHECK (down_payment_cents >= 0),
  trade_in_value_cents INTEGER NOT NULL DEFAULT 0 CHECK (trade_in_value_cents >= 0),
  financing_operation_id TEXT,
  source TEXT,
  responsible TEXT,
  sold_at TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON sales(sold_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_vehicle ON sales(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_sales_lead ON sales(lead_id);

CREATE TABLE IF NOT EXISTS financing_operations (
  id TEXT PRIMARY KEY NOT NULL,
  lead_id TEXT,
  vehicle_id TEXT,
  sale_id TEXT,
  customer_name TEXT NOT NULL,
  entry_cents INTEGER NOT NULL DEFAULT 0 CHECK (entry_cents >= 0),
  term_months INTEGER NOT NULL CHECK (term_months > 0),
  rate_percent REAL NOT NULL DEFAULT 0 CHECK (rate_percent >= 0),
  institution TEXT,
  estimated_installment_cents INTEGER CHECK (estimated_installment_cents >= 0),
  proposal_reference TEXT,
  status TEXT NOT NULL DEFAULT 'simulacao_interna' CHECK (status IN ('simulacao_interna', 'em_analise', 'proposta', 'aprovado', 'recusado', 'contratado', 'cancelado')),
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_financing_status_updated ON financing_operations(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_financing_lead ON financing_operations(lead_id);
CREATE INDEX IF NOT EXISTS idx_financing_vehicle ON financing_operations(vehicle_id);

CREATE TABLE IF NOT EXISTS commercial_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value_json TEXT NOT NULL,
  updated_by TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY NOT NULL,
  event_name TEXT NOT NULL,
  vehicle_id TEXT,
  lead_id TEXT,
  session_id TEXT,
  metadata_json TEXT,
  occurred_at TEXT NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name_time ON analytics_events(event_name, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_vehicle_time ON analytics_events(vehicle_id, occurred_at DESC);
