# Gomes Motors — Master Execution Plan

Data: 04/09/2026

## Objetivo

Este documento é a programação oficial de execução do Gomes Motors a partir do estado real da branch `main`. A lista do projeto foi mantida em 49 etapas, mas as dependências são organizadas em blocos para evitar retrabalho e acelerar a entrega.

Regra operacional: uma etapa só é considerada concluída quando houver implementação/verificação técnica, teste correspondente e aceite manual quando a etapa exigir comportamento visual ou operacional. Depois do aceite, a próxima etapa começa imediatamente.

## Estado confirmado antes do início

- Branch de referência: `main`.
- D1 está configurado como fonte de dados do catálogo público (`VEHICLE_DATA_SOURCE=d1`).
- Banco: `gomes-motors-db`.
- R2: `gomes-motors-media-2026`, binding `MEDIA_BUCKET`.
- Os seis veículos demo estão semeados em D1.
- A sincronização demo ainda mantém correções transitórias e referências `legacy://`.
- O resolver atual ainda faz o mapeamento das galerias demo para URLs externas.
- A migração física definitiva para R2 ainda não foi concluída.
- A documentação anterior confirma a fundação D1/R2 e server-side, mas registra a migração física como pendente.
- O simulador público de financiamento é exclusivamente demonstrativo. A proposta real nasce no atendimento após análise de crédito.

## Princípios de execução

1. Não reconstruir o que já está aprovado.
2. Não alterar identidade visual/UX sem necessidade funcional.
3. D1 será a fonte de verdade de dados operacionais.
4. R2 será a fonte de verdade dos arquivos de mídia.
5. A UI pública não conhecerá diretamente D1/R2.
6. Operações administrativas ficarão server-side e protegidas.
7. Toda operação relevante terá validação de entrada, autorização e auditoria.
8. Dados comerciais reais nunca serão tratados como simples conteúdo de demonstração.
9. O simulador público nunca representará aprovação ou proposta de crédito.
10. Correções de uma etapa devem reduzir, e não aumentar, a dívida técnica da próxima.

---

# BLOCO A — FECHAMENTO DA BASE PÚBLICA

## 01 — Auditoria final do catálogo

Verificar os seis veículos em três camadas: contrato estático, seed/migração D1 e leitura pública. Conferir marca, modelo, versão, ano/modelo, km, preço, câmbio, combustível, categoria, tipo, descrição, equipamentos, ficha técnica, financiamento, destaque, status e SEO.

**Resultado da auditoria de 04/09:** etapa concluída. Foram encontrados pontos que precisam ser corrigidos na etapa 02, principalmente divergências entre fonte estática e D1 e a representação transitória de mídia.

## 02 — Correções de dados

Aplicar correções em uma única fonte controlada, atualizar seeds/migrations somente quando necessário e eliminar divergências que possam voltar a aparecer. Manter os seis veículos coerentes em domínio, D1 e apresentação pública.

**Aceite:** nenhuma divergência conhecida entre o contrato do veículo, D1 e a tela pública.

## 03 — Fechamento D1

Confirmar schema final da fase de catálogo, migrations aplicadas em ordem, índices, constraints, dados demo, histórico de status, preços e inventário. Remover dependências de sincronizações temporárias que não serão necessárias após a migração.

**Aceite:** D1 reproduz o catálogo corretamente sem depender de `vehicles.ts` para leitura pública.

## 04 — Migração R2

Migrar as imagens definitivas dos seis veículos para o bucket R2, preservando três imagens coerentes por veículo. Criar registros em `vehicle_media`, ordenar a galeria, definir MIME/alt text e validar objetos remotos. Não usar CSS ou sobreposição para esconder problemas das fotos; a fonte deve ser correta.

**Aceite:** 18 imagens válidas, 3 por veículo, persistidas no R2 e relacionadas ao D1.

## 05 — Resolver definitivo D1/R2

Substituir o resolver transitório por resolução baseada em `vehicle_media`/R2. `legacy://` deixa de ser fonte normal do catálogo. A aplicação continua escondendo a infraestrutura da UI pública.

**Aceite:** nenhum veículo público depende de URL externa legada para sua galeria.

