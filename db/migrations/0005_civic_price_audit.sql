-- Registra a correção do preço do Honda Civic EXL no histórico de preços.
UPDATE vehicle_prices SET price_cents = 10990000 WHERE vehicle_id = 'civic-exl' AND id = (SELECT id FROM vehicle_prices WHERE vehicle_id = 'civic-exl' ORDER BY effective_at DESC, created_at DESC LIMIT 1);
