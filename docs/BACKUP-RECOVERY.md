# Backup e recuperação — D1

## Objetivo

Manter uma cópia exportada do banco operacional `gomes-motors-db` fora do ciclo normal de deploy e permitir uma recuperação controlada em caso de perda ou corrupção de dados.

## Exportação

A rotina oficial do projeto é:

```bash
node scripts/backup-d1.mjs
```

O script executa a exportação remota do D1 e grava o arquivo SQL em `backups/` com timestamp. A pasta `backups/` é ignorada pelo Git para impedir que cópias do banco sejam commitadas no repositório.

Pré-requisitos:

1. Wrangler autenticado na conta Cloudflare correta.
2. Acesso ao D1 `gomes-motors-db`.
3. Espaço local suficiente para o arquivo SQL.

## Recuperação

A restauração deve ser tratada como operação de produção e executada somente após identificar o backup correto e confirmar o ambiente de destino.

Exemplo de aplicação de um export SQL no banco remoto:

```bash
npx wrangler d1 execute gomes-motors-db --remote --file=backups/gomes-motors-db-<timestamp>.sql
```

Antes de executar:

- confirmar a conta Cloudflare ativa;
- confirmar o nome do banco;
- preservar o backup original;
- registrar quem executou a recuperação e o motivo;
- evitar aplicar o mesmo arquivo duas vezes sem avaliar os efeitos das instruções SQL contidas no export.

Após a recuperação, executar as validações locais/operacionais disponíveis e conferir catálogo, estoque, leads e demais dados críticos.

## Mídia R2

O banco D1 não substitui o backup dos objetos do R2. A recuperação completa exige preservar também os arquivos do bucket `gomes-motors-media-2026` e suas relações `vehicle_media` no D1.

A documentação de mídia está em `docs/R2-MEDIA.md`.

## Retenção

O projeto não versiona nem mantém cópias de produção dentro do Git. A política de retenção física dos arquivos exportados deve ser definida no ambiente operacional do cliente, preferencialmente com cópias independentes da máquina que executa o deploy.
