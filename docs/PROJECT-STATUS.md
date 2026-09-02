# Gomes Motors — Status do Projeto

Data do marco: 02/09/2026

## Marco atual

A versão pública do Gomes Motors foi **fechada como base estável**.

"Fechar" significa congelar esta versão como referência funcional e visual para a próxima fase. Não significa impedir alterações futuras. Bugs, melhorias e novas funcionalidades continuam podendo ser implementados sobre esta base, sempre preservando o que já foi aprovado.

## Fase 5 — Preparação da camada de domínio

**Etapas estruturais implementadas; validação final pendente.**

A fase está sendo construída antes de D1, R2, autenticação e `/admin`, preservando o site público como patrimônio estável.

### 5.1 — Contratos fundamentais
**Concluída.**

- tipos compartilhados;
- entidade e tipos de veículos;
- regras de transição de status;
- contrato de repositório de veículos;
- tipos e contrato inicial de estoque;
- contratos dos demais módulos previstos para evolução futura.

### 5.2 — Repositórios estáticos
**Concluída para veículos e estoque.**

Implementações atuais:

- `src/infrastructure/repositories/static/vehicle-repository.ts`;
- `src/infrastructure/repositories/static/inventory-repository.ts`.

Os seis veículos atuais continuam sendo a fonte estática de transição. A publicação foi separada em uma entrada de estoque, preparando a substituição futura por D1 sem alterar o contrato de domínio.

### 5.3 — Casos de uso
**Concluída para o primeiro conjunto de operações de veículos.**

Arquivo:

- `src/application/vehicles/use-cases.ts`.

Operações estruturadas:

- listar veículos públicos;
- obter veículo público por ID;
- obter veículo por ID;
- criar veículo;
- editar veículo;
- publicar/despublicar;
- destacar;
- reservar;
- vender;
- liberar reserva.

As transições passam pelas regras centrais do domínio, e publicação permanece separada do cadastro do veículo.

### 5.4 — Integração gradual com o site público
**Fronteira de aplicação criada; migração das rotas públicas ainda pendente de validação.**

Foi criado:

- `src/application/vehicles/public-catalog.ts`.

Esse arquivo é o ponto único para o catálogo público e impede que uma futura troca de repositório exija conhecimento da infraestrutura nas rotas.

A migração visual/funcional das rotas `/estoque` e `/estoque/:id` deve ser feita de forma controlada, porque essas páginas já estão aprovadas e não devem sofrer alteração de UX durante a preparação arquitetural.

### 5.5 — Validação arquitetural
**Pendente.**

Antes de considerar a Fase 5 encerrada, é obrigatório validar:

- `npm run build`;
- TypeScript sem erros;
- rotas públicas;
- estoque e filtros;
- detalhe de veículo;
- favoritos;
- WhatsApp;
- navegação;
- comportamento desktop/mobile;
- ausência de regressões visuais e funcionais;
- separação entre domínio, aplicação, infraestrutura e apresentação.

Não considerar a fase validada apenas porque os arquivos foram criados. O build e o teste funcional são o critério de encerramento.

## Estrutura atual relevante

```text
src/
├── domain/
│   ├── shared/
│   ├── vehicles/
│   ├── inventory/
│   ├── leads/
│   ├── evaluations/
│   ├── financing/
│   └── customers/
│
├── application/
│   └── vehicles/
│       ├── use-cases.ts
│       └── public-catalog.ts
│
├── infrastructure/
│   └── repositories/
│       └── static/
│           ├── vehicle-repository.ts
│           └── inventory-repository.ts
│
├── data/
│   └── vehicles.ts
│
├── routes/
├── components/
└── lib/
```

## Próximo marco

O próximo passo é **validar a implementação e então concluir a integração gradual das rotas públicas**, sem redesenhar o site.

Somente depois de a validação passar a sequência continua para:

```text
Fase 5 validada
      ↓
D1 + R2 + server-side
      ↓
autenticação/autorização
      ↓
/admin
```

## Regra para a evolução

O site público estável é patrimônio do projeto.

Nenhuma nova camada deve exigir a perda de funcionalidades, identidade ou UX já aprovadas. A evolução deve acontecer por extensão da arquitetura, não por reconstrução desnecessária.
