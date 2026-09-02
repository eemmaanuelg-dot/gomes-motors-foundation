import type { Id } from "../shared/types";
import type { FinancingProposal } from "./types";

export interface FinancingRepository {
  criar(proposta: FinancingProposal): Promise<FinancingProposal>;
  listar(): Promise<FinancingProposal[]>;
  obterPorId(id: Id): Promise<FinancingProposal | null>;
  atualizar(proposta: FinancingProposal): Promise<FinancingProposal>;
}
