import type { Email, Id, IsoDateTime, Phone } from "../shared/types";

export type LeadType =
  | "comprar"
  | "trocar"
  | "financiar"
  | "vender"
  | "consignar"
  | "contato";

export type LeadStatus =
  | "novo"
  | "em_atendimento"
  | "aguardando_cliente"
  | "proposta_enviada"
  | "negociacao"
  | "convertido"
  | "perdido";

export type LeadOrigin =
  | "estoque"
  | "detalhe_veiculo"
  | "servicos"
  | "contato"
  | "outro";

export type CustomerReference = {
  nome: string;
  telefone?: Phone;
  whatsapp?: Phone;
  email?: Email;
};

export type Lead = {
  id: Id;
  tipo: LeadType;
  status: LeadStatus;
  origem: LeadOrigin;
  clienteId?: Id;
  cliente: CustomerReference;
  veiculoId?: Id;
  responsavelId?: Id;
  observacoes?: string;
  criadoEm: IsoDateTime;
  atualizadoEm: IsoDateTime;
};

export type LeadStatusHistory = {
  id: Id;
  leadId: Id;
  de?: LeadStatus;
  para: LeadStatus;
  alteradoPor?: Id;
  ocorridoEm: IsoDateTime;
  observacao?: string;
};
