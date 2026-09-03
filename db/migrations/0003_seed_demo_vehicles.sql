PRAGMA foreign_keys = ON;

-- Seed controlado dos seis veículos usados como referência durante a transição.
-- As imagens usam chaves legacy temporárias: o conteúdo binário será migrado
-- para armazenamento de mídia persistente quando o R2 estiver disponível.

INSERT OR IGNORE INTO vehicles (
  id, category, brand, model, version, year, model_year, mileage, transmission,
  fuel, color, price_cents, status, condition, description, featured,
  image_url, images_json, equipment_json, technical_sheet_json, financing_json,
  seo_description, cylinder_capacity, vehicle_type, created_at, updated_at
) VALUES
(
  'civic-exl', 'carros', 'Honda', 'Civic', 'EXL', 2020, 2020, 65000,
  'Automático CVT', 'Flex', NULL, 10990000, 'disponivel', 'usado',
  'Honda Civic EXL com perfil executivo, ótimo nível de conforto e conjunto mecânico equilibrado. Uma opção para quem procura um sedã confiável, bem equipado e pronto para uso.',
  1,
  'legacy://vehicles/civic-exl/primary',
  '["legacy://vehicles/civic-exl/primary"]',
  '["Ar-condicionado digital","Central multimídia","Câmera de ré","Controle de cruzeiro","Bancos em couro","Direção elétrica","Rodas de liga leve","Controles de estabilidade e tração"]',
  '{"motor":"2.0 Flex, 4 cilindros","potencia":"155 cv","torque":"19,5 kgfm","desempenho":"0–100 km/h em aproximadamente 10,9 s","consumo":"Até 12,5 km/l em estrada","portas":"4 portas","tracao":"Dianteira"}',
  '{"entradaMinima":32970,"parcelas":[24,36,48,60],"taxaIndicativa":1.69}',
  'Honda Civic EXL 2020 usado em Campos dos Goytacazes, RJ, com câmbio automático CVT e 65 mil km.',
  NULL, 'Sedã', '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'
),
(
  'corolla-gli', 'carros', 'Toyota', 'Corolla', 'GLi', 2021, 2021, 58000,
  'Automático CVT', 'Flex', NULL, 11990000, 'disponivel', 'usado',
  'Toyota Corolla GLi com combinação de conforto, confiabilidade e bom espaço interno. Ideal para uso diário, viagens e para quem valoriza um sedã de manutenção previsível.',
  1,
  'legacy://vehicles/corolla-gli/primary',
  '["legacy://vehicles/corolla-gli/primary"]',
  '["Ar-condicionado","Central multimídia","Câmera de ré","Controle de cruzeiro","Volante multifuncional","Direção elétrica","Rodas de liga leve","Controles de estabilidade e tração"]',
  '{"motor":"2.0 Flex, 4 cilindros","potencia":"177 cv","torque":"21,4 kgfm","desempenho":"0–100 km/h em aproximadamente 9,2 s","consumo":"Até 13,2 km/l em estrada","portas":"4 portas","tracao":"Dianteira"}',
  '{"entradaMinima":35970,"parcelas":[24,36,48,60],"taxaIndicativa":1.69}',
  'Toyota Corolla GLi 2021 usado em Campos dos Goytacazes, RJ, com câmbio automático CVT e 58 mil km.',
  NULL, 'Sedã', '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'
),
(
  'polo', 'carros', 'Volkswagen', 'Polo', 'Highline TSI', 2023, 2023, 42000,
  'Automático', 'Flex', NULL, 7990000, 'disponivel', 'usado',
  'Volkswagen Polo Highline TSI com proposta esportiva, bom desempenho e tecnologia para o uso urbano. Uma alternativa moderna para quem quer um hatch completo e eficiente.',
  1,
  'legacy://vehicles/polo/primary',
  '["legacy://vehicles/polo/primary"]',
  '["Motor TSI","Central multimídia","Ar-condicionado digital","Câmera de ré","Piloto automático","Volante multifuncional","Rodas de liga leve","Controles de estabilidade e tração"]',
  '{"motor":"1.0 TSI Turbo, 3 cilindros","potencia":"128 cv","torque":"20,4 kgfm","desempenho":"0–100 km/h em aproximadamente 9,6 s","consumo":"Até 14,5 km/l em estrada","portas":"4 portas","tracao":"Dianteira"}',
  '{"entradaMinima":23970,"parcelas":[24,36,48,60],"taxaIndicativa":1.79}',
  'Volkswagen Polo Highline TSI 2023 usado em Campos dos Goytacazes, RJ, com câmbio automático e 42 mil km.',
  NULL, 'Hatch', '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'
),
(
  'onix', 'carros', 'Chevrolet', 'Onix', 'LTZ', 2022, 2022, 38000,
  'Manual', 'Flex', NULL, 7290000, 'disponivel', 'usado',
  'Chevrolet Onix LTZ com baixa quilometragem para o ano, bom pacote de equipamentos e proposta prática para cidade e estrada.',
  0,
  'legacy://vehicles/onix/primary',
  '["legacy://vehicles/onix/primary"]',
  '["Central multimídia","Ar-condicionado","Câmera de ré","Chave presencial","Volante multifuncional","Direção elétrica","Rodas de liga leve","Controles de estabilidade e tração"]',
  '{"motor":"1.0 Turbo Flex, 3 cilindros","potencia":"116 cv","torque":"16,8 kgfm","desempenho":"0–100 km/h em aproximadamente 10,1 s","consumo":"Até 16,0 km/l em estrada","portas":"4 portas","tracao":"Dianteira"}',
  '{"entradaMinima":21870,"parcelas":[24,36,48,60],"taxaIndicativa":1.79}',
  'Chevrolet Onix LTZ 2022 usado em Campos dos Goytacazes, RJ, com câmbio manual e 38 mil km.',
  NULL, 'Hatch', '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'
),
(
  'cb500f', 'motos', 'Honda', 'CB 500F', NULL, 2022, 2022, 21000,
  'Manual, 6 marchas', 'Gasolina', NULL, 3490000, 'disponivel', 'usado',
  'Honda CB 500F para quem busca uma naked equilibrada, com desempenho suficiente para estrada e facilidade para o uso urbano.',
  1,
  'legacy://vehicles/cb500f/primary',
  '["legacy://vehicles/cb500f/primary"]',
  '["Painel digital","Freios ABS","Iluminação em LED","Embreagem assistida e deslizante","Suspensão dianteira telescópica","Rodas de liga leve"]',
  '{"motor":"471 cc, bicilíndrico, 4 tempos","potencia":"50,2 cv","torque":"4,54 kgfm","desempenho":"Velocidade máxima aproximada de 180 km/h","consumo":"Até 27 km/l em uso misto","tracao":"Corrente"}',
  '{"entradaMinima":10470,"parcelas":[24,36,48],"taxaIndicativa":1.89}',
  'Honda CB 500F 2022 usada em Campos dos Goytacazes, RJ, com 21 mil km e 500 cc.',
  '500 cc', 'Naked', '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'
),
(
  'mt03', 'motos', 'Yamaha', 'MT-03', NULL, 2023, 2023, 17000,
  'Manual, 6 marchas', 'Gasolina', NULL, 3190000, 'disponivel', 'usado',
  'Yamaha MT-03 com visual marcante, baixa quilometragem e conjunto ágil. Uma naked versátil para deslocamentos urbanos e passeios de fim de semana.',
  0,
  'legacy://vehicles/mt03/primary',
  '["legacy://vehicles/mt03/primary"]',
  '["Painel digital","Freios ABS","Iluminação em LED","Suspensão dianteira invertida","Rodas de liga leve","Embreagem assistida"]',
  '{"motor":"321 cc, bicilíndrico, 4 tempos","potencia":"42 cv","torque":"3,0 kgfm","desempenho":"Velocidade máxima aproximada de 170 km/h","consumo":"Até 28 km/l em uso misto","tracao":"Corrente"}',
  '{"entradaMinima":9570,"parcelas":[24,36,48],"taxaIndicativa":1.89}',
  'Yamaha MT-03 2023 usada em Campos dos Goytacazes, RJ, com 17 mil km e 321 cc.',
  '321 cc', 'Naked', '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'
);

