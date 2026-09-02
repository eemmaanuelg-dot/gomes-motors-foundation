# Gomes Motors — Auditoria Técnica

Data: 02/09/2026

## Resultado

A auditoria técnica foi concluída sobre a estrutura atual da branch `main`, que permanece como fonte de verdade do projeto. A revisão considerou código, estrutura, dependências, legado, SSR/client, navegação, acessibilidade, responsividade, SEO, performance e impacto arquitetural futuro.

O critério foi corrigir problemas reais e remover apenas artefatos comprovadamente obsoletos, preservando funcionalidades aprovadas e evitando decisões que criem dívida técnica para a próxima fase.

## Correções aplicadas

- O script `build` passou a executar `tsc --noEmit` depois do build Vite, fazendo a compilação validar também o TypeScript.
- A página de Contato deixou de manter uma constante de WhatsApp duplicada; o número continua centralizado no utilitário de domínio.
- A página de erro SSR foi localizada em português e alinhada visualmente à identidade Gomes Motors, mantendo dependência mínima para funcionar mesmo quando o React não consegue renderizar.
- O README foi atualizado para representar o estado real do projeto e sua arquitetura atual.
- O hero descartado `hero-key-handover.svg` foi removido por não possuir referência ativa e representar uma direção visual abandonada.
- `src/assets/gomes-motors-logo.png.asset.json` foi removido por ser metadata de asset antigo sem consumo pela aplicação atual.
- `.bolt/mcp.json` foi removido por ser configuração legada do Bolt sem participação no runtime, build ou fluxo atual.
- `public/favicon.png` foi removido por estar sem referência ativa; o favicon atual é o `gomes-motors-mark.svg` importado pelo shell global.
- O sistema de favoritos foi corrigido para sincronizar múltiplas instâncias do hook na mesma aba, além da sincronização entre abas, sem alterar a persistência existente em `localStorage`.
- A navegação dos cards de veículos na Home foi padronizada com a navegação direta já validada no Estoque, evitando repetir o problema de navegação dinâmica observado no Cloudflare.
- A imagem principal do hero recebeu prioridade de carregamento e `decoding="async"`; imagens de conteúdo receberam carregamento tardio quando apropriado.
- As mensagens de interesse Comprar/Trocar/Financiar foram centralizadas em `src/lib/vehicle-utils.ts`, eliminando duplicação entre Estoque e Detalhe.
- O botão `Tenho interesse` do Estoque passou a seguir o mesmo fluxo já aprovado no Detalhe: escolha rápida entre Comprar, Trocar e Financiar, com o veículo já identificado e mensagem específica no WhatsApp.
- A documentação foi atualizada para refletir a conclusão da auditoria.
- Nenhum deploy foi realizado no Cloudflare durante esta revisão.

## Código revisado

Foram verificados os pontos de maior impacto da aplicação pública:

- imports e responsabilidades dos módulos;
- tipagem estrita e modelo de veículo;
- utilitários de domínio e mensagens comerciais;
- estado e persistência dos favoritos;
- navegação interna e rotas dinâmicas;
- formulários e fluxos comerciais;
- SSR e fronteira client/server;
- tratamento de erros;
- estados vazios e estados de indisponibilidade;
- acessibilidade estrutural, labels e estados ARIA existentes;
- responsividade dos fluxos principais;
- imagens e carregamento;
- metadados SEO por rota;
- configuração de build e infraestrutura Cloudflare.

O projeto continua deliberadamente sem backend, banco ou autenticação nesta etapa.

## Estrutura

A organização atual permanece coerente com as responsabilidades:

```text
src/
├── assets/          # imagens e identidade visual
├── components/
│   ├── site/        # Header, Footer e Logo
│   └── ui/          # biblioteca Radix/shadcn disponível para evolução
├── data/            # contrato estático atual dos veículos
├── hooks/           # hooks compartilhados
├── lib/             # domínio, favoritos e tratamento de erros
└── routes/          # páginas e rotas do TanStack Start
```

A infraestrutura do projeto permanece nos arquivos de configuração da raiz e em `src/start.ts`, `src/server.ts` e `wrangler.jsonc`.

## Dependências

A revisão não removeu dependências apenas por falta de uso imediato. O projeto possui uma biblioteca de componentes Radix/shadcn que pode sustentar a futura área administrativa e interações mais complexas.

`@tanstack/react-query` também permanece porque já integra o contexto do router e deixa a base preparada para dados assíncronos futuros; não foi introduzido uso artificial apenas para justificar a dependência.

`bun.lock` e `package-lock.json` permanecem até que o gerenciador definitivo seja decidido. Não houve alteração de dependências nesta auditoria.

## Arquivos legados

Foram removidos somente arquivos sem função atual ou futura comprovável:

- `.bolt/mcp.json`
- `src/assets/hero-key-handover.svg`
- `src/assets/gomes-motors-logo.png.asset.json`
- `public/favicon.png`

Foram preservados deliberadamente:

- `.lovable/project.json`, pela integração ainda presente com o ambiente Lovable;
- `src/components/ui`, pela utilidade arquitetural futura;
- `src/lib/lovable-error-reporting.ts`, porque ainda participa do tratamento/telemetria do ambiente Lovable;
- `routeTree.gen.ts`, porque é o artefato gerado pelo TanStack Router e atualmente representa corretamente as rotas validadas;
- locks de dependências, até a definição do fluxo definitivo de pacote.

## SSR / client / server

A fronteira atual foi preservada:

- regras estáticas e helpers ficam em `src/lib`;
- armazenamento de favoritos usa APIs do navegador somente dentro de efeitos/eventos client-side;
- o shell global permanece no `__root.tsx`;
- `src/start.ts` mantém middleware de erro e proteção CSRF para futuras server functions;
- `src/server.ts` mantém a normalização de respostas SSR catastróficas e a página de erro de contingência;
- não foram introduzidas APIs server-side prematuramente.

## Acessibilidade e responsividade

A revisão confirmou labels explícitos nos principais campos, `aria-label`/`aria-pressed` nos controles relevantes, estados de diálogo no filtro móvel, navegação semântica e layouts responsivos nos fluxos públicos.

Permanece como evolução futura a revisão visual detalhada com auditoria de contraste, teclado/foco e testes automatizados de acessibilidade em cada nova interface administrativa. Isso não justifica uma alteração estrutural arriscada na base pública já validada.

## SEO

As rotas públicas possuem títulos e descrições próprios, além de metadados Open Graph/Twitter e `noindex` para veículo inexistente.

Canonical absoluto, sitemap, dados estruturados e domínio definitivo foram mantidos para a fase em que a URL pública final estiver definida. Implementá-los agora com um domínio provisório criaria configuração descartável.

## Performance

- Hero é carregado como imagem principal e recebeu prioridade explícita.
- Imagens de estoque e conteúdo secundário usam `loading="lazy"` quando apropriado.
- Dimensões de imagem estão declaradas nos principais pontos para reduzir mudanças de layout.
- Não foi introduzida biblioteca de performance desnecessária.
- O catálogo atual é pequeno e estático; não há necessidade de otimização prematura de busca ou virtualização.

## Estado final

A auditoria está **encerrada para esta fase**.

O Gomes Motors está em condição de seguir para o próximo módulo sem reconstrução. A base pública foi limpa, os problemas técnicos identificados como seguros de corrigir foram tratados e os pontos que dependem de decisões futuras foram explicitamente preservados.

A próxima etapa é produto, não saneamento: preparar a camada de domínio para persistência e, somente depois, evoluir para D1/R2, autenticação e painel comercial.
