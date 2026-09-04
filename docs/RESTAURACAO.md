# Restauração

A restauração deve reconstruir a instalação de forma controlada e verificável.

## Ordem

```text
código
  ↓
infrastrutura Cloudflare
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
validação
```

## Procedimento

1. Confirmar o commit que deve ser restaurado.
2. Recriar ou confirmar Worker, D1 e R2.
3. Aplicar as migrations.
4. Restaurar os dados do D1.
5. Restaurar os objetos do R2.
6. Restaurar a configuração comercial correspondente à instalação.
7. Recriar o Access administrativo.
8. Conectar o domínio.
9. Validar o catálogo público.
10. Validar o painel administrativo.
11. Validar imagens, WhatsApp, financiamento e responsividade.

## Critério

A restauração termina somente quando o sistema estiver funcional e os dados principais forem conferidos contra o backup de origem.
