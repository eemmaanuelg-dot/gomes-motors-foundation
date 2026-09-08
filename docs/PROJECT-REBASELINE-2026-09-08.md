# Gomes Motors — Rebaseline do Projeto

Data: 08/09/2026

## Finalidade

Este documento estabelece o novo ponto de partida técnico do Gomes Motors. Ele consolida o estado real da branch `main`, elimina interpretações históricas que já não correspondem ao produto e redefine as 49 fases como uma única linha de execução coerente.

O rebaseline **não declara fases concluídas por herança**. Uma fase só fecha quando o estado atual do produto satisfaz seu objetivo, os testes correspondentes passam e, quando necessário, a operação remota/manual é comprovada.

## Fonte de verdade

- Código: branch `main` do repositório `eemmaanuelg-dot/gomes-motors-foundation`.
- Dados operacionais: D1 `gomes-motors-db`.
- Mídia: R2 `gomes-motors-media-2026`.
- Plano canônico: este documento + `docs/MASTER-EXECUTION-PLAN.md`, após sua atualização para apontar para este rebaseline.
- Documentos históricos não podem criar requisitos novos por conta própria. Quando divergirem do código e deste plano, são tratados como histórico até serem revisados.

## Estado arquitetural reconhecido

O projeto já possui uma base muito mais avançada que um site institucional simples: catálogo público, detalhe de veículo, financiamento demonstrativo, leads, operações comerciais, administração, D1/R2, mídia, analytics, segurança administrativa, testes e documentação operacional já existem em diferentes níveis de maturidade.

A configuração atual declara D1 como fonte do catálogo e R2 como bucket de mídia. O projeto usa React/TanStack Start/Router, TypeScript, Vite, Tailwind e Cloudflare Workers/Wrangler.

A principal dívida atual não é ausência de uma grande funcionalidade isolada; é **fragmentação entre implementação, documentação, validação e infraestrutura remota**. O trabalho a partir deste ponto deve reduzir essa fragmentação antes de acrescentar escopo novo.

## Regras de rebaseline

1. Não reconstruir funcionalidades existentes sem evidência de que a implementação atual está errada.
2. Não manter código, documentação, testes ou fluxos apenas porque pertencem a uma decisão antiga.
3. Não remover uma capacidade útil apenas para simplificar a auditoria.
4. D1 é a fonte de verdade para dados operacionais.
5. R2 é a fonte de verdade para mídia definitiva.
6. A UI pública não deve conhecer detalhes de infraestrutura.
7. Segurança real deve existir no servidor; esconder botão não é autorização.
8. Simulação pública e operação financeira real são domínios diferentes.
9. Status comercial e publicação são conceitos diferentes.
10. Toda fase deve terminar com evidência compatível com o risco: código, teste, validação remota ou aceite manual.
11. Uma pendência encontrada em fase anterior deve ser corrigida na origem antes de avançar quando ela puder contaminar fases posteriores.
12. Documentação antiga será atualizada ou explicitamente marcada como histórica; não haverá múltiplas fontes concorrentes de verdade.
13. **Toda tarefa, subtarefa ou fase concluída deve ser registrada imediatamente no documento de status oficial, com data, commit/referência técnica e evidência da validação.**
14. **Uma tarefa marcada como concluída não deve ser auditada novamente por rotina. Ela só será reaberta se surgir evidência objetiva de regressão, mudança de requisito, alteração de arquitetura ou falha posterior que afete seu critério de fechamento.**
15. **O registro de conclusão é parte obrigatória da própria entrega. Uma tarefa não é considerada definitivamente encerrada enquanto a implementação estiver pronta mas sua conclusão ainda não estiver registrada.**
16. **O status oficial deve permitir identificar rapidamente o que está concluído, o que está em execução, o que está bloqueado e o que foi reaberto, evitando novas auditorias gerais desnecessárias.**

---

# REGRA PERMANENTE DE REGISTRO DE CONCLUSÃO

A partir do rebaseline de 08/09/2026, o projeto passa a adotar um **registro permanente de execução**.

Isso significa que o fluxo obrigatório de qualquer tarefa relevante será:

