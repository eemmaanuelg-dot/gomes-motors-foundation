# Gomes Motors — Auditoria Técnica e Visão de Futuro

Data: 02/09/2026

## 1. Estado atual

A branch `main` é a fonte de verdade do projeto. O site público já possui Home, Estoque, Detalhes do veículo, Serviços, Sobre nós e Contato, com navegação responsiva, favoritos persistentes no navegador, filtros de estoque, fluxos comerciais por WhatsApp, simulação demonstrativa de financiamento e tratamento de erros SSR.

O projeto permanece propositalmente sem banco de dados, autenticação e painel administrativo. O estoque atual é estático e serve como base de demonstração e treinamento.

## 2. Arquitetura que deve ser preservada

- TanStack Start + TanStack Router + React + TypeScript.
- Roteamento baseado em arquivos em `src/routes`.
- `src/routes/__root.tsx` como shell global.
- `src/routeTree.gen.ts` como arquivo gerado; não editar manualmente como regra.
- Componentes compartilhados em `src/components/site`.
- Dados de domínio atualmente em `src/data`.
- Funções de domínio/utilitários em `src/lib`.
- Tailwind CSS v4 e identidade visual Gomes Motors centralizada em `src/styles.css`.
- Cloudflare Workers como destino de publicação.
- GitHub `main` como fonte de verdade e Cloudflare somente como publicação.

## 3. Regras de evolução

1. Não reescrever a arquitetura por estética.
2. Não remover dependências, componentes ou arquivos sem provar que são desnecessários.
3. Não misturar refatoração estrutural com funcionalidade nova sem necessidade.
4. Fazer mudanças em blocos coerentes e testar antes de publicar.
5. Cloudflare só recebe uma versão depois da revisão do bloco.
6. Toda funcionalidade nova deve nascer pensando no futuro painel/admin e na futura camada de dados.
7. O código funcional existente é patrimônio do projeto.

## 4. Pontos encontrados na auditoria

### Resolvidos nesta revisão

- O processo de build agora também executa `tsc --noEmit`, evitando que erros de TypeScript passem silenciosamente pelo build visual.
- Foi removida uma constante de WhatsApp não utilizada da página de Contato.
- O arquivo `hero-key-handover.svg` continua no repositório, mas sem referência ativa. Não foi apagado porque a regra do projeto é não remover artefatos sem conhecer sua finalidade histórica.

### Pontos que devem entrar no próximo bloco de revisão

- Padronizar a navegação para detalhes de veículo: o projeto já precisou usar navegação direta para evitar o problema de navegação observado no Cloudflare; a Home ainda possui links tipados para `/estoque/$id` e deve ser validada junto com o restante do fluxo.
- Unificar a experiência de `Tenho interesse`: a página de detalhes possui o seletor Comprar/Trocar/Financiar, enquanto a listagem de Estoque ainda usa o CTA direto. O comportamento público deve ser uniforme.
- Refatorar `servicos.tsx`, que concentra muitos formulários e regras em um único arquivo grande. A refatoração deve preservar 100% do comportamento aprovado.
- Evoluir o modelo de dados de veículos antes de transformar o estoque estático em CRUD.
- Revisar SEO técnico, canonical/OG, sitemap e dados estruturados quando a URL pública definitiva estiver definida.
- Revisar acessibilidade, estados de foco, teclado, mensagens de erro e estados de carregamento.
- Fazer uma revisão específica de imagens, tamanhos, `loading`, `decoding`, `object-fit` e estratégia futura de mídia.
- Atualizar a documentação inicial do projeto para refletir o estado real atual, pois o README original ainda descreve a primeira etapa do projeto.

## 5. Arquitetura de dados futura

O tipo `Veiculo` atual deve ser tratado como contrato de domínio inicial, não como formato definitivo de banco.

A futura entidade de veículo deverá separar pelo menos:

- identidade do veículo;
- classificação carro/moto;
- dados comerciais;
- dados técnicos;
- status de estoque;
- destaque/publicação;
- condições de financiamento;
- mídia/fotos;
- SEO;
- timestamps e auditoria;
- relacionamento com avaliações, leads e negociações.

A aplicação pública deve consumir uma camada de acesso a dados, e não depender diretamente de um array estático quando o banco entrar.

## 6. Visão de infraestrutura futura

A infraestrutura atual em Cloudflare é adequada para crescer sem trocar o framework.

