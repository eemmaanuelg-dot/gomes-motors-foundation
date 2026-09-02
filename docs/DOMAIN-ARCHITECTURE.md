# Gomes Motors — Planta da Camada de Domínio

Data de início: 02/09/2026
Fase: 5 — Preparação da camada de domínio
Status: arquitetura definida; implementação ainda não iniciada

## 1. Objetivo

A camada de domínio será a camada central das regras de negócio do Gomes Motors. Ela deve permitir que o mesmo domínio seja utilizado pelo site público e, futuramente, pelo Painel Comercial, sem acoplar as regras de negócio à interface, ao banco de dados ou ao provedor de armazenamento.

A arquitetura deve suportar a evolução atual:

```text
Site público
     ↓
Aplicação / serviços
     ↓
Domínio Gomes Motors
     ↓
Fonte de dados
```

E a arquitetura futura:

```text
                    ┌── Site público
                    │
                    ▼
              ┌─────────────┐
              │   DOMÍNIO   │
              │ Gomes Motors│
              └──────┬──────┘
                     │
              ┌──────┴──────┐
              ▼             ▼
             D1             R2
              ▲
              │
        Painel Administrativo
```

## 2. Princípios arquiteturais

1. O domínio não conhece React, componentes visuais ou rotas.
2. O domínio não depende diretamente de D1, R2 ou outro banco/armazenamento.
3. Regras comerciais importantes ficam centralizadas.
4. Tipos de domínio devem ser compartilhados entre apresentação, serviços e persistência quando necessário.
5. A fonte de dados pode começar estática e depois ser substituída por D1 sem alterar a regra de negócio.
6. Operações que alteram dados reais devem passar por uma camada server-side quando a persistência existir.
7. O site público continuará sendo tratado como patrimônio estável.
8. Não criar abstrações genéricas sem necessidade real.
9. Cada módulo deve representar uma área real do negócio Gomes Motors.
10. Toda mudança estrutural deve preservar retrocompatibilidade com a experiência pública aprovada.

## 3. Bounded contexts / módulos do domínio

### 3.1 Veículos

Responsável pelo conceito de veículo e suas informações comerciais e técnicas.

Abrange:

- identificação;
- categoria carro/moto;
- marca, modelo e versão;
- ano e quilometragem;
- preço;
- câmbio, combustível e cilindrada;
- descrição;
- equipamentos;
- ficha técnica;
- status comercial;
- destaque;
- condições indicativas de financiamento;
- imagens e referências de mídia;
- informações necessárias para SEO público.

Estados comerciais previstos:

```text
DISPONÍVEL
    ↓
RESERVADO
    ↓
VENDIDO
```

As transições devem ser controladas pelo domínio quando o estoque passar a ser persistente.

### 3.2 Estoque

Responsável pelo ciclo comercial do veículo dentro da loja.

Deve futuramente controlar:

- publicação/despublicação;
- disponível/reservado/vendido;
- destaque;
- preço;
- quilometragem;
- ordem de apresentação;
- entrada e saída do estoque;
- histórico de alterações relevantes;
- associação com fotos;
- preview público.

O estoque utiliza veículos, mas não deve duplicar a definição de veículo.

### 3.3 Leads / Atendimento

Representa o interesse comercial iniciado por um cliente.

Tipos atuais e futuros:

- comprar;
- trocar;
- financiar;
- vender veículo;
- consignar;
- contato geral.

Estados previstos:

```text
NOVO
  ↓
EM ATENDIMENTO
  ↓
AGUARDANDO CLIENTE
  ↓
PROPOSTA ENVIADA
  ↓
NEGOCIAÇÃO
  ↓
CONVERTIDO

ou

PERDIDO
```

O domínio deve permitir registrar origem, veículo relacionado, dados do cliente, responsável pelo atendimento, observações e histórico de status.

### 3.4 Avaliações

Responsável pelas solicitações de:

- venda;
- troca;
- consignação.

Deve separar a solicitação do cliente da decisão interna de avaliação.

Futuro fluxo:

```text
Solicitação
    ↓
Análise
    ↓
Avaliação
    ↓
Decisão
    ├── aprovada
    ├── recusada
    └── aguardando informação
```

### 3.5 Financiamento

Responsável por separar a simulação pública da futura operação comercial.

No público:

- simulação educativa;
- entrada;
- parcelas;
- taxa indicativa;
- veículo escolhido.

No painel:

- proposta real;
- cliente;
- veículo;
- entrada;
- prazo;
- condições recebidas;
- status da proposta;
- observações do atendimento.

A simulação pública não deve ser tratada automaticamente como proposta financeira real.

### 3.6 Clientes / Pessoas

Módulo futuro para representar clientes e contatos sem espalhar dados pessoais por cada fluxo.

Deve permitir, conforme a necessidade real:

