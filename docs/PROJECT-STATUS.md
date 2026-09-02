# Gomes Motors — Status do Projeto

Data do marco: 02/09/2026

## Marco atual

A versão pública do Gomes Motors foi **fechada como base estável**.

"Fechar" significa congelar esta versão como referência funcional e visual para a próxima fase. Não significa impedir alterações futuras. Bugs, melhorias e novas funcionalidades continuam podendo ser implementados sobre esta base, sempre preservando o que já foi aprovado.

## Onde estamos

### Fase 1 — Fundação
**Concluída.**

- projeto iniciado a partir da base Lovable/Antigravity;
- arquitetura TanStack Start + React + TypeScript;
- identidade visual Gomes Motors;
- estrutura inicial de páginas e componentes;
- integração com GitHub;
- publicação em Cloudflare Workers.

### Fase 2 — Site público
**Concluída e aprovada.**

Rotas públicas:

- `/` — Home;
- `/estoque` — catálogo de veículos;
- `/estoque/:id` — detalhe do veículo;
- `/servicos` — fluxos comerciais;
- `/sobre` — institucional;
- `/contato` — contato e canais comerciais.

Funcionalidades consolidadas:

- estoque de carros e motos;
- busca, filtros e ordenação;
- favoritos persistentes no navegador;
- detalhe completo de veículo;
- Comprar / Trocar / Financiar;
- Vender / Consignar;
- formulários comerciais;
- WhatsApp com mensagens contextualizadas;
- contato por e-mail, telefone e WhatsApp;
- navegação responsiva;
- SEO básico por rota;
- tratamento de erro SSR;
- favicon e identidade visual próprios;
- build validado com TypeScript.

### Fase 3 — Auditoria e estabilização
**Concluída.**

Foram corrigidos problemas técnicos identificados, removidos artefatos comprovadamente obsoletos e preservados arquivos necessários para a evolução futura.

A auditoria está registrada em `docs/PROJECT-AUDIT-AND-ROADMAP.md`.

### Fase 4 — Marco público estável
**Concluída.**

Critério de encerramento:

- funcionalidades públicas principais implementadas;
- fluxos comerciais testados e aprovados;
- página de Contato revisada e aprovada;
- navegação e detalhes de veículos validados;
- auditoria técnica concluída;
- build Cloudflare aprovado;
- nenhum problema crítico conhecido pendente;
- decisões futuras separadas da base pública.

### Fase 5 — Preparação da camada de domínio
**Iniciada em 02/09/2026.**

A planta arquitetural foi registrada em `docs/DOMAIN-ARCHITECTURE.md`.

Objetivo da fase:

- separar regras de negócio da apresentação;
- criar contratos de domínio reutilizáveis;
- preparar veículos, estoque, leads, avaliações, financiamento e clientes;
- criar uma fronteira entre domínio e fonte de dados;
- permitir começar com os dados estáticos atuais e migrar posteriormente para D1;
- preparar o mesmo domínio para o futuro Painel Comercial;
- preservar integralmente a experiência pública aprovada.

### Etapas da Fase 5

1. contratos fundamentais;
2. repositório estático;
3. casos de uso;
4. integração gradual com o site público;
5. validação arquitetural.

### Etapa 5.1 — Contratos fundamentais
**Implementação iniciada e estruturada.**

Foram criados os primeiros contratos centrais, sem alterar as rotas ou a UX pública:

- tipos compartilhados de domínio;
- entidade e tipos de veículo;
- regras de transição de status de veículo;
- contrato de repositório de veículos;
- contrato e regras iniciais de estoque;
- entidade, tipos, histórico e regras de leads;
- entidade e regras de avaliações;
- entidade e regras de financiamento;
- entidade e contrato de clientes;
- contratos de repositório para estoque, leads, avaliações, financiamento e clientes.

Regras importantes já centralizadas:

- veículo vendido não retorna para fluxo comercial comum;
- veículo vendido não deve permanecer publicado;
- veículo reservado pode ser liberado ou vendido;
- veículo vendido não aceita novas transições;
- leads possuem fluxo de atendimento controlado;
- tipos de lead que representam negociação de veículo podem exigir vínculo com veículo;
- avaliações possuem fluxo separado de solicitação, análise e decisão;
- financiamento separa simulação de proposta operacional;
- entrada e prazo de financiamento possuem validação básica.

**Ainda não foi feito:**

- integração das rotas públicas com esses contratos;
- repositório estático;
- D1;
- R2;
- server-side operacional;
- autenticação;
- `/admin`;
- migração dos dados atuais.

O site público permanece funcionando pela estrutura anterior enquanto os contratos são preparados e validados.

## Estrutura atual

```text
GOMES MOTORS
│
├── Site público
│   ├── Home
│   ├── Estoque
│   │   └── Detalhe do veículo
│   ├── Serviços
│   │   ├── Comprar
│   │   ├── Vender
│   │   ├── Trocar
│   │   ├── Consignar
│   │   └── Financiar
│   ├── Sobre nós
│   └── Contato
│
├── Camada de apresentação
│   ├── Header
│   ├── Footer
│   ├── Logo
│   └── componentes UI disponíveis
│
├── Domínio em preparação
│   ├── shared
│   ├── vehicles
│   ├── inventory
│   ├── leads
│   ├── evaluations
│   ├── financing
│   └── customers
│
├── Dados atuais
│   └── `src/data/vehicles.ts` — fonte estática pública durante a transição
│
├── Rotas / aplicação
│   ├── TanStack Router
│   ├── React
│   └── TanStack Start
│
├── Infraestrutura
│   ├── Vite
│   ├── Cloudflare Workers
│   ├── Wrangler
│   └── TypeScript
│
└── Documentação
    ├── PROJECT-AUDIT-AND-ROADMAP.md
    ├── FUTURE-ROADMAP.md
    ├── PROJECT-STATUS.md
    └── DOMAIN-ARCHITECTURE.md
```

## O que ainda não existe — propositalmente

A base pública ainda não possui:

- banco de dados;
- cadastro real de veículos;
- upload de fotos em R2;
- autenticação;
- painel administrativo;
- usuários internos;
- CRM de leads persistente;
- avaliações persistentes;
- negociações persistentes;
- financiamento operacional real.

Esses itens não são pendências da fase pública. Eles pertencem às próximas fases do produto.

## Próximas fases

Depois da preparação do domínio:

1. conclusão dos contratos e implementação inicial do domínio;
2. repositório estático e casos de uso;
3. integração gradual com o site público;
4. validação arquitetural;
5. D1 + R2 + camada server-side;
6. autenticação e autorização;
7. `/admin`;
8. Dashboard;
9. Estoque administrativo;
10. migração dos seis veículos de demonstração;
11. Leads e atendimento;
12. Avaliações;
13. Financiamento operacional;
14. métricas e preparação para operação real.

## Regra para a evolução

O site público estável é patrimônio do projeto.

Nenhuma nova camada deve exigir a perda de funcionalidades, identidade ou UX já aprovadas. A evolução deve acontecer por extensão da arquitetura, não por reconstrução desnecessária.
