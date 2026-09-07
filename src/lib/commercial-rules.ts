export const RESERVATION_STATUSES = ["ativa", "liberada", "convertida", "expirada", "cancelada"] as const;
export const NEGOTIATION_STAGES = ["aberta", "proposta", "contraproposta", "fechada", "perdida"] as const;
export const EVALUATION_DECISIONS = ["pendente", "aprovada", "recusada", "convertida"] as const;
export const FINANCING_STATUSES = ["simulacao_interna", "em_analise", "proposta", "aprovado", "recusado", "contratado", "cancelado"] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];
export type NegotiationStage = (typeof NEGOTIATION_STAGES)[number];
export type EvaluationDecision = (typeof EVALUATION_DECISIONS)[number];
export type FinancingStatus = (typeof FINANCING_STATUSES)[number];

const hasValue = <T extends readonly string[]>(values: T, value: string): value is T[number] => values.includes(value);

export const isReservationStatus = (value: string): value is ReservationStatus => hasValue(RESERVATION_STATUSES, value);
export const isNegotiationStage = (value: string): value is NegotiationStage => hasValue(NEGOTIATION_STAGES, value);
export const isEvaluationDecision = (value: string): value is EvaluationDecision => hasValue(EVALUATION_DECISIONS, value);
export const isFinancingStatus = (value: string): value is FinancingStatus => hasValue(FINANCING_STATUSES, value);

export function canReleaseVehicleFromReservation(status: ReservationStatus): boolean {
  return status !== "ativa" && status !== "convertida";
}

export function canCreateSale(vehicleStatus: string): boolean {
  return vehicleStatus !== "vendido";
}

export function validateSaleAmounts(finalPriceCents: number, downPaymentCents: number, tradeInValueCents: number): boolean {
  return Number.isInteger(finalPriceCents) && finalPriceCents >= 0
    && Number.isInteger(downPaymentCents) && downPaymentCents >= 0
    && Number.isInteger(tradeInValueCents) && tradeInValueCents >= 0
    && downPaymentCents + tradeInValueCents <= finalPriceCents;
}
