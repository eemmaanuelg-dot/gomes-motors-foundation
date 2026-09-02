import type { VehicleRepository } from "@/domain/vehicles/repository";
import type { Vehicle, VehicleUpdate } from "@/domain/vehicles/types";
import type { D1Database } from "@/infrastructure/cloudflare/bindings";

interface VehicleRow {
  id: string;
  categoria: Vehicle["categoria"];
  marca: string;
  modelo: string;
  versao: string | null;
  ano: number;
  km: number;
  preco: number;
  cambio: string | null;
  combustivel: string | null;
  cilindrada: string | null;
  tipo: string | null;
  imagem: string;
  imagens_json: string;
  descricao: string;
  equipamentos_json: string;
  ficha_tecnica_json: string;
  status: Vehicle["status"];
  destaque: number;
  financiamento_json: string;
  seo_description: string;
  criado_em: string;
  atualizado_em: string;
}

function json<T>(value: T): string {
  return JSON.stringify(value);
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    categoria: row.categoria,
    marca: row.marca,
    modelo: row.modelo,
    ...(row.versao ? { versao: row.versao } : {}),
    ano: row.ano,
    km: row.km,
    preco: row.preco,
    ...(row.cambio ? { cambio: row.cambio } : {}),
    ...(row.combustivel ? { combustivel: row.combustivel } : {}),
    ...(row.cilindrada ? { cilindrada: row.cilindrada } : {}),
    ...(row.tipo ? { tipo: row.tipo } : {}),
    imagem: row.imagem,
    imagens: parseJson<string[]>(row.imagens_json, []),
    descricao: row.descricao,
    equipamentos: parseJson<string[]>(row.equipamentos_json, []),
    fichaTecnica: parseJson<Vehicle["fichaTecnica"]>(row.ficha_tecnica_json, {
      motor: "",
    }),
    status: row.status,
    destaque: row.destaque === 1,
    financiamento: parseJson<Vehicle["financiamento"]>(row.financiamento_json, {
      entradaMinima: 0,
      parcelas: [],
      taxaIndicativa: 0,
    }),
    seoDescription: row.seo_description,
  };
}

function nullable(value: string | undefined): string | null {
  return value === undefined ? null : value;
}

export class D1VehicleRepository implements VehicleRepository {
  constructor(private readonly db: D1Database) {}

  async listarPublicados(): Promise<Vehicle[]> {
    const result = await this.db
      .prepare(
        `SELECT v.*
         FROM vehicles v
         INNER JOIN inventory_entries i ON i.vehicle_id = v.id
         WHERE i.publicado = 1 AND v.status != 'vendido'
         ORDER BY i.ordem ASC, v.id ASC`,
      )
      .all<VehicleRow>();

    return result.results.map(mapRow);
  }

  async listarTodos(): Promise<Vehicle[]> {
    const result = await this.db
      .prepare("SELECT * FROM vehicles ORDER BY id ASC")
      .all<VehicleRow>();

    return result.results.map(mapRow);
  }

  async obterPorId(id: string): Promise<Vehicle | null> {
    const row = await this.db
      .prepare("SELECT * FROM vehicles WHERE id = ? LIMIT 1")
      .bind(id)
      .first<VehicleRow>();

    return row ? mapRow(row) : null;
  }

  async criar(veiculo: Vehicle): Promise<Vehicle> {
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `INSERT INTO vehicles (
          id, categoria, marca, modelo, versao, ano, km, preco, cambio,
          combustivel, cilindrada, tipo, imagem, imagens_json, descricao,
          equipamentos_json, ficha_tecnica_json, status, destaque,
          financiamento_json, seo_description, criado_em, atualizado_em
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        veiculo.id,
        veiculo.categoria,
        veiculo.marca,
        veiculo.modelo,
        nullable(veiculo.versao),
        veiculo.ano,
        veiculo.km,
        veiculo.preco,
        nullable(veiculo.cambio),
        nullable(veiculo.combustivel),
        nullable(veiculo.cilindrada),
        nullable(veiculo.tipo),
        veiculo.imagem,
        json(veiculo.imagens),
        veiculo.descricao,
        json(veiculo.equipamentos),
        json(veiculo.fichaTecnica),
        veiculo.status,
        veiculo.destaque ? 1 : 0,
        json(veiculo.financiamento),
        veiculo.seoDescription,
        now,
        now,
      )
      .run();

    return { ...veiculo, imagens: [...veiculo.imagens], equipamentos: [...veiculo.equipamentos] };
  }

  async atualizar(id: string, dados: VehicleUpdate): Promise<Vehicle> {
    const atual = await this.obterPorId(id);
    if (!atual) throw new Error(`Veículo "${id}" não encontrado.`);

    const fields: string[] = [];
    const values: unknown[] = [];

    const add = (column: string, value: unknown) => {
      fields.push(`${column} = ?`);
      values.push(value);
    };

    if (dados.categoria !== undefined) add("categoria", dados.categoria);
    if (dados.marca !== undefined) add("marca", dados.marca);
    if (dados.modelo !== undefined) add("modelo", dados.modelo);
    if (dados.versao !== undefined) add("versao", dados.versao ?? null);
    if (dados.ano !== undefined) add("ano", dados.ano);
    if (dados.km !== undefined) add("km", dados.km);
    if (dados.preco !== undefined) add("preco", dados.preco);
    if (dados.cambio !== undefined) add("cambio", dados.cambio ?? null);
    if (dados.combustivel !== undefined) add("combustivel", dados.combustivel ?? null);
    if (dados.cilindrada !== undefined) add("cilindrada", dados.cilindrada ?? null);
    if (dados.tipo !== undefined) add("tipo", dados.tipo ?? null);
    if (dados.imagem !== undefined) add("imagem", dados.imagem);
    if (dados.imagens !== undefined) add("imagens_json", json(dados.imagens));
    if (dados.descricao !== undefined) add("descricao", dados.descricao);
    if (dados.equipamentos !== undefined) add("equipamentos_json", json(dados.equipamentos));
    if (dados.fichaTecnica !== undefined) add("ficha_tecnica_json", json(dados.fichaTecnica));
    if (dados.status !== undefined) add("status", dados.status);
    if (dados.destaque !== undefined) add("destaque", dados.destaque ? 1 : 0);
    if (dados.financiamento !== undefined) add("financiamento_json", json(dados.financiamento));
    if (dados.seoDescription !== undefined) add("seo_description", dados.seoDescription);

    if (fields.length === 0) return atual;

    add("atualizado_em", new Date().toISOString());
    values.push(id);

    await this.db
      .prepare(`UPDATE vehicles SET ${fields.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();

    const atualizado = await this.obterPorId(id);
    if (!atualizado) throw new Error(`Veículo "${id}" não encontrado após atualização.`);
    return atualizado;
  }
}
