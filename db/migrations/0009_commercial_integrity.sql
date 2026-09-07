PRAGMA foreign_keys = ON;

-- Enforce commercial invariants at the database layer as well as in the API.
-- Partial unique indexes prevent race conditions from creating duplicate active
-- reservations or multiple sales for the same vehicle.
CREATE UNIQUE INDEX IF NOT EXISTS uq_reservations_active_vehicle
  ON reservations(vehicle_id)
  WHERE status = 'ativa';

CREATE UNIQUE INDEX IF NOT EXISTS uq_sales_vehicle
  ON sales(vehicle_id);

CREATE INDEX IF NOT EXISTS idx_financing_sale
  ON financing_operations(sale_id);
