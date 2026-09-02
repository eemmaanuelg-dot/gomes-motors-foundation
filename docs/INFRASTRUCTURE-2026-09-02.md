# Gomes Motors — Infraestrutura D1 + R2 + Server-side

## Objetivo

Preparar a aplicação para persistência real sem alterar os contratos do domínio nem reconstruir o site público já aprovado.

## Arquitetura efetiva

```text
SITE PÚBLICO
      ↓
PUBLIC CATALOG
      ↓
SERVER FUNCTIONS
      ↓
APPLICATION / USE CASES
      ↓
DOMAIN CONTRACTS
      ↓
COMPOSITION ROOT
      ↓
D1 REPOSITORIES + R2 STORAGE
      ↓
CLOUDFLARE D1 + R2
```

As rotas e componentes não conhecem D1 nem R2. As Server Functions atravessam a fronteira de execução e os casos de uso continuam concentrando as regras de negócio.

## D1

### Tabelas

- `vehicles`: cadastro completo do veículo.
- `inventory_entries`: publicação, ordem e entrada/saída do estoque.
- `vehicle_status_history`: histórico das transições de status.
- `media_assets`: relação entre veículo e objeto armazenado no R2.

### Migration

- `migrations/0001_initial_schema.sql`: estrutura das tabelas, restrições, foreign keys e índices.
- `migrations/0002_seed_current_vehicles.sql`: carga inicial dos seis veículos atuais, seus registros de estoque e seus registros de mídia.

As estruturas aninhadas do contrato (`imagens`, `equipamentos`, `fichaTecnica`, `financiamento`) continuam serializadas em JSON para preservar compatibilidade com o domínio atual.

## R2

Binding: `VEHICLE_IMAGES`.

Bucket: `gomes-motors-vehicle-images`.

Padrão de chave inicial:

```text
vehicles/{vehicleId}/0.jpg
```

A URL pública da aplicação usa a fronteira `/media/vehicles/...`. O Worker busca o objeto pela binding R2 e entrega a resposta ao navegador, mantendo o bucket sem exposição direta pela aplicação.

O script `scripts/upload-vehicle-images.mjs` sincroniza as seis imagens atuais do repositório para os respectivos objetos R2.

## Server-side

`src/server/vehicles.ts` é a fronteira de dados do catálogo público.

Ela:

1. recebe a chamada via Server Function;
2. resolve as bindings Cloudflare por request;
3. monta `D1VehicleRepository` e `D1InventoryRepository` pelo composition root;
4. chama os mesmos casos de uso já validados;
5. devolve apenas dados serializáveis.

`src/server/media.ts` é a fronteira de entrega das imagens R2 em `/media/*`.

`src/server.ts` mantém o tratamento SSR existente e intercepta apenas as requisições de mídia antes de encaminhá-las ao TanStack Start.

## Composition Root

`src/infrastructure/composition.ts` possui duas composições explícitas:

- `createStaticDependencies()`: fallback/transição e testes sem Cloudflare.
- `createCloudflareDependencies(bindings)`: produção com D1.

Isso mantém os contratos do domínio independentes da implementação concreta.

## Wrangler

`wrangler.jsonc` agora declara as bindings `DB` e `VEHICLE_IMAGES`.

Os recursos estão configurados para provisionamento sem IDs específicos no repositório. Wrangler/Cloudflare pode associar os recursos ao Worker no deploy; IDs de conta não são inventados nem versionados manualmente.

## Ordem operacional

Depois de autenticar o Wrangler no ambiente que fará o deploy:

```text
1. npm run deploy
2. npm run db:migrate:remote
3. npm run r2:upload
4. npm run cf-typegen
5. novo build/deploy
6. validar /, /estoque e /estoque/:id
```

A migration deve ser aplicada antes de o catálogo público depender dos registros D1. As imagens devem ser enviadas ao R2 antes de considerar a migração visual concluída.

## Comandos disponíveis

- `npm run db:migrate:local`
- `npm run db:migrate:remote`
- `npm run r2:upload`
- `npm run cf-typegen`
- `npm run build`
- `npm run deploy`

## Próxima etapa

Somente depois de D1, R2, server-side, build e regressão estarem confirmados:

```text
persistência real validada
        ↓
autenticação
        ↓
autorização
        ↓
/admin
```

Não há login ou `/admin` nesta etapa.
