# Checklist de transferência — R2

## Produto

- [x] Armazenamento isolado atrás de abstração.
- [x] Worker usa binding R2, sem credenciais S3 no código.
- [x] Upload administrativo protegido por Cloudflare Access.
- [x] Exclusão administrativa protegida e auditada.
- [x] Servidor entrega imagens por rota controlada.
- [x] Referências `legacy://` permanecem compatíveis durante transição.
- [x] Referências `r2://` são resolvidas pelo mesmo catálogo.

## Instalação

- [ ] Cliente cria/possui a própria conta Cloudflare.
- [ ] Cliente cria o próprio bucket R2.
- [ ] `bucket_name` do ambiente é ajustado para o bucket do cliente.
- [ ] Worker é implantado na conta do cliente.
- [ ] D1 do cliente é configurado e migrado.
- [ ] Imagens são migradas para o R2 do cliente.
- [ ] Domínio do cliente é conectado.
- [ ] Cloudflare Access protege `/admin*`.
- [ ] Backup inicial é realizado.
- [ ] Teste de upload, visualização e exclusão é aprovado.

## Regra comercial

O bucket, objetos, banco, Worker, domínio e credenciais são recursos da instalação do cliente. O repositório representa o produto e não deve conter credenciais ou dados privados do cliente.

Para a instalação de referência Gomes Motors, o bucket planejado é `gomes-motors-media`. A migração das seis imagens demo é executada com `bun run media:migrate:legacy` depois que o bucket estiver criado e o Wrangler estiver autenticado.