- nome;
- telefone;
- WhatsApp;
- e-mail;
- observações;
- identificação de origem do contato;
- histórico de relacionamentos comerciais.

Dados pessoais não devem ser duplicados desnecessariamente em cada entidade.

### 3.7 Usuários internos e autorização

Módulo futuro associado ao painel administrativo.

Responsável por:

- usuário interno;
- perfil/permissão;
- autenticação;
- autorização de ações;
- identificação de responsável por alterações.

A autorização deve ser aplicada no servidor, não apenas escondendo botões no frontend.

## 4. Relações principais

```text
CLIENTE
   │
   ├──── cria ────► LEAD
   │                  │
   │                  ├──── relaciona ───► VEÍCULO
   │                  │
   │                  └──── pode gerar ──► NEGOCIAÇÃO
   │
   ├──── solicita ──► AVALIAÇÃO
   │
   └──── participa ─► FINANCIAMENTO

VEÍCULO
   │
   ├──── pertence ao ───► ESTOQUE
   ├──── possui ────────► MÍDIAS/FOTOS
   ├──── pode gerar ────► LEAD
   ├──── pode participar ► AVALIAÇÃO
   └──── pode participar ► FINANCIAMENTO
```

## 5. Entidades e identificadores

Toda entidade persistente deverá possuir identificador estável próprio.

Preferência arquitetural:

- IDs opacos/estáveis;
- nunca usar índice de array como identidade;
- URLs públicas continuam usando o ID do veículo;
- referências entre entidades usam IDs, não objetos duplicados.

Exemplo conceitual:

```ts
Veiculo {
  id: string
}

Lead {
  id: string
  clienteId: string
  veiculoId?: string
}
```

## 6. Value Objects e regras

Quando um conceito possuir validação ou significado próprio, ele poderá ser representado por um tipo dedicado.

Exemplos:

- Money / valor monetário;
- VehicleStatus;
- LeadStatus;
- LeadType;
- Phone;
- Email;
- VehicleCategory;
- FinancingTerms.

Não transformar toda string em um objeto apenas por formalidade. A regra é criar tipos dedicados quando isso reduzir ambiguidade ou centralizar validação.

## 7. Casos de uso

O domínio deverá ser consumido por casos de uso/serviços explícitos quando a operação envolver regra de negócio.

Primeiro conjunto planejado:

### Veículos

- listar veículos públicos;
- obter veículo por ID;
- criar veículo;
- editar veículo;
- publicar veículo;
- despublicar veículo;
- destacar veículo;
- reservar veículo;
- marcar veículo como vendido;
- liberar reserva.

### Leads

- criar lead;
- listar leads;
- obter lead;
- alterar status;
- atribuir responsável;
- registrar observação;
- registrar histórico.

### Avaliações

- criar solicitação;
- analisar solicitação;
- registrar avaliação;
- aprovar/recusar;
- registrar observação.

### Financiamento

- simular financiamento;
- criar proposta;
- atualizar status;
- registrar condições;
- registrar observação.

## 8. Contratos de repositório

O domínio/aplicação não deve depender de uma implementação específica de banco.

Conceito:

```ts
interface VeiculoRepository {
  listarPublicados(): Promise<Veiculo[]>;
  obterPorId(id: string): Promise<Veiculo | null>;
  criar(veiculo: Veiculo): Promise<Veiculo>;
  atualizar(id: string, dados: AtualizacaoVeiculo): Promise<Veiculo>;
}
```

Implementações futuras:

```text
VeiculoRepository
      │
      ├── StaticVeiculoRepository   ← fase de transição/testes
      │
      └── D1VeiculoRepository       ← persistência real
```

O site público deve consumir uma interface estável, não conhecer diretamente a implementação.

## 9. Fonte estática atual

Os seis veículos de demonstração em `src/data/vehicles.ts` continuam sendo a fonte atual durante a preparação do domínio.

Não migrar para D1 nesta etapa.

Primeiro objetivo:

```text
vehicles.ts
     ↓
adaptador/repositório estático
     ↓
contrato de domínio
     ↓
site público
```

Depois:

```text
D1
 ↓
repositório D1
 ↓
mesmo contrato
 ↓
mesmo domínio
 ↓
site público + painel
```

## 10. Server-side e segurança futura

Quando D1/R2 e operações administrativas forem introduzidos:

```text
Browser
  ↓
TanStack Start / server boundary
  ↓
caso de uso
  ↓
domínio
  ↓
repository
  ↓
D1 / R2
```

O browser não deverá possuir acesso direto às credenciais ou operações privilegiadas.

A camada de domínio não deve ser usada como mecanismo de segurança. Autenticação e autorização pertencem à camada server-side, embora as operações de domínio devam validar regras de negócio.

## 11. R2 e mídia

Fotos de veículos não devem ser tratadas como parte do registro textual principal do veículo.

