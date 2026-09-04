# 7.7 — Preparação para Transferência Comercial

## Objetivo

O Gomes Motors é tratado como uma solução comercializável e replicável para concessionárias. A implementação de referência é a Gomes Motors; o produto não deve depender permanentemente da identidade ou da infraestrutura de uma única empresa.

## 7.7.1 — Auditoria de arquitetura

- GitHub `main` permanece como fonte de verdade do código.
- Worker é configurado por `wrangler.jsonc` e deve poder ser recriado em outra conta.
- D1 é provisionado por binding e migrations versionadas em `db/migrations`.
- R2 será acessado por bindings, sem dependência de uma conta específica.
- Cloudflare Access é infraestrutura de implantação e não regra de negócio da aplicação.
- Domínio de produção não é requisito do código e poderá ser substituído por instalação.
- Segredos e credenciais não devem ser gravados no repositório.

## 7.7.2 — Separação Produto × Cliente

### Produto

- aplicação React/TanStack Start;
- componentes e identidade estrutural;
- regras de negócio;
- estoque administrativo;
- simulador;
- auditoria;
- persistência e integrações.

### Cliente

- nome da empresa;
- logo e marca;
- telefone/WhatsApp;
- e-mail;
- endereço;
- cidade/estado;
- redes sociais;
- domínio;
- usuários administrativos;
- veículos, preços, fotos e demais dados comerciais.

A primeira implementação utiliza `src/config/dealership.ts` como configuração comercial central da instalação.

## 7.7.3 — Auditoria de marca

A identidade da Gomes Motors deve ser progressivamente retirada de valores espalhados pela aplicação. Novas funcionalidades devem consumir a configuração comercial quando o dado for específico do cliente.

A configuração atual já centraliza os principais dados de contato e localização e mantém espaço para domínio, e-mail e redes sociais.

## 7.7.4 — Auditoria de dados

Dados comerciais não devem ser tratados como código.

```text
PRODUTO
  código + regras + interface + funcionalidades

DADOS
  veículos + preços + status + mídia + histórico + auditoria
```

O catálogo já utiliza D1 como fonte persistente configurável. O seed de demonstração deve ser tratado como conteúdo de demonstração, não como requisito estrutural do produto.

## 7.7.5 — Entrega comercial

Cada instalação futura deverá poder ser documentada e executada por um procedimento reproduzível de:

1. instalação;
2. configuração;
3. deploy;
4. migração de dados;
5. migração de mídia;
6. backup;
7. restauração;
8. validação;
9. manutenção.

## Critério de conclusão da 7.7

A etapa só será considerada tecnicamente concluída quando uma instalação nova puder ser reconstruída sem depender da conta Cloudflare pessoal usada no desenvolvimento.

Até lá, o ambiente atual é homologação/demonstração. A conta do cliente será a proprietária da infraestrutura de produção em uma venda futura.
