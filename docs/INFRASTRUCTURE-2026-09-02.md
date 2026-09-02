# Gomes Motors — Infraestrutura D1 + R2 + Server-side

## Objetivo

Preparar a aplicação para sair da persistência estática sem alterar a interface dos contratos do domínio nem redesenhar o site público já aprovado.

## Regra arquitetural

```text
INTERFACE / ROTAS
      ↓
SERVER FUNCTIONS
      ↓
APPLICATION / USE CASES
      ↓
CONTRATOS DO DOMÍNIO
      ↓
REPOSITÓRIOS / STORAGE
      ↓
CLOUDFLARE D1 + R2
```

A infraestrutura concreta não deve subir para o domínio. O composition root escolhe a implementação concreta.

## D1

### Tabelas

- `vehicles`: cadastro completo do veículo.
- `inventory_entries`: publicação, ordem e entrada/saída do estoque.
- `vehicle_status_history`: histórico das transições de status.
- `media_assets`: relação entre veículo e objetos armazenados no R2.

### Decisões

- Campos simples ficam em colunas próprias.
- Estruturas aninhadas (`imagens`, `equipamentos`, `fichaTecnica`, `financiamento`) ficam em JSON para preservar o contrato atual sem criar dezenas de tabelas artificiais.
- Chaves estrangeiras preservam a relação entre veículo, estoque e mídia.
- Índices cobrem status, categoria, destaque, publicação/ordem e histórico/mídia.

## R2

Binding planejado: `VEHICLE_IMAGES`.

Padrão de chave previsto:

```text
vehicles/{vehicleId}/primary/{assetId}
vehicles/{vehicleId}/gallery/{assetId}
```

O banco guarda a referência (`r2_key`); o arquivo binário fica no R2. Isso evita colocar imagens grandes no D1.

## Server-side

`src/server/vehicles.ts` é a fronteira para o catálogo público. Ela:

1. recebe a chamada da aplicação;
2. resolve as bindings do Worker no servidor;
3. monta os repositórios D1 através do composition root;
4. chama os mesmos casos de uso já validados;
5. devolve somente dados serializáveis ao cliente.

A implementação não coloca D1 dentro dos componentes ou das rotas.

## Migração da fonte estática

O site público continua usando a fonte estática até que D1 e R2 sejam realmente provisionados. Isso é intencional: não foram colocados IDs fictícios no `wrangler.jsonc`.

Depois do provisionamento:

1. gerar tipos reais com `wrangler types`;
2. aplicar `migrations/0001_initial_schema.sql`;
3. importar os seis veículos atuais para D1;
4. enviar as imagens atuais para R2;
5. criar os registros em `media_assets`;
6. validar D1/R2 no ambiente remoto;
7. trocar a composição pública de estática para Cloudflare;
8. executar build e regressão completa;
9. somente então avançar para autenticação e autorização.

## Não fazer nesta etapa

- Não criar `/admin` ainda.
- Não criar login ainda.
- Não mover lógica de negócio para componentes.
- Não apagar os dados estáticos atuais antes da migração ser validada.
- Não alterar identidade visual ou páginas públicas já aprovadas.
