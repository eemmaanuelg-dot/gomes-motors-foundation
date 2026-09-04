# R2 — mídia da instalação

## Objetivo

O catálogo usa D1 para dados e Cloudflare R2 para arquivos de mídia. O Worker acessa o bucket por binding `MEDIA_BUCKET`; nenhuma chave S3/API fica no código.

## Bucket de referência

- Nome: `gomes-motors-media`
- Binding: `MEDIA_BUCKET`
- Prefixo de objetos: `vehicles/<vehicleId>/`
- Acesso direto público ao bucket: não necessário.
- Leitura pública das imagens: feita pela rota `/media?key=...` do Worker.
- Escrita/exclusão: somente pelas rotas administrativas protegidas pelo Cloudflare Access.

## Upload pelo Admin

`POST /admin/media` recebe `multipart/form-data` com:

- `vehicleId`
- `file`
- `altText`
- `order`

Formatos aceitos: JPEG, PNG, WebP e AVIF. Limite atual: 10 MB por imagem.

A chave do objeto é gerada no servidor e registrada em `vehicle_media`. Se a gravação no D1 falhar depois do upload, o Worker tenta remover o objeto para evitar órfãos.

## Exclusão

`DELETE /admin/media` recebe `{ "mediaId": "..." }`. O objeto R2 é removido antes do registro D1. A operação é registrada em `audit_logs`.

## Resolver

Referências `r2://vehicles/...` são convertidas em URLs internas `/media?key=...`. Referências `legacy://...` continuam funcionando como fallback para preservar retrocompatibilidade durante a migração.

## Migração da instalação de referência

O comando abaixo envia as seis imagens atuais e troca as referências D1 de `legacy://` para `r2://`:

```bash
bun run media:migrate:legacy
```

O script usa Wrangler e o bucket remoto. Wrangler suporta upload de objetos R2 individualmente; para grandes migrações futuras, rclone é uma alternativa adequada.

### Pré-requisitos

1. R2 ativado na conta Cloudflare.
2. Bucket `gomes-motors-media` criado.
3. Usuário autenticado no Wrangler (`npx wrangler login`).
4. D1 `gomes-motors-db` acessível remotamente.
5. Executar a migração a partir da raiz do repositório.

## Transferência comercial

Na instalação de um cliente, o bucket deve ser criado na conta Cloudflare do cliente e o `bucket_name` do ambiente deve ser ajustado para o bucket dessa instalação. O código do produto continua o mesmo.

Não criar API tokens S3 apenas para o Worker: bindings são o caminho recomendado e incorporam a permissão diretamente no runtime.
