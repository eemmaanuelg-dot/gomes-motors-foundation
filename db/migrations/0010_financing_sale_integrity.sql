PRAGMA foreign_keys = ON;

-- Keep the optional financing link on a sale consistent at the database layer.
-- The API already validates this relationship; these triggers protect direct
-- database writes and future integrations from creating orphaned links.
CREATE UNIQUE INDEX IF NOT EXISTS uq_financing_sale_id
  ON financing_operations(sale_id)
  WHERE sale_id IS NOT NULL;

CREATE TRIGGER IF NOT EXISTS trg_sales_financing_validate
BEFORE INSERT ON sales
WHEN NEW.financing_operation_id IS NOT NULL
BEGIN
  SELECT CASE
    WHEN NOT EXISTS (
      SELECT 1
      FROM financing_operations f
      WHERE f.id = NEW.financing_operation_id
        AND ((f.lead_id = NEW.lead_id) OR (f.lead_id IS NULL AND NEW.lead_id IS NULL))
        AND ((f.vehicle_id = NEW.vehicle_id) OR (f.vehicle_id IS NULL AND NEW.vehicle_id IS NULL))
    ) THEN RAISE(ABORT, 'Operação de financiamento incompatível com a venda.')
    WHEN EXISTS (
      SELECT 1
      FROM financing_operations f
      WHERE f.id = NEW.financing_operation_id
        AND f.sale_id IS NOT NULL
    ) THEN RAISE(ABORT, 'Operação de financiamento já vinculada a uma venda.')
  END;
END;

CREATE TRIGGER IF NOT EXISTS trg_sales_financing_link
AFTER INSERT ON sales
WHEN NEW.financing_operation_id IS NOT NULL
BEGIN
  UPDATE financing_operations
  SET sale_id = NEW.id,
      updated_at = NEW.updated_at
  WHERE id = NEW.financing_operation_id;
END;
