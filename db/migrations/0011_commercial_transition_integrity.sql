PRAGMA foreign_keys = ON;

-- Protect the invariant that an active reservation can only be created for a
-- vehicle that is available at the moment of insertion. The API performs the
-- same validation, but this database guard also protects direct writes and
-- closes the stale-read window before the transactional status update.
CREATE TRIGGER IF NOT EXISTS trg_reservation_vehicle_available
BEFORE INSERT ON reservations
WHEN NOT EXISTS (
  SELECT 1
  FROM vehicles
  WHERE id = NEW.vehicle_id
    AND status = 'disponivel'
)
BEGIN
  SELECT RAISE(ABORT, 'Veículo não está disponível para nova reserva.');
END;

-- A sale is only valid while the vehicle is available and has no active
-- reservation. The API validates this before the batch; the trigger makes the
-- invariant authoritative at the database boundary as well.
CREATE TRIGGER IF NOT EXISTS trg_sale_vehicle_available
BEFORE INSERT ON sales
WHEN EXISTS (
  SELECT 1
  FROM vehicles
  WHERE id = NEW.vehicle_id
    AND status <> 'disponivel'
)
OR NOT EXISTS (
  SELECT 1
  FROM vehicles
  WHERE id = NEW.vehicle_id
)
OR EXISTS (
  SELECT 1
  FROM reservations
  WHERE vehicle_id = NEW.vehicle_id
    AND status = 'ativa'
)
BEGIN
  SELECT RAISE(ABORT, 'Veículo não está disponível para nova venda.');
END;
