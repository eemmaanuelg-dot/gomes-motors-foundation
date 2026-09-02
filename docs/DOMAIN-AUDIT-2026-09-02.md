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

- a venda agora verifica a existência da entrada de estoque antes de alterar o status do veículo, evitando deixar o veículo como vendido quando a estrutura de estoque necessária não existe;
- transições de status continuam passando pelas regras centrais do domínio;
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

A adoção dos loaders segue o mecanismo oficial do TanStack Router para carregar dados antes da renderização e consumi-los por `Route.useLoaderData()`. citeturn1search0turn1search3

Nenhuma alteração de UX, identidade visual ou funcionalidade comercial foi planejada como parte dessa migração.

## 4. Validação arquitetural 5.5

A revisão estrutural confirma:

- separação entre domínio, aplicação, infraestrutura e apresentação;
- rotas públicas sem dependência dos repositórios concretos;
- publicação tratada como estado de estoque;
- regras de status concentradas no domínio;
- catálogo público como fronteira única da leitura pública de veículos;
- preparação compatível com futura substituição dos repositórios estáticos por D1;
- ausência de necessidade de alterar o contrato do domínio quando a persistência for introduzida.

O build anterior do projeto foi executado após a correção de tipagem dos casos de uso e aprovado pelo ambiente de deploy. As novas alterações de integração desta rodada ainda precisam passar pelo mesmo build final do ambiente do projeto.

### Checklist final de aceitação

- [x] contratos fundamentais;
- [x] repositórios estáticos;
- [x] casos de uso;
- [x] catálogo público;
- [x] integração da Home;
- [x] integração do Estoque;
- [x] integração do detalhe de veículo;
- [x] correção centralizada do WhatsApp;
- [ ] `npm run build` após a integração 5.4;
- [ ] teste funcional final após o novo deploy;
- [ ] confirmação final de desktop/mobile após o novo deploy.

O build oficial continua sendo:

```text
npm run build
```

que executa `vite build` e `tsc --noEmit`.

## 5. Próximo marco

Depois que o build final e a conferência funcional desta integração forem aprovados:

```text
5.5 Validação arquitetural
        ↓
Fase 5 concluída
        ↓
D1 + R2 + server-side
        ↓
autenticação/autorização
        ↓
/admin
```

Nenhuma implementação de autenticação ou `/admin` deve ser iniciada antes desse marco.
