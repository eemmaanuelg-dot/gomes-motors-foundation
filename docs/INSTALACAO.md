# Instalação comercial

Este documento descreve a instalação de uma nova unidade do produto em uma conta própria do cliente.

## Princípio

O código é o produto. A conta Cloudflare, o domínio, o banco, as mídias e os dados comerciais pertencem à instalação do cliente.

## Checklist

1. Criar a conta Cloudflare do cliente.
2. Registrar ou conectar o domínio do cliente.
3. Garantir acesso autorizado do desenvolvedor.
4. Criar o Worker.
5. Criar o banco D1.
6. Aplicar todas as migrations.
7. Importar ou cadastrar os dados comerciais.
8. Criar o bucket R2 quando a mídia estiver integrada.
9. Configurar os bindings no Worker.
10. Preencher `src/config/dealership.ts` com a identidade da instalação.
11. Fazer deploy.
12. Configurar Cloudflare Access para `/admin*`.
13. Validar site público e painel administrativo.

## Configuração comercial

Alterações de nome, telefone, WhatsApp, e-mail, localização, redes sociais, domínio e horário comercial devem ser feitas no ponto central `src/config/dealership.ts`.

Não espalhar esses dados pelo código.

## Dados comerciais

Veículos, preços, status, mídia, histórico e auditoria são dados persistentes e devem ser tratados pelo D1/R2, não como alterações de interface.

## Resultado esperado

A nova instalação deve manter a mesma aplicação e funcionalidades, recebendo apenas a identidade, infraestrutura e dados do novo cliente.
