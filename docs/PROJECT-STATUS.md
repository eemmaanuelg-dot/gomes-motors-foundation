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

**Estado atual:** somente a arquitetura/planta foi definida e documentada. A implementação dos contratos ainda não começou.

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
├── Camada de domínio atual
│   ├── dados estáticos de veículos
│   ├── utilitários comerciais
│   ├── favoritos
│   └── regras compartilhadas
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
- CRM de leads;
- avaliações persistentes;
- negociações persistentes;
- financiamento operacional real.

Esses itens não são pendências da fase pública. Eles pertencem às próximas fases do produto.

## Próximas fases

Depois da preparação do domínio:

1. contratos e implementação de domínio;
2. D1 + R2 + camada server-side;
3. autenticação e autorização;
4. `/admin`;
5. Dashboard;
6. Estoque administrativo;
7. migração dos seis veículos de demonstração;
8. Leads e atendimento;
9. Avaliações;
10. Financiamento operacional;
11. métricas e preparação para operação real.

## Regra para a evolução

O site público estável é patrimônio do projeto.

Nenhuma nova camada deve exigir a perda de funcionalidades, identidade ou UX já aprovadas. A evolução deve acontecer por extensão da arquitetura, não por reconstrução desnecessária.
