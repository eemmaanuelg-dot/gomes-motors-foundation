# Gomes Motors — Auditoria Técnica

Data: 02/09/2026

## Resultado

A auditoria foi realizada sobre a estrutura atual da branch `main`, que permanece como fonte de verdade do projeto. O objetivo desta etapa foi corrigir problemas reais, alinhar a base para crescimento e remover artefatos comprovadamente obsoletos, sem desmontar funcionalidades aprovadas.

## Correções aplicadas

- O script `build` passou a executar `tsc --noEmit` depois do build Vite, fazendo a compilação validar também o TypeScript.
- A página de Contato deixou de manter uma constante de WhatsApp duplicada; o número continua centralizado no utilitário de domínio.
- A página de erro SSR foi localizada em português e alinhada visualmente à identidade Gomes Motors, mantendo dependência mínima para funcionar mesmo quando o React não consegue renderizar.
- O README foi atualizado para representar o estado real do projeto e sua arquitetura atual.
- Foi removido o artefato `hero-key-handover.svg`, que não possui referência ativa e representa uma direção visual descartada.
- Foi removido `src/assets/gomes-motors-logo.png.asset.json`, metadata de um asset antigo do editor que não é consumido pela aplicação atual.
- Foi removido `.bolt/mcp.json`, configuração legada do Bolt que não participa do runtime, build ou fluxo atual do projeto.
- Nenhuma funcionalidade pública aprovada foi removida.
- Nenhum deploy foi realizado no Cloudflare durante esta revisão.

## Arquitetura preservada

- React + TypeScript.
- TanStack Start.
- TanStack Router com file-based routing.
- `src/routes/__root.tsx` como shell global.
- `src/components/site` para componentes compartilhados.
- `src/data` para os dados estáticos atuais.
- `src/lib` para regras de domínio e utilitários.
- Tailwind CSS v4.
- Vite.
- Cloudflare Workers.

## Funcionalidades protegidas

- Home comercial/institucional.
- Header e Footer globais.
- Logo e identidade visual.
- Estoque de carros e motos.
- Busca, filtros, ordenação e estados vazios.
- Favoritos persistentes no navegador.
- Página de detalhes dinâmica.
- Galeria e ficha técnica.
- Simulador demonstrativo de financiamento.
- Fluxos Comprar, Vender, Trocar, Consignar e Financiar.
- Seletor de intenção Comprar/Trocar/Financiar no detalhe do veículo.
- WhatsApp comercial.
- Sobre nós.
- Contato.
- SEO existente e metadados das rotas.
- Tratamento de erros SSR/runtime.

## Pontos técnicos que não devem ser considerados “limpeza”

### `src/components/ui`

Há um conjunto de componentes Radix/shadcn que atualmente não aparece como parte principal da interface pública. Eles não foram apagados porque formam uma biblioteca de infraestrutura útil para a futura área administrativa e para componentes de interação mais complexos. Remover agora criaria retrabalho sem ganho comprovado.

### `.lovable/project.json`

Foi preservado porque identifica o template e a integração do projeto com o ambiente Lovable.

### `routeTree.gen.ts`

É tratado como artefato gerado pelo TanStack Router. A estrutura atual contém uma solução específica de rota dinâmica que foi necessária para o funcionamento já validado do detalhe de veículo. Não será reestruturada durante uma limpeza cega.

### `bun.lock` e `package-lock.json`

Ambos permanecem porque fazem parte do histórico de ferramentas do projeto e a limpeza de gerenciadores de pacote precisa ser feita somente depois de confirmar o fluxo definitivo de instalação/build. O `package.json` e o `package-lock.json` continuam alinhados quanto às dependências declaradas; alterações de dependências não fazem parte desta etapa.

## Pontos que foram deliberadamente mantidos para o futuro

- Modelo estático de veículos como contrato inicial.
- Componentes UI disponíveis para evolução.
- Tratamento de erros do runtime.
- Estrutura server-side do TanStack Start.
- Configuração Cloudflare.
- Sistema visual centralizado.
- Helpers de WhatsApp e domínio de veículos.

A regra é: manter aquilo que tem valor arquitetural futuro e eliminar aquilo que é comprovadamente legado, abandonado ou sem função.

## Estado final esperado desta etapa

O projeto deve ser considerado uma **base pública estabilizada**, não ainda uma aplicação administrativa.

A próxima etapa de produto deverá nascer sobre esta base, sem reconstruí-la: primeiro preparar a camada de domínio; depois persistência; depois autenticação; depois painel comercial; depois estoque administrativo e CRM.
