import type { Id } from "../shared/types";
import type { Lead, LeadStatusHistory } from "./types";

export interface LeadRepository {
  criar(lead: Lead): Promise<Lead>;
  listar(): Promise<Lead[]>;
  obterPorId(id: Id): Promise<Lead | null>;
  atualizar(lead: Lead): Promise<Lead>;
  adicionarHistorico(item: LeadStatusHistory): Promise<LeadStatusHistory>;
}
