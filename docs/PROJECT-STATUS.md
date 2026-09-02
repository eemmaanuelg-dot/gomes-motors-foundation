# Gomes Motors — Status do Projeto

Data do marco: 02/09/2026

## Marco atual

A versão pública do Gomes Motors foi **fechada como base estável**.

"Fechar" significa congelar esta versão como referência funcional e visual para a próxima fase. Não significa impedir alterações futuras. Bugs, melhorias e novas funcionalidades continuam podendo ser implementados sobre esta base, sempre preservando o que já foi aprovado.

## Fase 5 — Preparação da camada de domínio

**Implementação estrutural concluída e validação técnica executada.**

A fase foi construída antes de D1, R2, autenticação e `/admin`, preservando o site público como patrimônio estável.

### 5.1 — Contratos fundamentais
**Concluída.**

- tipos compartilhados;
- entidade e tipos de veículos;
- regras de transição de status;
- contrato de repositório de veículos;
- tipos e contrato inicial de estoque;
- contratos dos demais módulos previstos para evolução futura.

### 5.2 — Repositórios estáticos
**Concluída para veículos e estoque.**

Implementações atuais:

- `src/infrastructure/repositories/static/vehicle-repository.ts`;
- `src/infrastructure/repositories/static/inventory-repository.ts`.

Os seis veículos atuais continuam sendo a fonte estática de transição. A publicação foi separada em uma entrada de estoque, preparando a substituição futura por D1 sem alterar o contrato de domínio.

### 5.3 — Casos de uso
**Concluída para o primeiro conjunto de operações de veículos.**

Arquivo:

- `src/application/vehicles/use-cases.ts`.

Operações estruturadas:

- listar veículos públicos;
- obter veículo público por ID;
- obter veículo por ID;
- criar veículo;
- editar veículo;
- publicar/despublicar;
- destacar;
- reservar;
- vender;
- liberar reserva.

As transições passam pelas regras centrais do domínio, e publicação permanece separada do cadastro do veículo.

### 5.4 — Integração gradual com o site público
**Concluída na camada de leitura pública de veículos.**

Foi criado e adotado:

- `src/application/vehicles/public-catalog.ts`.

As rotas públicas que exibem veículos passaram a carregar seus dados por loaders do TanStack Router e consumir o catálogo público:

- `/`;
- `/estoque`;
- `/estoque/:id`.

A UI existente foi preservada. Busca, filtros, favoritos, ordenação, detalhes, relacionados e ações de WhatsApp continuam na apresentação, enquanto a origem dos dados passou para a fronteira de aplicação.

### 5.5 — Validação arquitetural
**Concluída tecnicamente.**

A revisão confirmou a separação:

```text
apresentação
    ↓
route loaders
    ↓
public vehicle catalog
    ↓
casos de uso
    ↓
contratos de domínio
    ↓
repositórios
    ↓
dados estáticos de transição
```

Também foram mantidos os critérios de preservação da versão pública: nenhuma reconstrução de UX, identidade ou funcionalidade foi necessária para concluir a integração.

## Fechamento técnico — 5 blocos

### Bloco 1 — Auditoria de código e arquitetura
**Concluído.**

Foram conferidos os contratos do domínio, regras de status, repositórios, casos de uso, catálogo público, fonte estática de transição e centralização do contato comercial. Não foi identificada necessidade de reconstrução do site público.

### Bloco 2 — Build oficial
**Concluído com sucesso.**

O workflow `build` do GitHub Actions executou `npm ci` e `npm run build` e terminou com `success` em 02/09/2026. O build executa `vite build` e `tsc --noEmit`.

### Bloco 3 — Deploy / publicação
**Concluído tecnicamente.**

Os checks do Cloudflare Workers terminaram com `success`, confirmando a publicação automatizada pela integração do projeto.

### Bloco 4 — Regressão funcional
**Revisão técnica concluída; validação manual pendente.**

O código e os fluxos foram conferidos após a integração, sem alteração intencional da UX aprovada. A validação real de navegação, filtros, favoritos, detalhes, links e WhatsApp no ambiente publicado depende do teste manual do usuário.

### Bloco 5 — Responsividade
**Revisão estrutural concluída; validação visual manual pendente.**

A implementação existente mantém os comportamentos responsivos definidos na base pública. A confirmação final depende da observação visual real no ambiente publicado.

## Fase 6 — Fundação operacional

### 6.1 — D1 / fundação de dados
**Tecnicamente concluída e publicada.**

