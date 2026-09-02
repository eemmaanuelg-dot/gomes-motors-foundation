# Gomes Motors — Planos Futuros

Data: 02/09/2026

Este documento é separado da auditoria técnica. A auditoria estabiliza o que existe; este documento define o produto que vamos construir em seguida.

## Visão

O Gomes Motors deve evoluir de uma vitrine digital para uma pequena plataforma comercial, sem perder a simplicidade para o cliente.

Fluxo principal:

`cliente → vitrine → veículo → interesse → atendimento → negociação → venda`

## 1. Preparação de domínio

Antes do banco, vamos separar o conceito de negócio da implementação atual.

Domínios previstos:

- veículos;
- mídia dos veículos;
- status e publicação;
- clientes;
- leads;
- avaliações;
- financiamento;
- negociações;
- usuários internos;
- configurações comerciais.

A aplicação pública deverá consumir serviços de domínio, e não conhecer diretamente a estrutura de persistência.

## 2. Persistência

Infraestrutura planejada na Cloudflare:

### D1

Banco relacional para veículos, clientes, leads, avaliações, negociações, usuários e configurações.

### R2

Armazenamento de fotos dos veículos e arquivos enviados pelo painel.

### Worker

Camada server-side para regras privadas, acesso ao banco, autenticação e operações administrativas.

## 3. Autenticação

Criar uma área protegida para equipe interna.

Estrutura prevista:

```text
/admin
/admin/login
/admin/dashboard
/admin/estoque
/admin/leads
/admin/avaliacoes
/admin/financiamentos
```

A autorização deverá separar, quando necessário, administrador e usuário operacional.

## 4. Dashboard

O painel deverá abrir com uma visão operacional:

- veículos disponíveis;
- veículos reservados;
- veículos vendidos;
- leads novos;
- leads em atendimento;
- propostas em negociação;
- avaliações pendentes;
- atividades recentes.

A ideia é que o vendedor saiba o que precisa fazer sem procurar informação em várias telas.

## 5. Estoque administrativo

O cadastro deverá permitir criar e editar veículos sem tocar no código.

### Cadastro

- marca;
- modelo;
- versão;
- categoria;
- ano;
- quilometragem;
- preço;
- câmbio;
- combustível;
- cilindrada;
- tipo;
- descrição;
- equipamentos;
- ficha técnica;
- condições de financiamento.

### Publicação

- rascunho;
- publicado;
- destaque;
- disponível;
- reservado;
- vendido.

### Mídia

- upload;
- foto principal;
- ordenação;
- substituição;
- exclusão;
- preview.

### Preview

O administrador deverá conseguir visualizar o veículo como o cliente verá antes de publicar.

## 6. Leads e atendimento

Todos os caminhos comerciais do site deverão convergir para uma estrutura de atendimento.

Origens:

- Comprar;
- Trocar;
- Financiar;
- Vender;
- Consignar;
- Contato geral.

Dados principais:

- nome;
- telefone/WhatsApp;
- cidade;
- veículo relacionado;
- intenção;
- origem;
- observações;
- status;
- histórico;
- responsável;
- datas.

Status iniciais:

`Novo → Em atendimento → Aguardando cliente → Proposta enviada → Negociação → Convertido/Perdido`

## 7. Avaliação de veículos

Os formulários de venda, troca e consignação deverão gerar solicitações internas.

A equipe poderá registrar:

- dados do veículo;
- condição;
- valor solicitado;
- valor avaliado;
- valor de entrada na negociação;
- observações;
- fotos/documentos quando aplicável;
- decisão comercial;
- responsável;
- status.

## 8. Financiamento

O simulador público continuará sendo uma ferramenta demonstrativa.

O painel permitirá registrar uma negociação real:

- veículo;
- cliente;
- entrada;
- prazo;
- taxa;
- instituição;
- parcela estimada;
- proposta;
- status.

## 9. Vitrine pública conectada ao painel

Quando o banco estiver ativo, a experiência pública deverá permanecer praticamente a mesma.

O que muda é a origem dos dados:

`banco → domínio → página pública`

em vez de:

`vehicles.ts → página pública`.

Isso permite que a equipe altere estoque sem reconstruir o site.

## 10. Home administrável

No futuro, o painel poderá controlar:

- veículos em destaque;
- ordem dos destaques;
- campanhas;
- chamadas comerciais;
- banners;
- conteúdos institucionais selecionados.

A identidade visual continuará sob controle do sistema, para impedir que conteúdo administrativo destrua a linguagem da marca.

## 11. Métricas

Depois da operação básica:

- visualizações de veículos;
- cliques em WhatsApp;
- favoritos;
- origem dos leads;
- veículos mais procurados;
- conversão por intenção;
- desempenho dos destaques;
- tempo de atendimento;
- conversão de lead em negociação e venda.

## 12. SEO e descoberta

Com o catálogo real:

- URLs estáveis;
- metadata por veículo;
- Open Graph por veículo;
- sitemap;
- robots;
- canonical;
- dados estruturados quando apropriado;
- páginas indexáveis para estoque publicado.

## 13. Ordem de execução

### Etapa 1 — agora

Finalizar a estabilização da camada pública e preparar a arquitetura de domínio.

### Etapa 2

Criar contratos de domínio e adaptar a aplicação para consumir esses contratos sem mudar a UX.

### Etapa 3

Adicionar D1/R2 e uma camada server-side de dados.

### Etapa 4

Criar autenticação e estrutura protegida `/admin`.

### Etapa 5

Construir Dashboard + Estoque administrativo.

### Etapa 6

Migrar os seis veículos de demonstração para a nova estrutura de dados e validar a migração.

### Etapa 7

Conectar os fluxos Comprar/Trocar/Financiar/Vender/Consignar aos Leads.

### Etapa 8

Construir Avaliações e Financiamento no painel.

### Etapa 9

Adicionar métricas e otimizações comerciais.

### Etapa 10

Preparar a plataforma para operação real.

## Princípio central

Não vamos construir o futuro em paralelo ao presente de forma desorganizada.

Cada etapa deve deixar a próxima mais fácil.

O site público será a vitrine. O painel será a operação. O banco será a memória. Os leads serão o relacionamento. E a camada de domínio será o elo entre todos eles.
