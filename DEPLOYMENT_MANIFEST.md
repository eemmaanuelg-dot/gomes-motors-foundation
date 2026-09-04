# Gomes Motors — Deployment Manifest

Documento mestre para instalação, migração e transferência comercial.

## 1. Produto

O repositório contém a aplicação e sua infraestrutura declarativa. A instalação de produção deve ser criada na conta Cloudflare do cliente.

A Gomes Motors atual é a instalação de referência/homologação. O produto deve permanecer portátil para outra concessionária.

## 2. Pré-requisitos

- conta GitHub com acesso ao repositório;
- conta Cloudflare do proprietário da instalação;
- domínio do cliente para produção;
- Wrangler autenticado na conta de destino;
- acesso administrativo autorizado para configurar Worker, D1, R2 e Access.

## 3. Instalação

### Worker

1. Clonar o repositório.
2. Instalar dependências.
3. Revisar `wrangler.jsonc`.
4. Criar/provisionar o Worker na conta de destino.
5. Configurar o binding `DB` para o D1 da instalação.
6. Configurar os demais bindings necessários, incluindo R2 quando integrado.

### D1

1. Criar o banco da instalação.
2. Aplicar as migrations em `db/migrations`.
3. Importar os dados comerciais quando houver migração de uma instalação existente.
4. Validar contagens e integridade.

### R2

1. Criar o bucket da instalação.
2. Configurar o binding utilizado pela aplicação.
3. Migrar objetos quando a instalação vier de outro ambiente.
4. Validar referências de mídia.

### Access

1. Criar a aplicação/proteção para o ambiente de produção.
2. Proteger `/admin*`.
3. Autorizar os usuários administrativos do cliente.
4. Validar que o site público continua acessível sem autenticação.

## 4. Configuração comercial

A identidade da instalação fica centralizada em `src/config/dealership.ts`.

Deve ser configurada para cada cliente:

- nome;
- razão/nome comercial quando aplicável;
- slogan;
- WhatsApp e telefone;
- e-mail;
- cidade, estado e endereço;
- redes sociais;
- domínio;
- horário de atendimento;
- referências de marca.

Não é necessário reescrever as funcionalidades para trocar a identidade comercial.

## 5. Deploy

O deploy deve ser executado a partir do repositório e da conta Cloudflare de destino. O domínio de produção deve ser conectado somente depois que Worker, D1, R2 e Access estiverem validados.

## 6. Migração

### Dados D1

- exportar a origem;
- preparar o banco de destino com as migrations;
- importar os dados;
- validar veículos, preços, status, histórico e auditoria.

### Mídia R2

- copiar os objetos para o bucket de destino;
- preservar as chaves necessárias;
- validar todas as referências no catálogo.

### Configuração

- substituir a configuração comercial pela identidade do cliente;
- configurar domínio e infraestrutura de destino;
- nunca copiar credenciais ou secrets para o repositório.

## 7. Backup

O procedimento de backup deve preservar pelo menos:

- exportação do D1;
- objetos do R2;
- versão do código/commit implantado;
- configuração comercial;
- inventário de recursos Cloudflare;
- documentação de Access e domínio.

## 8. Restauração

A restauração deve seguir a ordem:

```text
código
  ↓
infrastrutura
  ↓
migrations D1
  ↓
dados D1
  ↓
objetos R2
  ↓
configuração comercial
  ↓
Access
  ↓
domínio
  ↓
validação final
```

## 9. Documentação operacional

- `docs/INSTALACAO.md` — nova instalação;
- `docs/MIGRACAO.md` — migração entre ambientes;
- `docs/BACKUP.md` — backup;
- `docs/RESTAURACAO.md` — restauração;
- `docs/COMMERCIAL-TRANSFER.md` — auditoria 7.7 e transferência comercial.

## 10. Handoff comercial

Na venda, a conta Cloudflare, domínio e recursos de produção pertencem ao cliente. O desenvolvedor pode receber acesso como membro autorizado para manutenção, sem compartilhamento de credenciais pessoais.

O cliente deve ser capaz de administrar sua infraestrutura e seus dados independentemente da conta pessoal usada no desenvolvimento.

## 11. Critério de aceite

Uma instalação é considerada transferível quando:

- o código executa em uma conta Cloudflare diferente;
- D1 pode ser recriado por migrations;
- dados podem ser importados;
- R2 pode ser recriado e populado;
- Access pode ser recriado;
- domínio pode ser substituído;
- identidade comercial pode ser alterada sem reescrever a aplicação;
- backup e restauração estão documentados;
- o site público e o `/admin` passam pela validação final.
