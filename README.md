# Gomes Motors Foundation

Projeto de treinamento profissional para uma revendedora fictícia de veículos em Campos dos Goytacazes, RJ.

> **A escolha certa começa aqui.**

## Estado atual

O projeto possui uma camada pública funcional composta por:

- Home institucional e comercial;
- Estoque de carros e motos;
- filtros, busca, ordenação e favoritos persistentes no navegador;
- página de detalhes de veículo com galeria, ficha técnica e simulador demonstrativo de financiamento;
- seleção rápida de interesse em Comprar, Trocar ou Financiar a partir do veículo;
- fluxos estruturados de Comprar, Vender, Trocar, Consignar e Financiar;
- integração comercial por WhatsApp;
- páginas Sobre nós e Contato;
- tratamento de erros de navegação e SSR;
- layout responsivo para desktop, tablet e celular.

O estoque atual é estático e serve como base de demonstração. Banco de dados, autenticação e painel administrativo ainda serão implementados em etapas futuras.

## Identidade visual

- Preto profundo: `#080808`
- Grafite: `#111111`
- Cards: `#181818`
- Branco suave: `#F5F5F5`
- Dourado champagne: `#C9A45C`
- Vermelho profundo: `#B5121B`

O dourado representa identidade e sofisticação. O vermelho é reservado principalmente para ações e CTAs comerciais.

## Stack

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query
- Tailwind CSS v4
- Vite
- Cloudflare Workers
- Wrangler

## Estrutura principal

```text
src/
├── assets/              # Identidade, hero e imagens dos veículos
├── components/
│   ├── site/            # Header, Footer e Logo
│   └── ui/              # Componentes Radix/shadcn disponíveis para evolução
├── data/                # Modelo e dados estáticos atuais dos veículos
├── hooks/               # Hooks compartilhados
├── lib/                 # Regras de domínio, favoritos e tratamento de erros
├── routes/              # Rotas file-based do TanStack Start
├── routeTree.gen.ts     # Arquivo gerado pelo TanStack Router
├── router.tsx           # Configuração do router
├── server.ts            # Entrada SSR/Worker e normalização de erros
├── start.ts             # Middleware do TanStack Start
└── styles.css           # Sistema visual global
```

## Desenvolvimento

```sh
npm install
npm run dev
```

Build com validação TypeScript:

```sh
npm run build
```

Lint:

```sh
npm run lint
```

Deploy Cloudflare:

```sh
npm run deploy
```

## Fluxo de trabalho do projeto

**GitHub `main` = fonte de verdade.**

As mudanças são desenvolvidas e revisadas no GitHub/Lovable. O Cloudflare Workers é tratado como publicação, não como ambiente de edição. Alterações pequenas devem ser agrupadas em blocos coerentes antes de uma nova publicação.

Não reescrever histórico publicado, não fazer force push e não remover código funcional sem justificativa.

## Documentação

- [`docs/PROJECT-AUDIT-AND-ROADMAP.md`](docs/PROJECT-AUDIT-AND-ROADMAP.md) — auditoria técnica e critérios de manutenção da base.
- [`docs/FUTURE-ROADMAP.md`](docs/FUTURE-ROADMAP.md) — evolução de produto, do domínio de dados ao Painel Comercial Gomes Motors.

## Próxima evolução

A visão de longo prazo é transformar a vitrine em uma pequena plataforma comercial:

```text
cliente → estoque → veículo → interesse → atendimento → negociação → venda
```

A próxima etapa não é reconstruir o site. É preparar o domínio de dados e, depois, evoluir para persistência, autenticação e o **Painel Comercial Gomes Motors** com estoque administrativo, leads, avaliações, financiamento, mídia e conteúdo.
