PRAGMA foreign_keys = ON;

-- Correções de dados identificadas na auditoria final do catálogo.
-- Não alteramos migrations históricas: esta migration normaliza o D1 existente.

UPDATE vehicles
SET transmission = 'Automático',
    seo_description = 'Chevrolet Onix LTZ 2022 usado em Campos dos Goytacazes, RJ, com câmbio automático e 38 mil km.',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'onix';

-- A entrada mínima pública é uma regra demonstrativa comum ao catálogo.
UPDATE vehicles
SET financing_json = json_set(financing_json, '$.entradaMinima', 1000),
    updated_at = CURRENT_TIMESTAMP
WHERE id IN ('civic-exl', 'corolla-gli', 'polo', 'onix', 'cb500f', 'mt03');
