import type { Id, IsoDateTime, Money, Phone } from "../shared/types";

export type EvaluationType = "venda" | "troca" | "consignacao";
export type EvaluationStatus =
  | "solicitada"
  | "em_analise"
  | "aguardando_informacao"
  | "avaliada"
  | "aprovada"
  | "recusada";

export type EvaluationVehicle = {
  marca: string;
  modelo: string;
  versao?: string;
  ano: number;
  km: number;
};

export type Evaluation = {
  id: Id;
  tipo: EvaluationType;
  status: EvaluationStatus;
  clienteId?: Id;
  clienteNome: string;
  clienteTelefone?: Phone;
  veiculoId?: Id;
  veiculo: EvaluationVehicle;
  valorPretendido?: Money;
  valorAvaliacao?: Money;
  observacoes?: string;
  criadoEm: IsoDateTime;
  atualizadoEm: IsoDateTime;
};
