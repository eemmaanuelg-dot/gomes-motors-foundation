import type { Email, Id, IsoDateTime, Phone } from "../shared/types";

export type Customer = {
  id: Id;
  nome: string;
  telefone?: Phone;
  whatsapp?: Phone;
  email?: Email;
  observacoes?: string;
  criadoEm: IsoDateTime;
  atualizadoEm: IsoDateTime;
};
