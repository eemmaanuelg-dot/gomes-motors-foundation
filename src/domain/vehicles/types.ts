import type { Id, IsoDateTime, Money } from "../shared/types";

export type VehicleCategory = "carros" | "motos";
export type VehicleStatus = "disponivel" | "reservado" | "vendido";

export type VehicleTechnicalSheet = {
  motor: string;
  potencia?: string;
  torque?: string;
  desempenho?: string;
  consumo?: string;
  portas?: string;
  tracao?: string;
};

export type FinancingTerms = {
  entradaMinima: Money;
  parcelas: number[];
  taxaIndicativa: number;
};

export type Vehicle = {
  id: Id;
  categoria: VehicleCategory;
  marca: string;
  modelo: string;
  versao?: string;
  ano: number;
  km: number;
  preco: Money;
  cambio?: string;
  combustivel?: string;
  cilindrada?: string;
  tipo?: string;
  imagem: string;
  imagens: string[];
  descricao: string;
  equipamentos: string[];
  fichaTecnica: VehicleTechnicalSheet;
  status: VehicleStatus;
  destaque: boolean;
  financiamento: FinancingTerms;
  seoDescription: string;
};

export type VehicleUpdate = Partial<Omit<Vehicle, "id">>;

export type VehicleStatusTransition = {
  vehicleId: Id;
  from: VehicleStatus;
  to: VehicleStatus;
  occurredAt: IsoDateTime;
};
