import type { Id, IsoDateTime, Money } from "../shared/types";

export type FinancingProposalStatus =
  | "rascunho"
  | "enviada"
  | "em_analise"
  | "aprovada"
  | "recusada"
  | "cancelada";

export type FinancingSimulation = {
  vehicleId: Id;
  valorVeiculo: Money;
  entrada: Money;
  prazoMeses: number;
  taxaMensalIndicativa: number;
  parcelaEstimada: Money;
};

export type FinancingProposal = {
  id: Id;
  clienteId?: Id;
  veiculoId: Id;
  status: FinancingProposalStatus;
  valorVeiculo: Money;
  entrada: Money;
  prazoMeses: number;
  taxaMensal?: number;
  parcela?: Money;
  observacoes?: string;
  criadoEm: IsoDateTime;
  atualizadoEm: IsoDateTime;
};