Futuro:

```text
Veículo
   │
   └── mídia
        ├── imagem principal
        ├── galeria
        ├── ordem
        ├── alt text
        └── chave do objeto no R2
```

D1 guarda metadados e referências; R2 guarda os arquivos.

## 12. Separação entre público e administrativo

O domínio será compartilhado; a apresentação não.

```text
                 DOMÍNIO
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     SITE PÚBLICO          /admin
          │                   │
      experiência         operação
      comercial           interna
```

O site público não deve conhecer detalhes internos desnecessários.

O painel administrativo poderá acessar operações que não existem no público.

## 13. Estrutura de diretórios planejada

A estrutura final será evolutiva. Uma proposta inicial:

```text
src/
├── domain/
│   ├── vehicles/
│   │   ├── types.ts
│   │   ├── rules.ts
│   │   ├── repository.ts
│   │   └── use-cases.ts
│   │
│   ├── inventory/
│   │   ├── types.ts
│   │   ├── rules.ts
│   │   └── use-cases.ts
│   │
│   ├── leads/
│   │   ├── types.ts
│   │   ├── rules.ts
│   │   └── use-cases.ts
│   │
│   ├── evaluations/
│   │   ├── types.ts
│   │   ├── rules.ts
│   │   └── use-cases.ts
│   │
│   ├── financing/
│   │   ├── types.ts
│   │   ├── rules.ts
│   │   └── use-cases.ts
│   │
│   ├── customers/
│   │   └── types.ts
│   │
│   └── shared/
│       ├── money.ts
│       ├── pagination.ts
│       └── errors.ts
│
├── application/
│   ├── vehicles/
│   ├── leads/
│   ├── evaluations/
│   └── financing/
│
├── infrastructure/
│   ├── repositories/
│   │   ├── static/
│   │   └── d1/
│   └── storage/
│       └── r2/
│
├── routes/
├── components/
├── data/
└── lib/
```

Essa é uma planta, não uma ordem para criar dezenas de arquivos imediatamente. A implementação será incremental.

## 14. O que NÃO será feito nesta primeira etapa

- não criar D1 ainda;
- não criar R2 ainda;
- não criar login ainda;
- não criar `/admin` ainda;
- não reescrever todas as rotas públicas;
- não substituir `vehicles.ts` de uma vez;
- não alterar UX aprovada;
- não refatorar componentes monolíticos sem necessidade;
- não adicionar dependências apenas para implementar a arquitetura.

## 15. Sequência oficial da Fase 5

### Etapa 5.1 — Contratos fundamentais

Definir tipos e regras centrais de veículos, estoque, leads, avaliações e financiamento.

### Etapa 5.2 — Repositório estático

Criar uma implementação que leia os seis veículos atuais através do contrato definido, mantendo o comportamento público.

### Etapa 5.3 — Casos de uso

Extrair operações que representam ações reais do negócio, evitando colocar regras diretamente nas rotas.

### Etapa 5.4 — Integração gradual com o site público

Migrar somente os pontos seguros do site para consumir os contratos, validando que a UX permanece idêntica.

### Etapa 5.5 — Validação arquitetural

Verificar:

- TypeScript;
- build;
- rotas públicas;
- estoque;
- detalhe;
- favoritos;
- fluxos comerciais;
- WhatsApp;
- ausência de regressões.

Somente após essa validação a Fase 5 estará preparada para receber a persistência real.

## 16. Próxima fase depois do domínio

```text
Fase 5 — Domínio
       ↓
Fase 6 — Persistência
       ├── D1
       ├── R2
       └── server-side
       ↓
Fase 7 — Autenticação e autorização
       ↓
Fase 8 — Painel Comercial
       ├── Dashboard
       ├── Estoque
       ├── Leads
       ├── Avaliações
       └── Financiamentos
```

## 17. Critério de sucesso da Fase 5

A fase será considerada concluída quando:

- as regras principais do negócio estiverem fora das páginas;
- os contratos de domínio estiverem definidos;
- o site público conseguir continuar funcionando com a fonte estática através desses contratos;
- a arquitetura permitir uma futura implementação D1 sem reescrever o domínio;
- o futuro painel administrativo puder reutilizar os mesmos casos de uso;
- nenhuma funcionalidade pública aprovada for perdida;
- TypeScript e build permanecerem válidos.

## 18. Regra-mestra

O Gomes Motors não será reconstruído para ganhar backend.

O backend e o painel serão adicionados sobre uma base pública já validada, utilizando o domínio como eixo central.

```text
SITE PÚBLICO ESTÁVEL
          ↓
       DOMÍNIO
          ↓
   PERSISTÊNCIA REAL
          ↓
   PAINEL COMERCIAL
```

O domínio é a ponte entre o que já funciona e o sistema que o Gomes Motors poderá se tornar.
