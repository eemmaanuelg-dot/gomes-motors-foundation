import test from "node:test";
import assert from "node:assert/strict";
import {
  canCreateSale,
  canReleaseVehicleFromReservation,
  isEvaluationDecision,
  isFinancingStatus,
  isNegotiationStage,
  isReservationStatus,
  validateSaleAmounts,
} from "../src/lib/commercial-rules.ts";

test("regras comerciais aceitam somente status previstos", () => {
  assert.equal(isReservationStatus("ativa"), true);
  assert.equal(isReservationStatus("qualquer"), false);
  assert.equal(isNegotiationStage("contraproposta"), true);
  assert.equal(isNegotiationStage("cancelada"), false);
  assert.equal(isEvaluationDecision("aprovada"), true);
  assert.equal(isEvaluationDecision("aprovado"), false);
  assert.equal(isFinancingStatus("cancelado"), true);
  assert.equal(isFinancingStatus("pendente"), false);
});

test("reserva ativa bloqueia liberação, demais estados liberam o veículo", () => {
  assert.equal(canReleaseVehicleFromReservation("ativa"), false);
  assert.equal(canReleaseVehicleFromReservation("liberada"), true);
  assert.equal(canReleaseVehicleFromReservation("convertida"), true);
  assert.equal(canReleaseVehicleFromReservation("expirada"), true);
  assert.equal(canReleaseVehicleFromReservation("cancelada"), true);
});

test("venda somente pode ser criada para veículo disponível", () => {
  assert.equal(canCreateSale("disponivel"), true);
  assert.equal(canCreateSale("reservado"), false);
  assert.equal(canCreateSale("vendido"), false);
});

test("validação financeira impede valores negativos e composição acima do preço", () => {
  assert.equal(validateSaleAmounts(100000, 20000, 30000), true);
  assert.equal(validateSaleAmounts(100000, 70000, 30000), true);
  assert.equal(validateSaleAmounts(100000, 70001, 30000), false);
  assert.equal(validateSaleAmounts(100000, -1, 0), false);
  assert.equal(validateSaleAmounts(100000, 10000.5, 0), false);
});