- migration inicial `db/migrations/0001_foundation.sql` criada;
- binding `DB` configurado para `gomes-motors-db`;
- estrutura inicial criada para veículos, estoque, preços, histórico de status, mídia e auditoria;
- build validado pelo GitHub Actions;
- deploy validado no Cloudflare;
- D1 provisionado no ambiente Cloudflare conforme validação realizada.

### 6.2 — R2 / mídia e arquivos
**Tecnicamente concluída e validada pelo usuário.**

Base criada sem alterar a UI pública:

- binding `MEDIA` configurado para o bucket `gomes-motors-media`;
- contrato de domínio `src/domain/media/types.ts` criado;
- contrato `src/domain/media/repository.ts` criado;
- repositório de transição `src/infrastructure/repositories/static/vehicle-media-repository.ts` criado para os metadados das mídias atuais;
- abstração `src/infrastructure/storage/object-storage.ts` criada para desacoplar a aplicação do fornecedor de armazenamento;
- adapter `src/infrastructure/storage/r2-object-storage.ts` criado para o binding R2;
- tabela `vehicle_media` da fundação D1 já representa os metadados dos objetos;
- build oficial do GitHub Actions validado com sucesso após a implementação da infraestrutura R2;
- build também foi executado com sucesso após o início da 6.3.

A migração física das imagens estáticas atuais para o bucket R2 ainda não foi executada. Isso permanece deliberadamente separado para a migração controlada, evitando alterar a fonte visual do catálogo público antes da etapa apropriada.

### 6.3 — Server-side
**Tecnicamente concluída; validação manual pendente.**

Foi criada uma fronteira explícita de execução server-side para o catálogo público:

- `src/application/vehicles/server-functions.ts` criado;
- leitura pública de veículos exposta por `createServerFn` do TanStack Start;
- carregamento por ID recebe validação do payload antes da execução;
- `src/application/vehicles/public-catalog.ts` permanece como contrato estável para as rotas, mas agora delega a execução às server functions;
- repositórios e casos de uso permanecem atrás da fronteira server-side, sem serem importados diretamente pelas rotas públicas;
- proteção CSRF das server functions permanece habilitada em `src/start.ts`;
- nenhuma autenticação ou autorização foi antecipada para esta etapa;
- nenhuma alteração visual foi feita no site público.

O build oficial do GitHub Actions para o commit da 6.3 terminou com `success`, incluindo `npm ci`, `vite build` e `tsc --noEmit`.

A etapa seguinte será a migração controlada da fonte estática para as infraestruturas D1/R2, mantendo os contratos de domínio e a UI pública estável.

## Observação comercial — simulador de financiamento

Foi identificada uma melhoria importante na experiência de financiamento do detalhe do veículo.

O botão **“Quero uma proposta real”** deverá preservar o contexto da simulação feita pelo cliente e enviar ao WhatsApp, junto com o veículo:

- valor da entrada escolhido;
- prazo escolhido;
- taxa indicativa utilizada na simulação;
- parcela estimada;
- valor total estimado desembolsado no financiamento;
- aviso de que os valores são estimativos e dependem de análise de crédito e instituição financeira.

A interface também deverá apresentar explicitamente o **valor total estimado** da operação, além da parcela, para que o cliente compreenda a simulação como referência.

Essa melhoria foi registrada como requisito funcional/comercial e não será misturada à fundação R2. A implementação será feita no bloco apropriado, preservando a experiência visual aprovada.

## Estado de aceite

**A Fase 6 está em implementação. A subetapa 6.3 está tecnicamente concluída e aguarda validação manual.**

Não confundir:

```text
feito tecnicamente ≠ validado manualmente ≠ aprovado
```

Cada subetapa da Fase 6 deverá passar por implementação, validação técnica e teste manual antes da próxima subetapa.

## Próximo marco

Após validar manualmente a 6.3:

```text
6.3 server-side
      ↓
6.4 migração controlada
      ↓
6.5 validação/fechamento
      ↓
autenticação/autorização
      ↓
/admin
```

Nenhuma implementação de autenticação ou `/admin` deve ser iniciada antes desse marco.

## Regra para a evolução

O site público estável é patrimônio do projeto.

Nenhuma nova camada deve exigir a perda de funcionalidades, identidade ou UX já aprovadas. A evolução deve acontecer por extensão da arquitetura, não por reconstrução desnecessária.

## Recuperação da base funcional — 02/09/2026

A branch `main` foi restaurada para o commit funcional `91171da5514dc7675faa6007618e255f5e8ae826`, correspondente à última base funcional confirmada antes da sequência de alterações que introduziu falhas nas Server Functions. Este registro existe apenas para documentar a recuperação e disparar uma nova publicação da `main`; nenhuma alteração de código da aplicação foi realizada nesta recuperação.
