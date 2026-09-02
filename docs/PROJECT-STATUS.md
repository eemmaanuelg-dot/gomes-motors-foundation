# Gomes Motors — Status do Projeto

Data do marco: 02/09/2026

## Marco atual

A versão pública do Gomes Motors foi **fechada como base estável**.

"Fechar" significa congelar esta versão como referência funcional e visual para a próxima fase. Não significa impedir alterações futuras. Bugs, melhorias e novas funcionalidades continuam podendo ser implementados sobre esta base, sempre preservando o que já foi aprovado.

## Fase 5 — Preparação da camada de domínio

**Implementação estrutural concluída; validação final de build e regressão pendente.**

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
**Concluída na camada de leitura pública de veículos.**

Foi criado e adotado:

- `src/application/vehicles/public-catalog.ts`.

As rotas públicas que exibem veículos passaram a carregar seus dados por loaders do TanStack Router e consumir o catálogo público:

- `/`;
- `/estoque`;
- `/estoque/:id`.

A UI existente foi preservada. Busca, filtros, favoritos, ordenação, detalhes, relacionados e ações de WhatsApp continuam na apresentação, enquanto a origem dos dados passou para a fronteira de aplicação.

### 5.5 — Validação arquitetural
**Implementação da validação concluída; aceite final depende do build pós-integração.**

A revisão confirma a separação:

```text
apresentação
    ↓
route loaders
    ↓
public vehicle catalog
    ↓
casos de uso
    ↓
contratos de domínio
    ↓
repositórios
    ↓
dados estáticos de transição
```

Também foram mantidos os critérios de preservação da versão pública: nenhuma reconstrução de UX, identidade ou funcionalidade foi necessária para concluir a integração.

O checklist detalhado está em `docs/DOMAIN-AUDIT-2026-09-02.md`.

Ainda é obrigatório executar o build oficial após estas últimas alterações e repetir a conferência funcional do site público. O build anterior passou após a correção de tipagem, mas não substitui a validação desta nova rodada de integração.

## Próximo marco

Após o build pós-integração e a conferência final:

```text
Fase 5 validada
      ↓
D1 + R2 + server-side
      ↓
autenticação/autorização
      ↓
/admin
```

Nenhuma implementação de autenticação ou `/admin` deve ser iniciada antes desse marco.

## Regra para a evolução

O site público estável é patrimônio do projeto.

Nenhuma nova camada deve exigir a perda de funcionalidades, identidade ou UX já aprovadas. A evolução deve acontecer por extensão da arquitetura, não por reconstrução desnecessária.
