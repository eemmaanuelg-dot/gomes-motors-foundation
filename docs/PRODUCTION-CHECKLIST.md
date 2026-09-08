# Gomes Motors — Checklist Operacional de Produção

Atualizado em 08/09/2026.

Este checklist é operacional e não substitui o `docs/MASTER-EXECUTION-PLAN.md`. Nenhum item abaixo deve ser marcado como executado apenas por existir código: validações remotas e credenciais de produção precisam ser confirmadas no ambiente real.

## 1. Cloudflare Access / administração

- [ ] Cloudflare Access ativo na área administrativa.
- [ ] Apenas identidades autorizadas conseguem acessar `/admin` e endpoints administrativos.
- [ ] Identidade autenticada é enviada pelo Access e validada server-side.
- [ ] APIs administrativas rejeitam requisições sem identidade.
- [ ] APIs administrativas rejeitam requisições cross-origin quando a operação exige mesma origem.
- [ ] Não existem credenciais administrativas hardcoded no cliente.
- [ ] Papéis administrativos estão definidos antes de liberar operações destrutivas para mais de um perfil.

## 2. D1 remoto

- [ ] Banco remoto confirmado como `gomes-motors-db`.
- [ ] Todas as migrations, em ordem, aplicadas até `0012_analytics_integrity.sql`.
- [ ] Contagem e integridade dos seis veículos demo confirmadas no remoto.
- [ ] `inventory_entries`, `vehicle_prices` e `vehicle_status_history` conferidos.
- [ ] Tabelas comerciais e `analytics_events` conferidas.
- [ ] Triggers de integridade comercial ativos.
- [ ] Backup/exportação do estado remoto executado antes da primeira operação destrutiva.

## 3. R2 remoto

- [ ] Bucket confirmado como `gomes-motors-media-2026`.
- [ ] As 18 imagens definitivas existem no R2.
- [ ] Existem 3 imagens coerentes para cada um dos seis veículos.
- [ ] Registros `vehicle_media` apontam para objetos R2 válidos.
- [ ] Imagem principal e ordem da galeria conferidas.
- [ ] MIME e texto alternativo conferidos.
- [ ] Nenhum veículo publicado depende de `legacy://` como fonte normal de mídia.

## 4. Catálogo público

- [ ] Home carrega dados esperados.
- [ ] Estoque lista somente veículos publicados e não vendidos conforme regra atual.
- [ ] Busca, filtros e ordenação funcionam.
- [ ] Detalhe de veículo funciona com galeria D1/R2.
- [ ] Veículo inexistente apresenta estado de erro adequado.
- [ ] Favoritos funcionam.
- [ ] CTAs Comprar, Trocar, Financiar, Vender e Consignar preservam o contexto.
- [ ] Formulário de contato persiste lead corretamente.
- [ ] WhatsApp recebe mensagem/contexto correto.

## 5. Financiamento

- [ ] Simulador público permanece identificado como demonstrativo.
- [ ] Entrada mínima demonstrativa permanece em R$ 1.000,00.
- [ ] Contexto de veículo, entrada, prazo, taxa indicativa e parcela estimada é enviado ao atendimento.
- [ ] Nenhuma tela pública apresenta simulação como aprovação ou proposta de crédito.
- [ ] Operações reais de financiamento ficam restritas ao fluxo administrativo.

## 6. Operação comercial

- [ ] Lead nasce com intenção e origem identificáveis.
- [ ] Pipeline mantém histórico de alterações.
- [ ] Avaliação, negociação, reserva e venda preservam vínculo com veículo e lead.
- [ ] Reserva não pode ser criada para veículo indisponível.
- [ ] Venda não pode ser criada para veículo indisponível ou com reserva ativa.
- [ ] Transições comerciais e status do veículo são atômicos.
- [ ] Ações críticas possuem auditoria suficiente para rastreabilidade.

## 7. Analytics e privacidade

- [ ] Apenas eventos permitidos pela whitelist são persistidos.
- [ ] Payloads acima do limite são rejeitados.
- [ ] Eventos repetidos na mesma sessão dentro da janela de deduplicação não inflacionam métricas.
- [ ] Não são armazenados dados pessoais desnecessários em metadata.
- [ ] Consentimento e política de privacidade são revisados conforme a forma final de coleta e operação.

## 8. Release final

- [ ] `npm test` verde.
- [ ] `npm run build` verde.
- [ ] Smoke test do catálogo verde.
- [ ] Scripts operacionais passam em `node --check`.
- [ ] QA desktop/tablet/mobile concluído.
- [ ] SEO final conferido.
- [ ] Acessibilidade final conferida.
- [ ] Segurança final conferida.
- [ ] Domínio definitivo configurado e validado.
- [ ] Homologação concluída.
- [ ] Backup e recuperação testados.
- [ ] Monitoramento pós-lançamento definido.

## Regra de execução

Quando uma validação de build ou teste falhar, a correção deve voltar para a etapa responsável, ser validada novamente e só então o fluxo retoma o próximo bloco. Uma falha de build não encerra o ciclo de desenvolvimento.
