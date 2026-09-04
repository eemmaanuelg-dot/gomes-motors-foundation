# Migração de instalação

Use este procedimento para mover o produto ou uma instalação para outra conta Cloudflare.

## 1. Preparar destino

- conta Cloudflare do novo proprietário;
- Worker de destino;
- D1 de destino;
- R2 de destino;
- Access de destino;
- domínio de destino.

## 2. D1

1. Exportar a base de origem.
2. Criar o D1 de destino.
3. Aplicar as migrations versionadas.
4. Importar os dados.
5. Conferir veículos, preços, status, inventário, histórico e auditoria.
6. Conferir contagens antes e depois.

## 3. R2

1. Listar os objetos da origem.
2. Copiar os objetos para o bucket de destino.
3. Preservar as chaves usadas pelas referências de mídia.
4. Validar imagens no catálogo.

## 4. Aplicação

1. Revisar `wrangler.jsonc` para os recursos da nova conta.
2. Atualizar a configuração comercial.
3. Configurar bindings.
4. Fazer deploy.
5. Conectar o domínio somente após a validação técnica.

## 5. Access

Recriar a proteção administrativa no ambiente de destino e autorizar os usuários corretos. O acesso público ao site não deve depender da autenticação administrativa.

## 6. Validação

Testar estoque, filtros, detalhes, favoritos, WhatsApp, financiamento, responsividade, `/admin`, permissões, mídia e navegação pública.

## Regra de segurança

Nunca transportar senhas, tokens ou credenciais pessoais dentro do repositório ou dos arquivos de migração.
