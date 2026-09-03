PRAGMA foreign_keys = ON;

ALTER TABLE vehicles ADD COLUMN image_url TEXT;
ALTER TABLE vehicles ADD COLUMN images_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE vehicles ADD COLUMN equipment_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE vehicles ADD COLUMN technical_sheet_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE vehicles ADD COLUMN financing_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE vehicles ADD COLUMN seo_description TEXT NOT NULL DEFAULT '';
ALTER TABLE vehicles ADD COLUMN cylinder_capacity TEXT;
ALTER TABLE vehicles ADD COLUMN vehicle_type TEXT;

ALTER TABLE inventory_entries ADD COLUMN entry_at TEXT;
ALTER TABLE inventory_entries ADD COLUMN exit_at TEXT;

CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON vehicles(featured);
CREATE INDEX IF NOT EXISTS idx_inventory_vehicle ON inventory_entries(vehicle_id);
