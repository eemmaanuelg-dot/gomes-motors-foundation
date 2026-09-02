# Gomes Motors — Ativação Cloudflare D1 + R2

Esta etapa liga a infraestrutura que já está implementada no código.

## 1. Autenticar o Wrangler

```bash
npx wrangler login
```

## 2. Criar o D1

```bash
npx wrangler d1 create gomes-motors-db --binding DB --update-config
```

O comando cria o banco remoto e pode atualizar o `wrangler.jsonc` com o `database_id` real. Nunca preencher esse ID manualmente com valor fictício.

## 3. Criar o bucket R2

```bash
npx wrangler r2 bucket create gomes-motors-vehicle-images
```

Depois, no `wrangler.jsonc`, habilitar a binding:

```json
"r2_buckets": [
  {
    "binding": "VEHICLE_IMAGES",
    "bucket_name": "gomes-motors-vehicle-images"
  }
]
```

## 4. Conferir as bindings

O Worker deve possuir:

```text
DB → gomes-motors-db
VEHICLE_IMAGES → gomes-motors-vehicle-images
```

## 5. Deploy da aplicação

```bash
npm run deploy
```

## 6. Enviar as imagens atuais

Depois que o bucket existir:

```bash
npm run r2:upload
```

O script envia:

```text
civic-exl.jpg   → vehicles/civic-exl/0.jpg
corolla-gli.jpg → vehicles/corolla-gli/0.jpg
polo.jpg        → vehicles/polo/0.jpg
onix.jpg        → vehicles/onix/0.jpg
cb500f.jpg      → vehicles/cb500f/0.jpg
mt03.jpg        → vehicles/mt03/0.jpg
```

## 7. Aplicar as migrations

```bash
npm run db:migrate:remote
```

Isso cria a estrutura e carrega os seis veículos atuais. A migration já aponta as imagens para `/media/vehicles/...`, que são entregues pelo Worker a partir do R2.

## 8. Gerar tipos Cloudflare

```bash
npm run cf-typegen
```

A geração de tipos pode ser usada como referência para futuras substituições dos contratos mínimos de binding.

## 9. Novo deploy

```bash
npm run deploy
```

## 10. Validação

Testar obrigatoriamente:

- `/` com os veículos em destaque;
- `/estoque` com os seis veículos;
- filtros;
- favoritos;
- `/estoque/{id}`;
- imagens carregadas por `/media/vehicles/...`;
- WhatsApp;
- mobile e desktop;
- build sem erro.

## Observação sobre o Wrangler atual

O projeto usa `wrangler` 4.36.x. A criação automática de recursos sem IDs foi disponibilizada posteriormente como recurso de provisionamento automático do Wrangler. Por isso, nesta versão do projeto a criação de D1/R2 é deliberadamente explícita. Isso evita depender de um comportamento de uma versão diferente da ferramenta.

Depois que os recursos reais forem criados, os IDs/bindings passam a ser patrimônio da configuração do ambiente, enquanto os contratos e casos de uso continuam independentes deles.