INSERT OR IGNORE INTO inventory_entries (
  id, vehicle_id, published, display_order, entry_at, exit_at, created_at, updated_at
) VALUES
  ('inventory-civic-exl', 'civic-exl', 1, 1, '2026-09-03T00:00:00.000Z', NULL, '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'),
  ('inventory-corolla-gli', 'corolla-gli', 1, 2, '2026-09-03T00:00:00.000Z', NULL, '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'),
  ('inventory-polo', 'polo', 1, 3, '2026-09-03T00:00:00.000Z', NULL, '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'),
  ('inventory-onix', 'onix', 1, 4, '2026-09-03T00:00:00.000Z', NULL, '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'),
  ('inventory-cb500f', 'cb500f', 1, 5, '2026-09-03T00:00:00.000Z', NULL, '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z'),
  ('inventory-mt03', 'mt03', 1, 6, '2026-09-03T00:00:00.000Z', NULL, '2026-09-03T00:00:00.000Z', '2026-09-03T00:00:00.000Z');

INSERT OR IGNORE INTO vehicle_prices (id, vehicle_id, price_cents, effective_at, created_at)
SELECT
  'price-' || id,
  id,
  price_cents,
  created_at,
  created_at
FROM vehicles
WHERE id IN ('civic-exl', 'corolla-gli', 'polo', 'onix', 'cb500f', 'mt03');

INSERT OR IGNORE INTO vehicle_status_history (id, vehicle_id, from_status, to_status, changed_at, reason)
VALUES
  ('status-civic-exl-20260903', 'civic-exl', NULL, 'disponivel', '2026-09-03T00:00:00.000Z', 'Seed inicial da migração controlada'),
  ('status-corolla-gli-20260903', 'corolla-gli', NULL, 'disponivel', '2026-09-03T00:00:00.000Z', 'Seed inicial da migração controlada'),
  ('status-polo-20260903', 'polo', NULL, 'disponivel', '2026-09-03T00:00:00.000Z', 'Seed inicial da migração controlada'),
  ('status-onix-20260903', 'onix', NULL, 'disponivel', '2026-09-03T00:00:00.000Z', 'Seed inicial da migração controlada'),
  ('status-cb500f-20260903', 'cb500f', NULL, 'disponivel', '2026-09-03T00:00:00.000Z', 'Seed inicial da migração controlada'),
  ('status-mt03-20260903', 'mt03', NULL, 'disponivel', '2026-09-03T00:00:00.000Z', 'Seed inicial da migração controlada');
