-- Restaura o preço-base original do Honda Civic EXL 2020 após teste do painel administrativo.
UPDATE vehicles SET price_cents = 10990000, updated_at = '2026-09-04T00:00:00.000Z' WHERE id = 'civic-exl';
UPDATE vehicle_prices SET price_cents = 10990000 WHERE id = (SELECT id FROM vehicle_prices WHERE vehicle_id = 'civic-exl' ORDER BY effective_at DESC, created_at DESC LIMIT 1);
