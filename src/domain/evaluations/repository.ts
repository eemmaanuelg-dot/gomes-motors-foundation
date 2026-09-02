import type { Id } from "../shared/types";
import type { Evaluation } from "./types";

export interface EvaluationRepository {
  criar(avaliacao: Evaluation): Promise<Evaluation>;
  listar(): Promise<Evaluation[]>;
  obterPorId(id: Id): Promise<Evaluation | null>;
  atualizar(avaliacao: Evaluation): Promise<Evaluation>;
}