## 06 — Testes do catálogo

Testar listagem, filtros, ordenação, detalhe, relacionados, favoritos, status, imagens, ausência de dados e comportamento com veículo inexistente.

**Aceite:** catálogo funcional em D1/R2 e sem regressões conhecidas.

## 07 — Testes do site público

Regressão completa de Home, Estoque, Detalhe, Contato, navegação, CTAs, WhatsApp e estados de erro.

## 08 — Correção do fluxo de financiamento/WhatsApp

O simulador continua educativo. O CTA de proposta real deve enviar ao vendedor o contexto da simulação como estimativa: veículo, entrada, prazo, taxa indicativa e parcela estimada, deixando explícito que a proposta real depende de análise de crédito e instituição financeira. Nunca apresentar a simulação como proposta aprovada.

## 09 — QA responsivo

Validar desktop, tablet e mobile nos fluxos principais, incluindo galeria, filtros, formulários, simulador e WhatsApp.

## 10 — Fechamento da Fase Pública

Congelar a versão pública como baseline funcional. Registrar o aceite e somente depois iniciar a operação administrativa.

**Gate obrigatório:** 01–10 aprovados antes de autenticação/admin.

---

# BLOCO B — SEGURANÇA E OPERAÇÃO ADMINISTRATIVA

## 11 — Segurança server-side

Revisar fronteiras server/client, validação de payloads, CSRF, acesso a bindings, erros, logs e exposição de dados. Criar regras reutilizáveis antes do painel.

## 12 — Autenticação

Criar login seguro para equipe interna sem expor credenciais no cliente. Sessão deve ser server-side, revogável e preparada para evolução.

## 13 — Autorização

Definir papéis e permissões mínimas, inicialmente administrador e operacional, aplicando autorização no servidor e não apenas escondendo botões.

## 14 — Estrutura /admin

Criar shell administrativo, navegação, layout, estados de carregamento/erro e proteção de rota.

## 15 — Dashboard

Exibir visão operacional: estoque disponível/reservado/vendido, leads, propostas, avaliações e atividades recentes.

## 16 — Estoque administrativo

Criar tela de gestão do estoque com busca, filtros, status, publicação, destaque e ações.

## 17 — Cadastro de veículos

Formulário completo conectado ao domínio e D1, com validação e persistência.

## 18 — Edição de veículos

Editar dados sem quebrar relações de mídia, histórico, preço ou leads.

## 19 — Status/publicação

Separar claramente status comercial e publicação. Registrar transições e impedir estados incoerentes.

## 20 — Destaques

Controlar veículos em destaque e ordem de exibição de forma administrativa.

---

# BLOCO C — MÍDIA E HOME ADMINISTRÁVEL

## 21 — Upload de imagens

Upload server-side para R2, validação de MIME/tamanho, nomes/chaves seguras e registro D1.

## 22 — Galeria

Ordenar, definir principal, substituir e excluir imagens, mantendo integridade D1/R2.

## 23 — Preview

Permitir visualizar o veículo como cliente antes da publicação.

## 24 — Home dinâmica

Permitir controlar destaques e conteúdos comerciais sem permitir que a operação destrua a identidade visual.

---

# BLOCO D — CRM E OPERAÇÃO COMERCIAL

## 25 — Leads

Centralizar Comprar, Trocar, Financiar, Vender, Consignar e Contato geral em leads persistentes.

## 26 — Pipeline

Implementar estados `Novo → Em atendimento → Aguardando cliente → Proposta enviada → Negociação → Convertido/Perdido`.

## 27 — Atendimento

Responsável, observações, histórico, datas e ações rápidas de atendimento.

## 28 — Avaliações

Solicitações de venda/troca/consignação com dados do veículo, condição, valores, fotos/documentos, decisão e responsável.

## 29 — Negociações

Registrar proposta, condições, veículo, cliente, valores, etapas e histórico sem misturar com a simulação pública.

## 30 — Reservas

Fluxo controlado de reserva, prazo, responsável, liberação e histórico.

## 31 — Vendas

Registrar conversão, condições finais, veículo, cliente, origem do lead e histórico comercial.

---

