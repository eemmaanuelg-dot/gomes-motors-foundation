# Gomes Motors — Public Baseline

Data: 08/09/2026

## Finalidade

Este documento registra a versão pública de referência após o fechamento das fases 01–09. A baseline não substitui o código nem o D1/R2; ela identifica o estado validado contra o qual mudanças públicas futuras devem ser comparadas.

## Estado de referência

- Branch: `main`
- Referência de fechamento das fases públicas: `e5d6bc36251d543e3ab3b01e0ddd571284676db5`
- Workflow de validação: `34251527649`
- Resultado do workflow: sucesso
- Testes automatizados: sucesso
- Build: sucesso
- D1 remoto: acesso e histórico validados pelo pipeline
- R2 remoto: acesso validado pelo pipeline

## Superfícies públicas incluídas

### Home
- Hero com CTAs para estoque, troca e financiamento.
- Serviços: comprar, vender, trocar, consignar e financiar.
- Veículos em destaque carregados pelo catálogo operacional.
- Links para detalhe, sobre e contato.
- Responsividade estrutural coberta por contrato automatizado.

### Estoque
- Catálogo operacional via `publicVehicleCatalog`.
- Categorias de carros e motos.
- Busca, filtros dependentes e ordenação.
- Favoritos.
- Status disponível, reservado e vendido.
- Detalhes do veículo.
- Continuidade comercial por WhatsApp.
- Estado vazio e limpeza de filtros.

### Detalhe do veículo
- Veículo carregado pelo catálogo operacional.
- Imagens resolvidas pelo caminho D1/R2.
- Metadados SEO derivados do veículo carregado.
- Veículos relacionados.
- Simulação de financiamento explicitamente educativa.
- CTAs comerciais e contexto de atendimento.

### Serviços
- Compra, venda, troca, consignação e financiamento.
- Catálogo operacional para fluxos que dependem de veículo.
- Leads persistidos pela API pública.
- Continuidade por WhatsApp.
- Simulação pública sem promessa de proposta ou aprovação de crédito.

### Contato
- Informações institucionais e comerciais.
- Formulário público de lead.
- Proteções server-side da API.
- Rastreamento de intenção.
- Layout responsivo coberto por contrato automatizado.

## Contratos de arquitetura preservados

1. D1 permanece a fonte de verdade dos dados operacionais.
2. R2 permanece a fonte de verdade das mídias definitivas.
3. Rotas públicas não importam o catálogo estático legado.
4. O detalhe público não usa `VEICULOS` nem `obterTituloVeiculo` do legado.
5. Fluxos comerciais públicos registram leads no servidor.
6. A API valida origem, tipo de conteúdo, tamanho de corpo, intenção e vínculo do veículo.
7. A simulação valida coerência entre veículo simulado e veículo informado no lead.
8. Segurança de autorização administrativa não depende apenas de controles visuais.
9. A baseline não congela conteúdo operacional futuro; congela somente o comportamento público validado nesta data.

## Regra de mudança após a baseline

Mudanças públicas posteriores devem preservar os contratos acima e gerar nova validação proporcional ao risco. A baseline só deve ser reaberta por regressão comprovada, mudança de requisito ou alteração arquitetural relevante.

## Evidência

A referência `e5d6bc3` passou pelo workflow `34251527649`, que concluiu com sucesso validações locais, testes automatizados, build e validações remotas de Cloudflare/D1/R2. O contrato responsivo foi adicionado como parte do fechamento da fase 09.
