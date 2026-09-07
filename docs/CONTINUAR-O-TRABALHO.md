# Gomes Motors — Continuidade do Trabalho

Data de referência: 07/09/2026

## Ponto oficial de partida

Projeto: Gomes Motors
Repositório: `eemmaanuelg-dot/gomes-motors-foundation`
Branch: `main`

O projeto deve ser retomado em novas conversas a partir deste documento e do `docs/MASTER-EXECUTION-PLAN.md`, preservando decisões, arquitetura, funcionalidades aprovadas e fases já concluídas.

## Conceito: "continuar o trabalho"

Quando o usuário disser que quer **continuar o trabalho**, a conversa deve:

1. Recuperar o estado salvo do projeto antes de pedir que o usuário repita informações já registradas.
2. Identificar a última fase oficialmente concluída e validada.
3. Iniciar pela próxima fase pendente do plano oficial.
4. Não reconstruir, simplificar, substituir ou alterar funcionalidades aprovadas sem necessidade funcional ou solicitação explícita.
5. Preservar identidade visual, UX, arquitetura, dados, integrações e decisões técnicas já aceitas.
6. Trabalhar diretamente no repositório GitHub quando houver implementação solicitada.
7. Para cada fase, seguir o ciclo: **implementação → commit → Build Validation → verificação do resultado → teste manual do usuário quando aplicável → aceite → próxima fase**.
8. Uma fase não pode ser marcada como concluída apenas porque o código foi alterado; deve haver validação técnica e, quando aplicável, teste/aceite manual.
9. Se o build falhar, investigar o erro, corrigir, gerar novo commit e validar novamente antes de avançar.
10. Não iniciar a próxima fase antes do aceite da fase atual, salvo pedido explícito do usuário.

## Progresso consolidado

### Fases concluídas

- **Fase 11 — Arquitetura/domínio:** concluída e validada. Centralização das regras de domínio de veículos em `src/domain/vehicles/services.ts` e adaptação de `vehicle-utils.ts`. Commit: `91253afc90a3421d199d2235f08eac5f1afeb03`.
- **Fase 12 — Contratos de domínio/aplicação:** concluída e validada. Contrato público `PublicVehicleCatalog` formalizado e camada de aplicação adaptada. Commit: `d0bf538888333a6bf62035ce4683ca0160bcb48e1`.
- **Fase 13 — Persistência definitiva:** concluída e validada. Criada fronteira reutilizável de persistência de auditoria (`AuditLogRepository` e implementação D1), integrada à tabela `audit_logs`. Commit final: `ba83b3a819664a933db5138bb01719b1156415ba`.
- **Fase 14 — Segurança server-side:** concluída e validada. Headers de segurança, same-origin, Content-Type JSON, limite de payload e endurecimento do `/admin/api`, preservando Cloudflare Access e auditoria. Commits: `db01c2f08e260f7442dc33fdaf747006ddb5d114`, `7347da1c2ecef799061bda107c756189019a9a9c`, `04b48424fc187d328dd4b11cc4df51ef1c447f4a`.
- **Fase 15 — Dashboard operacional:** concluída e validada. Dashboard administrativo com métricas de estoque e indicadores comerciais baseados em auditoria real, sem dados fictícios. A tipagem de auditoria passou a contemplar `evaluation` e `proposal`; o `/admin/api` passou a retornar `dashboard.estoque`, `dashboard.comercial` e `dashboard.atividadesRecentes`. Commits relacionados: `d06d97e12242434e46976c3ac656ad0c84b33f60` e `87797de3e580fee295b8cb4b84387acbf69dcfde`.

## Estado atual

**Próxima etapa: Fase 16 — Estoque administrativo.**

Objetivo oficial: tela de gestão do estoque com busca, filtros, status, publicação, destaque e ações, conectada aos dados reais e protegida server-side.

A implementação administrativa existente já possui uma base funcional em `/admin`, incluindo listagem de veículos, busca, alteração de status, publicação, destaque e ações administrativas. A Fase 16 deve consolidar e validar esse módulo sem duplicar ou reconstruir o que já existe.

## Regras permanentes do projeto

- D1 é a fonte de verdade dos dados operacionais.
- R2 é a fonte de verdade dos arquivos de mídia.
- A UI pública não acessa D1/R2 diretamente.
- Operações administrativas ficam server-side e protegidas.
- Operações relevantes devem ter validação, autorização e auditoria.
- Dados comerciais reais não devem ser tratados como conteúdo de demonstração.
- O simulador público de financiamento é exclusivamente educativo; proposta real depende de análise de crédito e instituição financeira.
- Não alterar identidade visual/UX aprovada sem necessidade funcional.
- Não usar dados fictícios para mascarar ausência de funcionalidades reais.
- Fotos de veículos devem corresponder realisticamente ao mesmo veículo/modelo/versão/cor quando fizerem parte de uma galeria.
- O usuário prefere implementação direta no GitHub e validação por Build Validation antes de considerar uma fase concluída.

## Como retomar em uma nova conversa

Se o usuário disser, por exemplo, **"continuar o trabalho do Gomes Motors"**, considerar este documento como o modo de partida. O ponto atual é **Fase 16 — Estoque administrativo**, salvo se o usuário informar explicitamente que houve alteração posterior.