`EXECUTAR → VALIDAR → CORRIGIR SE NECESSÁRIO → VALIDAR NOVAMENTE → REGISTRAR COMO CONCLUÍDA → AVANÇAR`

Ao concluir uma tarefa, devem ser registrados, no mínimo:

- **Identificação:** fase e tarefa concluída.
- **Status:** `CONCLUÍDA`.
- **Data:** data efetiva da conclusão.
- **Referência técnica:** commit, PR, arquivo(s) ou outro identificador verificável.
- **Validação:** testes, build, workflow, validação manual ou evidência remota utilizada.
- **Observação:** somente se houver alguma ressalva que permaneça válida sem impedir o fechamento.

### Regra de não regressão da auditoria

O objetivo desta regra é impedir que o projeto entre novamente em um ciclo no qual cada nova etapa obrigue a revisar tudo o que já foi feito.

Depois que uma tarefa for registrada como `CONCLUÍDA`, ela passa a ser tratada como **fechada**. As etapas seguintes devem confiar nesse registro e trabalhar sobre ele, sem repetir a auditoria completa daquela tarefa.

Uma tarefa já concluída só volta para `REABERTA` quando houver uma causa concreta, como:

- regressão comprovada;
- alteração de requisito ou decisão de produto;
- mudança arquitetural que invalide sua implementação;
- falha descoberta em uma etapa posterior que tenha relação direta com ela;
- evidência de que o critério de fechamento original não era suficiente.

Quando uma tarefa for reaberta, o motivo e a nova validação também devem ser registrados. **Não se apaga o histórico anterior.** O registro deve mostrar que a tarefa foi concluída, por que foi reaberta e quando voltou a ser concluída.

### Registro das fases

O status das fases 01–49 será mantido em `docs/EXECUTION-STATUS.md`. O rebaseline define os critérios; o status registra a execução real.

O formato mínimo por fase será:

| Fase | Status | Data de fechamento | Referência | Evidência | Observação |
|---|---|---|---|---|---|
| 01 | PENDENTE | — | — | — | — |
| 02 | PENDENTE | — | — | — | — |
| 03 | PENDENTE | — | — | — | — |
| ... | ... | ... | ... | ... | ... |
| 41 | PENDENTE | — | — | — | — |
| 42 | PENDENTE | — | — | — | — |
| 49 | PENDENTE | — | — | — | — |

Além do status da fase, tarefas internas importantes devem ser registradas no histórico de execução para que o trabalho já validado não precise ser redescoberto em uma auditoria futura.

---

# REVISÃO DAS 49 FASES

## BLOCO A — Fundação pública e dados

### 01 — Contrato e auditoria do catálogo
Objetivo atual: consolidar o modelo de veículo e os seis registros demo, eliminando divergências entre código, D1 e apresentação pública.

**Critério de fechamento:** contrato, dados persistidos e leitura pública representam exatamente o mesmo domínio.

### 02 — Integridade dos dados
Objetivo atual: corrigir seed, migrations e dados transitórios que ainda possam reintroduzir divergências.

**Critério:** não existe correção conhecida que dependa de sincronização manual frágil.

### 03 — D1 operacional
Objetivo atual: confirmar migrations, constraints, índices, dados e leitura pública no D1 remoto.

**Critério:** catálogo público funciona a partir do D1 sem depender do catálogo estático como fonte de leitura.

### 04 — Migração definitiva de mídia para R2
Objetivo atual: migrar as 18 imagens demo, três por veículo, para R2 e registrar corretamente `vehicle_media`.

**Critério:** objetos existem remotamente, possuem relação D1 válida e podem ser lidos pela aplicação.

### 05 — Resolver definitivo D1/R2
Objetivo atual: retirar `legacy://` e referências externas da rota normal do catálogo.

**Critério:** nenhum veículo publicado depende de mídia legada para funcionar.

### 06 — Regressão do catálogo
Objetivo atual: validar listagem, filtros, ordenação, detalhe, relacionados, favoritos, status, imagens e erros.

### 07 — Regressão do site público
Objetivo atual: validar Home, Estoque, Detalhe, Contato, navegação, CTAs, WhatsApp e estados de erro.

