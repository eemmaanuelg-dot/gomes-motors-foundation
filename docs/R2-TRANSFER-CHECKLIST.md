# Checklist de transferência — R2

## Produto

- [x] Armazenamento isolado atrás de abstração.
- [x] Worker usa binding R2, sem credenciais S3 no código.
- [x] Upload administrativo protegido por Cloudflare Access.
- [x] Exclusão administrativa protegida e auditada.
- [x] Servidor entrega imagens por rota controlada.
- [x] Referências `legacy://` permanecem compatíveis durante transição.
- [x] Referências `r2://` são resolvidas pelo mesmo catálogo.
- [x] Migração demo associa cada objeto à tabela `vehicle_media`.
- [x] Script de migração usa chaves determinísticas e pode ser repetido sem duplicar associações.

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

Para a instalação de referência Gomes Motors, o bucket é `gomes-motors-media-2026`. A migração das seis imagens demo é executada com:

```bash
node scripts/migrate-legacy-media.mjs
```

A migração deve ocorrer somente depois de confirmar que o build gerado contém o binding `MEDIA_BUCKET` e que o Worker foi implantado com esse binding funcional.
