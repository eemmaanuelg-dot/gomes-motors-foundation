import type { Id } from "../shared/types";
import type { Customer } from "./types";

export interface CustomerRepository {
  criar(cliente: Customer): Promise<Customer>;
  listar(): Promise<Customer[]>;
  obterPorId(id: Id): Promise<Customer | null>;
  atualizar(cliente: Customer): Promise<Customer>;
  obterPorContato(contato: string): Promise<Customer | null>;
}