### 08 — Fluxo comercial público
Objetivo atual: manter financiamento como simulação educativa e gerar contexto de atendimento/WhatsApp sem representar aprovação de crédito.

### 09 — QA responsivo público
Objetivo atual: fechar desktop, tablet e mobile nos fluxos públicos críticos.

### 10 — Baseline pública
Objetivo atual: congelar a versão pública somente após 01–09 realmente validadas.

**Gate A:** 01–10 fechadas.

---

## BLOCO B — Segurança e administração

### 11 — Segurança server-side
Consolidar validação, autorização, sessão, CSRF, acesso a bindings, tratamento de erros, logs e limites operacionais.

### 12 — Autenticação
Garantir login e sessão interna seguros, revogáveis e sem credenciais no cliente.

### 13 — Autorização
Consolidar papéis e permissões no servidor e eliminar qualquer dependência de proteção somente visual.

### 14 — Shell administrativo
Consolidar `/admin`, navegação, estados, proteção de rota e consistência estrutural.

### 15 — Dashboard
Consolidar visão operacional de estoque, leads, propostas, avaliações, atividades e indicadores já existentes.

### 16 — Estoque administrativo
Consolidar busca, filtros, status, publicação, destaque e ações sem duplicar lógica de domínio.

### 17 — Cadastro de veículos
Consolidar formulário, validação, persistência D1 e regras de domínio.

### 18 — Edição de veículos
Consolidar edição sem quebrar mídia, histórico, preço, leads ou relações comerciais.

### 19 — Status e publicação
Consolidar a separação entre estado comercial e publicação e validar todas as transições.

### 20 — Destaques
Consolidar seleção e ordenação de destaques sem espalhar regra comercial pelo frontend.

**Gate B:** 11–20 fechadas e administráveis com segurança.

---

## BLOCO C — Mídia e conteúdo administrável

### 21 — Upload R2
Consolidar upload server-side, MIME, tamanho, chaves seguras, persistência e rollback/erro.

### 22 — Galeria
Consolidar ordenação, imagem principal, substituição e exclusão com integridade D1/R2.

### 23 — Preview
Consolidar visualização pré-publicação usando a mesma regra de apresentação do público.

### 24 — Home dinâmica
Consolidar controles administrativos sem permitir que conteúdo operacional quebre identidade visual ou layout.

**Gate C:** mídia e publicação administráveis sem legado oculto.

---

## BLOCO D — CRM e operação comercial

### 25 — Leads
Consolidar todas as intenções comerciais em leads persistentes e rastreáveis.

### 26 — Pipeline
Consolidar estados do atendimento e impedir transições inválidas.

### 27 — Atendimento
Consolidar responsável, observações, histórico, datas e ações de atendimento.

### 28 — Avaliações
Consolidar venda, troca e consignação com dados do veículo, condição, valores, mídia/documentos e decisão.

### 29 — Negociações
Consolidar propostas e condições comerciais sem misturar negociação com simulação pública.

### 30 — Reservas
Consolidar reserva, prazo, responsável, liberação e histórico.

### 31 — Vendas
Consolidar conversão, condições finais, veículo, cliente, origem e histórico.

**Gate D:** fluxo comercial completo e consistente.

---

## BLOCO E — Financeiro, configurações e métricas

### 32 — Financiamento administrativo
Consolidar operações reais de financiamento e separar definitivamente do simulador público.

### 33 — Configurações comerciais
Centralizar parâmetros que precisam ser alterados pela operação, evitando valores duplicados no código.

### 34 — Analytics
Consolidar eventos úteis, deduplicação, privacidade e ligação entre intenção e conversão.

### 35 — Relatórios
Consolidar indicadores operacionais de estoque, leads, atendimento, conversão, financiamento, avaliações e vendas.

**Gate E:** operação e métricas coerentes com o domínio.

---

## BLOCO F — Fechamento técnico

### 36 — SEO final
Consolidar canonical, sitemap, robots, metadata, Open Graph, dados estruturados e indexação por status.

### 37 — Acessibilidade
Auditar público e admin: semântica, teclado, foco, contraste, labels, ARIA, diálogos e formulários.

