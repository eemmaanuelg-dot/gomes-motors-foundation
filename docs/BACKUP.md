# Backup

O backup deve permitir reconstruir uma instalação sem depender da conta pessoal usada no desenvolvimento.

## O que preservar

### Código

- repositório Git;
- commit implantado;
- migrations;
- configuração comercial.

### D1

- exportação periódica do banco;
- data e versão do backup;
- contagem de registros para conferência.

### R2

- objetos de mídia;
- chaves dos objetos;
- correspondência entre mídia e veículos.

### Cloudflare

Registrar os recursos existentes da instalação:

- Worker;
- D1;
- R2;
- Access;
- domínio;
- bindings;
- variáveis e secrets, sem registrar os valores sensíveis no repositório.

## Rotina recomendada

Antes de mudanças estruturais, realizar um backup completo. Para manutenção normal, manter cópias periódicas do D1 e R2 e registrar o commit implantado.

## Verificação

Um backup só deve ser considerado confiável depois de uma restauração de teste ou de uma validação equivalente documentada.
