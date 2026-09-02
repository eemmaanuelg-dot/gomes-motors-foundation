INSERT INTO vehicles (
  id, categoria, marca, modelo, versao, ano, km, preco, cambio, combustivel,
  cilindrada, tipo, imagem, imagens_json, descricao, equipamentos_json,
  ficha_tecnica_json, status, destaque, financiamento_json, seo_description,
  criado_em, atualizado_em
) VALUES
(
  'civic-exl', 'carros', 'Honda', 'Civic', 'EXL', 2020, 65000, 109900,
  'Automático CVT', 'Flex', NULL, 'Sedã', '/media/vehicles/civic-exl/0.jpg',
  '["/media/vehicles/civic-exl/0.jpg"]',
  'Honda Civic EXL com perfil executivo, ótimo nível de conforto e conjunto mecânico equilibrado. Uma opção para quem procura um sedã confiável, bem equipado e pronto para uso.',
  '["Ar-condicionado digital","Central multimídia","Câmera de ré","Controle de cruzeiro","Bancos em couro","Direção elétrica","Rodas de liga leve","Controles de estabilidade e tração"]',
  '{"motor":"2.0 Flex, 4 cilindros","potencia":"155 cv","torque":"19,5 kgfm","desempenho":"0–100 km/h em aproximadamente 10,9 s","consumo":"Até 12,5 km/l em estrada","portas":"4 portas","tracao":"Dianteira"}',
  'disponivel', 1, '{"entradaMinima":32970,"parcelas":[24,36,48,60],"taxaIndicativa":1.69}',
  'Honda Civic EXL 2020 usado em Campos dos Goytacazes, RJ, com câmbio automático CVT e 65 mil km.',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  'corolla-gli', 'carros', 'Toyota', 'Corolla', 'GLi', 2021, 58000, 119900,
  'Automático CVT', 'Flex', NULL, 'Sedã', '/media/vehicles/corolla-gli/0.jpg',
  '["/media/vehicles/corolla-gli/0.jpg"]',
  'Toyota Corolla GLi com combinação de conforto, confiabilidade e bom espaço interno. Ideal para uso diário, viagens e para quem valoriza um sedã de manutenção previsível.',
  '["Ar-condicionado","Central multimídia","Câmera de ré","Controle de cruzeiro","Volante multifuncional","Direção elétrica","Rodas de liga leve","Controles de estabilidade e tração"]',
  '{"motor":"2.0 Flex, 4 cilindros","potencia":"177 cv","torque":"21,4 kgfm","desempenho":"0–100 km/h em aproximadamente 9,2 s","consumo":"Até 13,2 km/l em estrada","portas":"4 portas","tracao":"Dianteira"}',
  'disponivel', 1, '{"entradaMinima":35970,"parcelas":[24,36,48,60],"taxaIndicativa":1.69}',
  'Toyota Corolla GLi 2021 usado em Campos dos Goytacazes, RJ, com câmbio automático CVT e 58 mil km.',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  'polo', 'carros', 'Volkswagen', 'Polo', 'Highline TSI', 2023, 42000, 79900,
  'Automático', 'Flex', NULL, 'Hatch', '/media/vehicles/polo/0.jpg',
  '["/media/vehicles/polo/0.jpg"]',
  'Volkswagen Polo Highline TSI com proposta esportiva, bom desempenho e tecnologia para o uso urbano. Uma alternativa moderna para quem quer um hatch completo e eficiente.',
  '["Motor TSI","Central multimídia","Ar-condicionado digital","Câmera de ré","Piloto automático","Volante multifuncional","Rodas de liga leve","Controles de estabilidade e tração"]',
  '{"motor":"1.0 TSI Turbo, 3 cilindros","potencia":"128 cv","torque":"20,4 kgfm","desempenho":"0–100 km/h em aproximadamente 9,6 s","consumo":"Até 14,5 km/l em estrada","portas":"4 portas","tracao":"Dianteira"}',
  'disponivel', 1, '{"entradaMinima":23970,"parcelas":[24,36,48,60],"taxaIndicativa":1.79}',
  'Volkswagen Polo Highline TSI 2023 usado em Campos dos Goytacazes, RJ, com câmbio automático e 42 mil km.',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  'onix', 'carros', 'Chevrolet', 'Onix', 'LTZ', 2022, 38000, 72900,
  'Manual', 'Flex', NULL, 'Hatch', '/media/vehicles/onix/0.jpg',
  '["/media/vehicles/onix/0.jpg"]',
  'Chevrolet Onix LTZ com baixa quilometragem para o ano, bom pacote de equipamentos e proposta prática para cidade e estrada.',
  '["Central multimídia","Ar-condicionado","Câmera de ré","Chave presencial","Volante multifuncional","Direção elétrica","Rodas de liga leve","Controles de estabilidade e tração"]',
  '{"motor":"1.0 Turbo Flex, 3 cilindros","potencia":"116 cv","torque":"16,8 kgfm","desempenho":"0–100 km/h em aproximadamente 10,1 s","consumo":"Até 16,0 km/l em estrada","portas":"4 portas","tracao":"Dianteira"}',
  'disponivel', 0, '{"entradaMinima":21870,"parcelas":[24,36,48,60],"taxaIndicativa":1.79}',
  'Chevrolet Onix LTZ 2022 usado em Campos dos Goytacazes, RJ, com câmbio manual e 38 mil km.',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  'cb500f', 'motos', 'Honda', 'CB 500F', NULL, 2022, 21000, 34900,
  'Manual, 6 marchas', 'Gasolina', '500 cc', 'Naked', '/media/vehicles/cb500f/0.jpg',
  '["/media/vehicles/cb500f/0.jpg"]',
  'Honda CB 500F para quem busca uma naked equilibrada, com desempenho suficiente para estrada e facilidade para o uso urbano.',
  '["Painel digital","Freios ABS","Iluminação em LED","Embreagem assistida e deslizante","Suspensão dianteira telescópica","Rodas de liga leve"]',
  '{"motor":"471 cc, bicilíndrico, 4 tempos","potencia":"50,2 cv","torque":"4,54 kgfm","desempenho":"Velocidade máxima aproximada de 180 km/h","consumo":"Até 27 km/l em uso misto","tracao":"Corrente"}',
  'disponivel', 1, '{"entradaMinima":10470,"parcelas":[24,36,48],"taxaIndicativa":1.89}',
  'Honda CB 500F 2022 usada em Campos dos Goytacazes, RJ, com 21 mil km e 500 cc.',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
  'mt03', 'motos', 'Yamaha', 'MT-03', NULL, 2023, 17000, 31900,
  'Manual, 6 marchas', 'Gasolina', '321 cc', 'Naked', '/media/vehicles/mt03/0.jpg',
  '["/media/vehicles/mt03/0.jpg"]',
  'Yamaha MT-03 com visual marcante, baixa quilometragem e conjunto ágil. Uma naked versátil para deslocamentos urbanos e passeios de fim de semana.',
  '["Painel digital","Freios ABS","Iluminação em LED","Suspensão dianteira invertida","Rodas de liga leve","Embreagem assistida"]',
  '{"motor":"321 cc, bicilíndrico, 4 tempos","potencia":"42 cv","torque":"3,0 kgfm","desempenho":"Velocidade máxima aproximada de 170 km/h","consumo":"Até 28 km/l em uso misto","tracao":"Corrente"}',
  'disponivel', 0, '{"entradaMinima":9570,"parcelas":[24,36,48],"taxaIndicativa":1.89}',
  'Yamaha MT-03 2023 usada em Campos dos Goytacazes, RJ, com 17 mil km e 321 cc.',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

INSERT INTO inventory_entries (vehicle_id, publicado, ordem, entrada_em)
VALUES
  ('civic-exl', 1, 1, CURRENT_TIMESTAMP),
  ('corolla-gli', 1, 2, CURRENT_TIMESTAMP),
  ('polo', 1, 3, CURRENT_TIMESTAMP),
  ('onix', 1, 4, CURRENT_TIMESTAMP),
  ('cb500f', 1, 5, CURRENT_TIMESTAMP),
  ('mt03', 1, 6, CURRENT_TIMESTAMP);

INSERT INTO media_assets (id, vehicle_id, r2_key, kind, ordem, alt_text, criado_em)
VALUES
  ('civic-exl-0', 'civic-exl', 'vehicles/civic-exl/0.jpg', 'principal', 0, 'Honda Civic EXL 2020', CURRENT_TIMESTAMP),
  ('corolla-gli-0', 'corolla-gli', 'vehicles/corolla-gli/0.jpg', 'principal', 0, 'Toyota Corolla GLi 2021', CURRENT_TIMESTAMP),
  ('polo-0', 'polo', 'vehicles/polo/0.jpg', 'principal', 0, 'Volkswagen Polo Highline TSI 2023', CURRENT_TIMESTAMP),
  ('onix-0', 'onix', 'vehicles/onix/0.jpg', 'principal', 0, 'Chevrolet Onix LTZ 2022', CURRENT_TIMESTAMP),
  ('cb500f-0', 'cb500f', 'vehicles/cb500f/0.jpg', 'principal', 0, 'Honda CB 500F 2022', CURRENT_TIMESTAMP),
  ('mt03-0', 'mt03', 'vehicles/mt03/0.jpg', 'principal', 0, 'Yamaha MT-03 2023', CURRENT_TIMESTAMP);
