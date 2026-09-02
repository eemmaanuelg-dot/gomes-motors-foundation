# Gomes Motors — Auditoria da camada de domínio e contatos

Data: 02/09/2026

## Escopo

Auditoria realizada após a implementação da preparação da camada de domínio, correção do contato comercial do WhatsApp e integração gradual do catálogo público com os casos de uso e repositórios.

## 1. Camada de domínio

### Contratos fundamentais

- Tipos compartilhados: presentes.
- Entidade e atualização de veículo: presentes.
- Regras de transição de status: presentes.
- Contrato de repositório de veículos: presente.
- Contrato de estoque: presente.

### Repositórios estáticos

- `StaticVehicleRepository`: implementado.
- `StaticInventoryRepository`: implementado.
- Os dados atuais continuam vindo dos seis veículos de demonstração.
- A publicação foi separada do cadastro do veículo por meio do estoque.
- O repositório faz cópias dos dados retornados para evitar mutação acidental do estado interno.

### Casos de uso

Implementados para veículos:

- listar veículos públicos;
- obter veículo público por ID;
- obter veículo por ID;
- criar veículo;
- editar veículo;
- publicar;
- despublicar;
- destacar;
- reservar;
- vender;
- liberar reserva.

Revisão aplicada:

- a venda verifica a existência da entrada de estoque antes de alterar o status do veículo;
- transições de status passam pelas regras centrais do domínio;
- veículo vendido não pode ser publicado nem destacado;
- catálogo público considera simultaneamente status comercial e publicação do estoque;
- os casos de uso aceitam o `DomainErrorCode` completo definido no domínio.

## 2. Contato comercial / WhatsApp

Número comercial oficial do projeto nesta fase:

- formato interno WhatsApp: `5522999908461`;
- formato nacional: `22999908461`;
- exibição: `(22) 99990-8461`;
- telefone: `+55 22 99990-8461`;
- link telefônico: `tel:+5522999908461`.

A correção remove o dígito `9` excedente presente na referência anterior `229999908461`.

O número foi centralizado em `src/lib/contact.ts`.

`src/lib/vehicle-utils.ts` utiliza a mesma constante para gerar os links `wa.me`, preservando os fluxos de WhatsApp de veículos, serviços, cabeçalho e rodapé.

## 3. Integração 5.4 — Catálogo público

A fronteira de aplicação está em `src/application/vehicles/public-catalog.ts`.

As rotas públicas que exibem dados de veículos passaram a consumir o catálogo por meio de loaders do TanStack Router:

- `/` carrega os veículos públicos pelo catálogo e monta a seção de destaques a partir desse resultado;
- `/estoque` carrega a lista pública pelo catálogo e aplica busca, filtros, favoritos e ordenação sobre o resultado;
- `/estoque/:id` carrega o veículo pelo catálogo e obtém os relacionados a partir da mesma coleção pública.

A apresentação não conhece os repositórios concretos. O fluxo agora é:

```text
SITE PÚBLICO
      ↓
ROUTE LOADER
      ↓
PUBLIC VEHICLE CATALOG
      ↓
CASOS DE USO
      ↓
CONTRATOS DO DOMÍNIO
      ↓
REPOSITÓRIOS ESTÁTICOS
      ↓
DADOS DE TRANSIÇÃO
```

Nenhuma alteração de UX, identidade visual ou funcionalidade comercial foi planejada como parte dessa migração.

## 4. Validação arquitetural 5.5

A revisão estrutural confirma:

- separação entre domínio, aplicação, infraestrutura e apresentação;
- rotas públicas sem dependência dos repositórios concretos na camada de apresentação;
- publicação tratada como estado de estoque;
- regras de status concentradas no domínio;
- catálogo público como fronteira única da leitura pública de veículos;
- preparação compatível com futura substituição dos repositórios estáticos por D1;
- ausência de necessidade de alterar o contrato do domínio quando a persistência for introduzida.

## 5. Validação técnica dos cinco blocos

### Bloco 1 — Auditoria de código e arquitetura
**Concluído.**

Os contratos, regras, repositórios, casos de uso, catálogo público, fonte estática de transição e centralização do WhatsApp foram conferidos diretamente na base atual.

### Bloco 2 — Build oficial
**Concluído com sucesso.**

No commit `e12c5fd358a0c98dbd3404464f8db24dbb85f962`, o check `build` do GitHub Actions terminou com `status: completed` e `conclusion: success`. O pipeline executa `npm ci` e `npm run build`; o script de build executa `vite build` e `tsc --noEmit`.

### Bloco 3 — Deploy / publicação
**Concluído tecnicamente.**

Os checks do Cloudflare Workers associados ao mesmo commit terminaram com `success`, registrando builds dos serviços `gomes-motors-foundation` e `gomes-motors-foundation1`. Isso confirma a integração de publicação automática do ambiente Cloudflare.

### Bloco 4 — Regressão funcional
**Revisão técnica concluída; validação manual pendente.**

Os fluxos públicos foram conferidos estruturalmente após a integração. A validação de interação no ambiente publicado — navegação, busca, filtros, favoritos, detalhes, ações comerciais e WhatsApp — depende do teste manual no navegador.

### Bloco 5 — Responsividade
**Revisão estrutural concluída; validação visual manual pendente.**

A implementação mantém as classes e estruturas responsivas da base pública. A confirmação visual final em desktop, tablet e mobile depende de observação no ambiente publicado.

## Checklist de aceitação

- [x] contratos fundamentais;
- [x] repositórios estáticos;
- [x] casos de uso;
- [x] catálogo público;
- [x] integração da Home;
- [x] integração do Estoque;
- [x] integração do detalhe de veículo;
- [x] correção centralizada do WhatsApp;
- [x] auditoria estrutural;
- [x] build oficial pós-integração;
- [x] publicação automatizada validada;
- [ ] teste funcional manual final;
- [ ] confirmação visual final de desktop/mobile.

## Estado de aceite

A parte técnica do desenvolvimento está fechada para a rodada atual. A Fase 5 somente deve ser marcada como **aprovada** após o teste manual do usuário.

```text
feito tecnicamente ≠ validado manualmente ≠ aprovado
```

## 6. Próximo marco

Depois do teste manual e do aceite desta fase:

```text
Fase 5 aprovada
        ↓
D1 + R2 + server-side
        ↓
autenticação/autorização
        ↓
/admin
```

Nenhuma implementação de autenticação ou `/admin` deve ser iniciada antes desse marco.
