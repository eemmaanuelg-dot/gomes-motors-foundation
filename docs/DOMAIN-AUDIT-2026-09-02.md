# Gomes Motors — Auditoria da camada de domínio e contatos

Data: 02/09/2026

## Escopo

Auditoria realizada após a implementação inicial da preparação da camada de domínio e correção do contato comercial do WhatsApp.

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

- a venda agora verifica a existência da entrada de estoque antes de alterar o status do veículo, evitando deixar o veículo como vendido quando a estrutura de estoque necessária não existe.
- transições de status continuam passando pelas regras centrais do domínio.
- veículo vendido não pode ser publicado nem destacado.
- catálogo público considera simultaneamente status comercial e publicação do estoque.

## 2. Contato comercial / WhatsApp

Número comercial oficial do projeto nesta fase:

- formato interno WhatsApp: `5522999908461`;
- formato nacional: `22999908461`;
- exibição: `(22) 99990-8461`;
- telefone: `+55 22 99990-8461`;
- link telefônico: `tel:+5522999908461`.

A correção remove o dígito `9` excedente presente na referência anterior `229999908461`.

O número foi centralizado em `src/lib/contact.ts`.

`src/lib/vehicle-utils.ts` utiliza a mesma constante para gerar todos os links `wa.me`, preservando os fluxos de WhatsApp de veículos, serviços, cabeçalho e rodapé.

A página de contato e a Home também passaram a utilizar as constantes centralizadas para a exibição e ligação telefônica.

## 3. Superfícies auditadas

Foram conferidos os principais pontos de contato conhecidos da aplicação:

- `src/lib/vehicle-utils.ts`;
- `src/lib/contact.ts`;
- `src/routes/contato.tsx`;
- `src/routes/index.tsx`;
- `src/components/site/Header.tsx`;
- `src/components/site/Footer.tsx`;
- fluxos de serviços que utilizam `criarWhatsAppUrl`.

Header, Footer e fluxos de veículos/serviços dependem da função centralizada de geração de URL, evitando números duplicados nesses pontos.

## 4. Critérios para teste

### Domínio

- listar somente veículos publicados e não vendidos;
- obter veículo público existente;
- rejeitar veículo público inexistente;
- publicar veículo;
- despublicar veículo;
- destacar veículo disponível;
- rejeitar destaque de vendido;
- reservar veículo disponível;
- liberar reserva;
- vender veículo e retirar publicação;
- rejeitar transição inválida;
- rejeitar venda sem entrada de estoque.

### Público

- `/` continua exibindo os veículos de destaque;
- `/estoque` continua listando e filtrando os veículos;
- `/estoque/:id` continua abrindo o detalhe;
- favoritos continuam funcionando;
- botões de WhatsApp continuam abrindo conversa contextualizada;
- serviços continuam gerando mensagens contextualizadas;
- contato exibe `(22) 99990-8461`;
- telefone utiliza `tel:+5522999908461`.

## 5. Validação pendente

A revisão estrutural foi concluída, mas a validação final ainda depende da execução do build/teste no ambiente do projeto.

Comando oficial de build:

```text
npm run build
```

Esse comando executa `vite build` e `tsc --noEmit`.

Não considerar a Fase 5.5 concluída até que o build e os testes funcionais do site público sejam executados e aprovados.

## 6. Próximo marco

Após a validação:

```text
5.5 Validação arquitetural
        ↓
Fase 5 concluída
        ↓
D1 + R2 + server-side
```

Nenhuma implementação de autenticação ou `/admin` deve ser iniciada antes desse marco.
