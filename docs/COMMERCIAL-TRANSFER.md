# 7.7 — Preparação para Transferência Comercial

## Objetivo

O Gomes Motors é tratado como uma solução comercializável, replicável e transferível para concessionárias. A Gomes Motors é a implementação de referência/demo; o produto não deve depender permanentemente da identidade ou da infraestrutura de uma única empresa.

## 7.7.1 — Auditoria de arquitetura

- GitHub `main` é a fonte de verdade do código.
- Worker é configurado declarativamente e pode ser recriado em outra conta.
- D1 usa binding e migrations versionadas em `db/migrations`.
- R2 é acessado por bindings e poderá ser recriado em outra conta.
- Cloudflare Access protege a área administrativa e não contém regra de negócio.
- Domínio de produção é substituível.
- Credenciais e secrets não devem ser gravados no repositório.

## 7.7.2 — Separação Produto × Cliente

### Produto

- aplicação React/TanStack Start;
- layout e componentes;
- regras de negócio;
- estoque administrativo;
- simulador;
- auditoria;
- persistência e integrações.

### Cliente

- nome e razão/nome comercial;
- logo e marca;
- telefone/WhatsApp;
- e-mail;
- endereço e localização;
- redes sociais;
- domínio;
- usuários administrativos;
- veículos, preços, fotos e demais dados comerciais.

A identidade e os principais dados operacionais ficam centralizados em `src/config/dealership.ts`.

## 7.7.3 — Auditoria de marca

A identidade comercial não deve ser espalhada pelo código. Componentes que exibem nome, contato, localização ou horário devem consumir a configuração central quando esses valores forem específicos do cliente.

A logo visual atual permanece como patrimônio da implementação de referência. Em uma venda, o asset de marca poderá ser substituído sem alterar a estrutura da aplicação.

## 7.7.4 — Auditoria de dados

```text
PRODUTO
  código + regras + interface + funcionalidades

CONFIGURAÇÃO DO CLIENTE
  identidade + contato + localização + canais + horário + domínio

DADOS
  veículos + preços + status + mídia + histórico + auditoria
```

O catálogo usa D1 como fonte persistente configurável. O seed `0003_seed_demo_vehicles.sql` representa conteúdo de demonstração e não deve ser confundido com dados definitivos de um cliente.

## 7.7.5 — Configuração comercial

O ponto principal de configuração é `src/config/dealership.ts`.

Alterações de instalação devem ser concentradas ali sempre que possível:

- nome da empresa;
- nome legal/comercial;
- slogan;
- WhatsApp e telefone;
- e-mail;
- cidade, estado, país e endereço;
- Instagram e Facebook;
- domínio;
- horário de atendimento;
- referências dos assets de marca.

O objetivo é permitir a troca de identidade comercial sem reescrever as funcionalidades do produto.

## 7.7.6 — Documentação de instalação

A transferência deve ser executável por documentação versionada no próprio projeto:

- `DEPLOYMENT_MANIFEST.md` — visão mestre;
- `docs/INSTALACAO.md` — instalação de nova unidade;
- `docs/MIGRACAO.md` — mudança de ambiente/conta;
- `docs/BACKUP.md` — preservação de dados e infraestrutura;
- `docs/RESTAURACAO.md` — reconstrução a partir de backup.

Esses documentos tratam instalação, D1, R2, Access, domínio, configuração, deploy, backup, restauração e validação.

## 7.7.7 — Auditoria de transferência

A instalação de referência deve ser considerada transferível quando for possível:

1. criar uma nova conta Cloudflare do cliente;
2. recriar Worker, D1, R2 e Access;
3. aplicar migrations e importar dados;
4. migrar as mídias;
5. trocar identidade e dados comerciais;
6. conectar outro domínio;
7. executar o deploy;
8. validar site público e `/admin`;
9. manter o desenvolvedor apenas como membro autorizado, sem compartilhar credenciais pessoais.

### Matriz de dependências

| Recurso | Pertence ao produto | Pertence à instalação |
| --- | --- | --- |
| Código-fonte | Sim | Não |
| Layout/funcionalidades | Sim | Não |
| Configuração comercial | Não | Sim |
| Veículos/preços | Não | Sim |
| D1 | Não | Sim |
| R2 | Não | Sim |
| Worker | Não | Sim |
| Access | Não | Sim |
| Domínio | Não | Sim |
| Credenciais | Não | Sim, fora do repositório |

## Critério final de aceite

A 7.7 é considerada concluída quando a arquitetura, a configuração, os dados e a documentação permitirem reconstruir a solução em uma conta diferente sem depender da conta Cloudflare pessoal utilizada no desenvolvimento e sem alterar a estrutura funcional aprovada do site.

O ambiente atual continua sendo a instalação de homologação/demonstração da Gomes Motors.