# BLOCO E — FINANCEIRO, CONFIGURAÇÕES E MÉTRICAS

## 32 — Financiamento administrativo

Registrar operações reais: cliente, veículo, entrada, prazo, taxa, instituição, parcela estimada, proposta e status. Separar rigorosamente de `simulação pública`.

## 33 — Configurações comerciais

Centralizar WhatsApp, dados comerciais, horários, regras de financiamento demonstrativo, textos operacionais e parâmetros que não devem ficar espalhados no código.

## 34 — Analytics

Instrumentar eventos úteis: visualização de veículo, WhatsApp, favorito, filtros, intenções e conversões, respeitando privacidade e consentimento quando aplicável.

## 35 — Relatórios

Criar visões operacionais de estoque, leads, atendimento, conversão, financiamento, avaliações e vendas.

---

# BLOCO F — QUALIDADE, SEO, SEGURANÇA E RECUPERAÇÃO

## 36 — SEO final

Canonical definitivo, sitemap, robots, Open Graph, metadata por veículo, dados estruturados e indexação apenas do estoque publicado.

## 37 — Acessibilidade

Auditoria final de contraste, teclado, foco, semântica, labels, ARIA, diálogos e formulários em público e admin.

## 38 — Testes automatizados

Cobrir domínio, casos de uso, validações, server functions, repositórios e fluxos críticos. Adicionar testes E2E onde o risco justificar.

## 39 — Segurança final

Revisão de autenticação, autorização, sessão, CSRF, validação, uploads, acesso ao R2/D1, logs, rate limiting e exposição de informações.

## 40 — Backup/recuperação

Definir rotina de backup/exportação D1, recuperação de mídia R2, retenção, restauração testada e documentação operacional.

## 41 — Performance

Medir e otimizar somente gargalos reais: SSR, consultas D1, imagens R2, cache seguro, carregamento, bundle e Core Web Vitals.

---

# BLOCO G — ENTREGA FINAL

## 42 — Domínio definitivo

Configurar domínio final, DNS, SSL e referências de ambiente. Só aqui fechar canonical/sitemap baseados na URL definitiva.

## 43 — QA completo

Executar matriz final de público + admin + comercial + mídia + segurança + responsividade.

## 44 — Homologação

Rodar cenário realista de operação, desde entrada do cliente até venda, incluindo exceções.

## 45 — Correções finais

Corrigir somente problemas encontrados na homologação, sem abrir escopo desnecessário.

## 46 — Aprovação

Registrar aceite final da versão candidata ao lançamento.

## 47 — Lançamento

Publicar versão de produção e confirmar domínio, banco, mídia, autenticação, monitoramento e fluxos comerciais.

---

# BLOCO H — PÓS-LANÇAMENTO

## 48 — Monitoramento pós-lançamento

Acompanhar erros, disponibilidade, performance, conversões, leads, mídia, banco e segurança nos primeiros ciclos de operação.

## 49 — Melhorias contínuas

Priorizar melhorias por impacto comercial, segurança, experiência e dados reais. Evitar mudanças cosméticas sem retorno.

---

# Estratégia de velocidade

Não vamos transformar cada item em uma espera artificial. Quando duas tarefas não possuem dependência direta, elas podem ser preparadas em paralelo internamente. O gate continua sendo o aceite funcional da etapa que bloqueia a próxima.

Sequência crítica:

`01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 30 → 31 → 32 → 33 → 34 → 35 → 36 → 37 → 38 → 39 → 40 → 41 → 42 → 43 → 44 → 45 → 46 → 47 → 48 → 49`

Preparação interna pode ocorrer em paralelo quando não altera a baseline aprovada. Nenhuma etapa posterior será considerada concluída só porque seu código foi preparado: o critério é implementação + validação + aceite quando aplicável.

## Regra de comunicação

Ao terminar uma etapa, a comunicação deve informar:

- etapa concluída;
- o que foi alterado/verificado;
- testes executados;
- resultado técnico;
- o que o usuário precisa testar manualmente;
- se a etapa está `Concluída — aguardando teste` ou `Concluída e aprovada`.

Após o aceite, seguir imediatamente para a próxima etapa.