Direção planejada:

- Cloudflare Workers: execução SSR/API/server functions.
- Cloudflare D1: dados relacionais do estoque, leads, usuários internos, avaliações e negociações.
- Cloudflare R2: fotos dos veículos e demais arquivos enviados pelo painel.
- Bindings do Wrangler: acesso tipado aos recursos no Worker.
- Server functions/server routes do TanStack Start: fronteira entre interface e dados privados.
- Middleware: autenticação, autorização, contexto e políticas quando o painel existir.

Nenhum desses recursos deve ser criado durante a auditoria atual. Primeiro estabilizamos a camada de domínio e os contratos.

## 7. Próximo grande produto: Painel Comercial Gomes Motors

A próxima grande evolução não deve ser apenas “mais uma página”. Deve ser a criação gradual de um sistema interno que transforme o site em uma pequena plataforma comercial.

### Módulo 1 — Estoque administrativo

Objetivo: permitir que a equipe interna cadastre, edite, publique, reserve e venda veículos sem alterar código.

Fluxo previsto:

1. Login da equipe.
2. Dashboard do estoque.
3. Novo veículo.
4. Edição de veículo.
5. Upload e ordenação de fotos.
6. Rascunho/publicado.
7. Disponível/reservado/vendido.
8. Destaque na Home.
9. Controle de preço e quilometragem.
10. Preview público.
11. Publicação.

### Módulo 2 — Leads e atendimento

Todo contato originado no site deverá poder virar um atendimento.

Origem possível:

- Interesse em comprar.
- Interesse em trocar.
- Interesse em financiar.
- Venda de veículo.
- Consignação.
- Contato geral.

Cada lead deverá guardar origem, veículo relacionado, nome, contato, cidade, observações, status e histórico.

Status iniciais previstos:

- Novo.
- Em atendimento.
- Aguardando cliente.
- Proposta enviada.
- Negociação.
- Convertido.
- Perdido.

### Módulo 3 — Avaliação de veículo

A solicitação de vender/trocar/consignar deverá gerar uma ficha interna com os dados enviados pelo cliente e espaço para avaliação comercial.

### Módulo 4 — Financiamento

A simulação pública continuará sendo educativa. No painel, a equipe poderá registrar proposta real, entrada, instituição, prazo, taxa e situação do atendimento.

### Módulo 5 — Conteúdo e vitrine

O administrador poderá decidir quais veículos aparecem em destaque, quais são publicados, quais aparecem primeiro e quais banners/conteúdos comerciais estão ativos.

## 8. Estratégia de implementação

A implementação deve seguir esta ordem:

### Fase A — Refinamento atual

- Revisão visual/UX de todas as páginas.
- Correções de navegação.
- Padronização dos CTAs.
- Refatorações seguras.
- Acessibilidade.
- SEO técnico.
- Limpeza de documentação e artefatos somente quando comprovadamente seguros.

### Fase B — Preparação de domínio

Criar uma camada de domínio para veículos, filtros, status, mídia e regras comerciais sem alterar a experiência pública.

### Fase C — Banco e mídia

Criar D1 e R2 somente quando os contratos estiverem definidos e houver necessidade real de persistência.

### Fase D — Autenticação e painel

Criar `/admin` com proteção de rotas e permissões.

### Fase E — Estoque CRUD

Migrar o estoque estático para o banco mantendo a mesma interface pública.

### Fase F — Leads/CRM

Conectar os fluxos comerciais do site ao painel interno.

### Fase G — Operação real

Adicionar métricas, histórico, auditoria, melhorias de SEO, analytics e automações comerciais.

## 9. Critério de sucesso

O projeto não deve apenas parecer uma concessionária. Ele deve evoluir para um sistema em que:

`cliente -> vitrine -> veículo -> interesse -> atendimento -> negociação -> venda`

seja uma jornada contínua e rastreável.

O usuário público continuará vendo um site simples, rápido e profissional. A complexidade ficará atrás dele, no painel e na camada de dados.

## 10. Próxima ação imediata

Antes de criar o painel, concluir o refinamento da camada pública. O próximo bloco de trabalho recomendado é a revisão visual/UX e técnica página por página, começando pela Home, depois Header/Footer, Estoque, Detalhes, Serviços, Sobre e Contato. Depois disso, iniciar a preparação da camada de domínio que permitirá trocar o array estático por persistência real sem reconstruir o projeto.
