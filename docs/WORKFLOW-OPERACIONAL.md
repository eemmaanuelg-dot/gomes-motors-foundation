# Gomes Motors — Workflow Operacional de Execução

Data: 07/09/2026

## Regra de início imediato

Quando o usuário utilizar uma palavra ou expressão previamente definida como gatilho de início de trabalho — incluindo **"marcha"** — o trabalho deve começar imediatamente.

O gatilho significa autorização para executar o trabalho necessário, e não apenas autorização para planejar ou explicar o que será feito.

## Comportamento esperado

Ao receber um gatilho de início:

1. Inspecionar o estado real do projeto e o contexto necessário.
2. Identificar a causa do problema ou o caminho técnico adequado.
3. Executar diretamente as soluções, correções, criações, ajustes e validações necessárias.
4. Preservar a arquitetura, identidade visual, funcionalidades aprovadas e decisões anteriores, salvo quando a tarefa exigir alteração.
5. Não interromper o fluxo para pedir confirmação sobre ações que já estejam claramente autorizadas pelo pedido e pelo contexto.
6. Quando houver dependências, resolver primeiro o que bloqueia a execução e continuar automaticamente para as próximas ações cabíveis.
7. Executar testes/verificações técnicas sempre que estiverem disponíveis.
8. Somente retornar ao usuário depois de concluir o máximo de trabalho possível naquele ciclo, informando objetivamente o resultado.

## Regra de velocidade

O objetivo é **adiantar o trabalho o máximo possível**, sem criar esperas artificiais entre ações relacionadas.

Tarefas independentes podem ser analisadas ou preparadas em paralelo quando isso for seguro e não comprometer a baseline aprovada.

A ausência de confirmação intermediária não significa autorização para alterar escopo. O trabalho deve permanecer dentro do objetivo solicitado e das regras do projeto.

## Regra de conclusão

Ao retornar após um ciclo iniciado por gatilho, informar:

- o que foi investigado;
- o que foi alterado/criado/corrigido;
- arquivos ou áreas afetadas, quando relevante;
- testes e validações executados;
- resultado técnico;
- estado da etapa/fase;
- eventual teste manual que ainda dependa do usuário.

Não declarar uma etapa como aprovada quando ainda faltar aceite manual exigido pelo plano.

## Relação com as fases

Este workflow complementa o `docs/MASTER-EXECUTION-PLAN.md`. As fases continuam obedecendo aos gates e critérios de aceite definidos no plano. O que muda é o modo de execução: depois que uma ação for autorizada pelo usuário, o assistente deve executar imediatamente tudo o que for necessário dentro do escopo, em vez de parar a cada microetapa para solicitar nova autorização.

## Gatilhos

- **marcha** — iniciar imediatamente o trabalho autorizado e executar as ações necessárias até o máximo possível do ciclo.
- Outros gatilhos poderão ser adicionados explicitamente pelo usuário e passarão a ter o mesmo comportamento.

## Princípio permanente

**Se o usuário disser "marcha" ou usar outro gatilho de início previamente cadastrado, é hora de trabalhar: investigar, executar, corrigir/criar, validar e só então voltar com o resultado.**