### 38 — Testes automatizados
Consolidar testes de domínio, casos de uso, validações, server functions, repositórios e fluxos críticos; adicionar E2E onde o risco justificar.

### 39 — Segurança final
Reauditar autenticação, autorização, sessão, CSRF, validação, uploads, D1/R2, logs, rate limiting e exposição de informações.

### 40 — Backup e recuperação
Comprovar exportação D1, estratégia para R2, retenção e restauração testada. Documentação isolada não fecha a fase.

### 41 — Performance
Medir e otimizar gargalos reais de SSR, D1, R2, imagens, cache, bundle, carregamento e Core Web Vitals.

**Gate F:** 36–41 fechadas com evidência. Este é o ponto de retomada definido pelo projeto.

---

## BLOCO G — Produção

### 42 — Domínio definitivo
Configurar domínio, DNS, SSL, ambiente e referências definitivas.

### 43 — QA de produção
Executar matriz completa público + admin + CRM + mídia + segurança + responsividade.

### 44 — Homologação
Executar operação realista ponta a ponta, incluindo exceções.

### 45 — Correções finais
Corrigir somente defeitos encontrados na homologação e regressar os fluxos afetados.

### 46 — Aprovação
Registrar aceite da release candidata.

### 47 — Lançamento
Publicar e confirmar todos os serviços críticos em produção.

**Gate G:** produção lançada e verificável.

---

## BLOCO H — Operação contínua

### 48 — Monitoramento
Acompanhar disponibilidade, erros, performance, mídia, dados, segurança, leads e conversões.

### 49 — Melhorias contínuas
Priorizar evolução por impacto comercial, segurança, experiência e dados reais.

---

# PONTO DE PARTIDA OFICIAL

O ponto de partida desta nova configuração é o **rebaseline de 08/09/2026**.

A execução não começa novamente do zero e também não continua cegamente da fase 41.

A sequência correta é:

`ESTADO ATUAL → REBASELINE → AUDITORIA 01–41 → CORREÇÕES DE ORIGEM → VALIDAÇÃO → REGISTRO DE CONCLUSÃO → FECHAMENTO DOS GATES → FASE 41 PERFORMANCE → 42–49`

Enquanto 01–41 são consolidadas, não devem ser introduzidas funcionalidades novas que criem dependências desnecessárias.

## O que fica explicitamente fora da baseline

- decisões antigas que contradigam o domínio atual;
- sincronizações transitórias usadas apenas durante migração;
- dependência normal de `legacy://`;
- catálogo estático como fonte pública quando D1 já é a fonte operacional;
- documentação que descreva funcionalidades atuais como se fossem futuras;
- testes frágeis que validem apenas texto incidental em vez de comportamento/contrato real;
- duplicação de regras comerciais entre frontend, backend e documentação;
- qualquer alegação de infraestrutura remota validada sem evidência operacional.

## Estado inicial do rebaseline

- **Arquitetura:** existente e aproveitável.
- **Produto público:** existente, precisa regressão e fechamento.
- **Admin/CRM:** existente em nível avançado, precisa consolidação e auditoria.
- **D1/R2:** configurados; migração/validação remota ainda precisa ser comprovada.
- **Testes:** existentes e relevantes, mas precisam ser tratados como suíte de regressão e não como prova automática de tudo.
- **Documentação:** fragmentada; deve ser consolidada a partir deste documento.
- **Fases 01–41:** reabertas conceitualmente para auditoria de fechamento, sem apagar implementação existente.
- **Fase de retomada:** 41, somente depois do fechamento real dos gates anteriores.

## Regra final

A partir deste documento, o projeto deve evoluir por **consolidação**, não por acumulação. Cada correção deve deixar o sistema mais simples de entender, mais coerente com o domínio e mais fácil de validar na próxima etapa.

**Regra permanente adicional:** nenhuma tarefa concluída deve permanecer apenas na memória da execução ou em mensagens de conversa. Sua conclusão deve ser registrada no controle oficial do projeto no mesmo ciclo em que foi validada. Dessa forma, o histórico de execução se torna a referência para continuidade e evita que auditorias completas sejam repetidas sem motivo objetivo.
