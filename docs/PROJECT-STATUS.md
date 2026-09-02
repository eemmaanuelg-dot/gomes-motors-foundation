# Gomes Motors — Status do Projeto

Data do marco: 02/09/2026

## Marco atual

A versão pública do Gomes Motors foi **fechada como base estável**.

"Fechar" significa congelar esta versão como referência funcional e visual para a próxima fase. Não significa impedir alterações futuras. Bugs, melhorias e novas funcionalidades continuam podendo ser implementados sobre esta base, sempre preservando o que já foi aprovado.

## Fase 5 — Preparação da camada de domínio

**Implementação estrutural concluída e validação técnica executada.**

A fase foi construída antes de D1, R2, autenticação e `/admin`, preservando o site público como patrimônio estável.

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
**Concluída tecnicamente.**

A revisão confirmou a separação:

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

## Fechamento técnico — 5 blocos

### Bloco 1 — Auditoria de código e arquitetura
**Concluído.**

Foram conferidos os contratos do domínio, regras de status, repositórios, casos de uso, catálogo público, fonte estática de transição e centralização do contato comercial. Não foi identificada necessidade de reconstrução do site público.

### Bloco 2 — Build oficial
**Concluído com sucesso.**

O workflow `build` do GitHub Actions executou `npm ci` e `npm run build` no commit `e12c5fd358a0c98dbd3404464f8db24dbb85f962` e terminou com `success` em 02/09/2026. O build executa `vite build` e `tsc --noEmit`.

### Bloco 3 — Deploy / publicação
**Concluído tecnicamente.**

Os checks do Cloudflare Workers para o commit `e12c5fd358a0c98dbd3404464f8db24dbb85f962` terminaram com `success`, confirmando a publicação automatizada pela integração do projeto. A validação registrada inclui os serviços `gomes-motors-foundation` e `gomes-motors-foundation1`.

### Bloco 4 — Regressão funcional
**Revisão técnica concluída; validação manual pendente.**

O código e os fluxos foram conferidos após a integração, sem alteração intencional da UX aprovada. A validação real de navegação, filtros, favoritos, detalhes, links e WhatsApp no ambiente publicado ainda depende do teste manual do usuário.

### Bloco 5 — Responsividade
**Revisão estrutural concluída; validação visual manual pendente.**

A implementação existente mantém os comportamentos responsivos definidos na base pública. A confirmação final em desktop, tablet e mobile precisa ser feita no ambiente publicado, pois essa etapa depende da observação visual real.

## Estado de aceite

**A parte técnica sob responsabilidade do desenvolvimento está fechada. A Fase 5 ainda não deve ser marcada como definitivamente aprovada até o teste manual do usuário.**

Não confundir:

```text
feito tecnicamente ≠ validado manualmente ≠ aprovado
```

## Próximo marco

Após o teste manual e o aceite da Fase 5:

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

## Regra para a evolução

O site público estável é patrimônio do projeto.

Nenhuma nova camada deve exigir a perda de funcionalidades, identidade ou UX já aprovadas. A evolução deve acontecer por extensão da arquitetura, não por reconstrução desnecessária.

## Recuperação da base funcional — 02/09/2026

A branch `main` foi restaurada para o commit funcional `91171da5514dc7675faa6007618e255f5e8ae826`, correspondente à última base funcional confirmada antes da sequência de alterações que introduziu falhas nas Server Functions. Este registro existe apenas para documentar a recuperação e disparar uma nova publicação da `main`; nenhuma alteração de código da aplicação foi realizada nesta recuperação.
