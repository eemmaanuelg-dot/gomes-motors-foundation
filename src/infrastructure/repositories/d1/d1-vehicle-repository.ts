import type { VehicleRepository } from "@/domain/vehicles/repository";
import type { Vehicle, VehicleUpdate } from "@/domain/vehicles/types";
import type { D1DatabaseLike } from "./d1-types";

type VehicleRow = {
  id: string;
  category: Vehicle["categoria"];
  brand: string;
  model: string;
  version: string | null;
  year: number;
  mileage: number;
  price_cents: number;
  transmission: string | null;
  fuel: string | null;
  cylinder_capacity: string | null;
  vehicle_type: string | null;
  image_url: string | null;
  images_json: string;
  description: string | null;
  equipment_json: string;
  technical_sheet_json: string;
  status: Vehicle["status"];
  featured: number;
  financing_json: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
};

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function rowToVehicle(row: VehicleRow): Vehicle {
  const vehicle: Vehicle = {
    id: row.id,
    categoria: row.category,
    marca: row.brand,
    modelo: row.model,
    ano: row.year,
    km: row.mileage,
    preco: row.price_cents / 100,
    imagem: row.image_url ?? "",
    imagens: parseJson<string[]>(row.images_json, []),
    descricao: row.description ?? "",
    equipamentos: parseJson<string[]>(row.equipment_json, []),
    fichaTecnica: parseJson<Vehicle["fichaTecnica"]>(row.technical_sheet_json, {
      motor: "",
    }),
    status: row.status,
    destaque: row.featured === 1,
    financiamento: parseJson<Vehicle["financiamento"]>(row.financing_json, {
      entradaMinima: 0,
      parcelas: [],
      taxaIndicativa: 0,
    }),
    seoDescription: row.seo_description,
  };

  if (row.version !== null) vehicle.versao = row.version;
  if (row.transmission !== null) vehicle.cambio = row.transmission;
  if (row.fuel !== null) vehicle.combustivel = row.fuel;
  if (row.cylinder_capacity !== null) vehicle.cilindrada = row.cylinder_capacity;
  if (row.vehicle_type !== null) vehicle.tipo = row.vehicle_type;

  return vehicle;
}

function vehicleParams(veiculo: Vehicle): unknown[] {
  return [
    veiculo.id,
    veiculo.categoria,
    veiculo.marca,
    veiculo.modelo,
    veiculo.versao ?? null,
    veiculo.ano,
    veiculo.km,
    Math.round(veiculo.preco * 100),
    veiculo.cambio ?? null,
    veiculo.combustivel ?? null,
    veiculo.cilindrada ?? null,
    veiculo.tipo ?? null,
    veiculo.imagem || null,
    JSON.stringify(veiculo.imagens),
    veiculo.descricao,
    JSON.stringify(veiculo.equipamentos),
    JSON.stringify(veiculo.fichaTecnica),
    veiculo.status,
    veiculo.destaque ? 1 : 0,
    JSON.stringify(veiculo.financiamento),
    veiculo.seoDescription,
  ];
}

const SELECT_COLUMNS = `
  id, category, brand, model, version, year, mileage, price_cents,
  transmission, fuel, cylinder_capacity, vehicle_type, image_url,
  images_json, description, equipment_json, technical_sheet_json,
  status, featured, financing_json, seo_description, created_at, updated_at
`;

export class D1VehicleRepository implements VehicleRepository {
  constructor(private readonly db: D1DatabaseLike) {}

  async listarPublicados(): Promise<Vehicle[]> {
    const result = await this.db
      .prepare(
        `SELECT ${SELECT_COLUMNS}
         FROM vehicles
         WHERE status != 'vendido'
         ORDER BY created_at ASC`,
      )
      .all<VehicleRow>();

    return result.results.map(rowToVehicle);
  }

  async listarTodos(): Promise<Vehicle[]> {
    const result = await this.db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM vehicles ORDER BY created_at ASC`)
      .all<VehicleRow>();

    return result.results.map(rowToVehicle);
  }

  async obterPorId(id: string): Promise<Vehicle | null> {
    const result = await this.db
      .prepare(`SELECT ${SELECT_COLUMNS} FROM vehicles WHERE id = ? LIMIT 1`)
      .bind(id)
      .first<VehicleRow>();

    return result ? rowToVehicle(result) : null;
  }

  async criar(veiculo: Vehicle): Promise<Vehicle> {
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `INSERT INTO vehicles (
          id, category, brand, model, version, year, mileage, price_cents,
          transmission, fuel, cylinder_capacity, vehicle_type, image_url,
          images_json, description, equipment_json, technical_sheet_json,
          status, featured, financing_json, seo_description, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(...vehicleParams(veiculo), now, now)
      .run();

    return (await this.obterPorId(veiculo.id)) as Vehicle;
  }

  async atualizar(id: string, dados: VehicleUpdate): Promise<Vehicle> {
    const atual = await this.obterPorId(id);
    if (!atual) {
      throw new Error(`Veículo "${id}" não encontrado.`);
    }

    const atualizado: Vehicle = { ...atual, ...dados, id: atual.id };
    const now = new Date().toISOString();

    await this.db
      .prepare(
        `UPDATE vehicles SET
          category = ?, brand = ?, model = ?, version = ?, year = ?, mileage = ?,
          price_cents = ?, transmission = ?, fuel = ?, cylinder_capacity = ?,
          vehicle_type = ?, image_url = ?, images_json = ?, description = ?,
          equipment_json = ?, technical_sheet_json = ?, status = ?, featured = ?,
          financing_json = ?, seo_description = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        atualizado.categoria,
        atualizado.marca,
        atualizado.modelo,
        atualizado.versao ?? null,
        atualizado.ano,
        atualizado.km,
        Math.round(atualizado.preco * 100),
        atualizado.cambio ?? null,
        atualizado.combustivel ?? null,
        atualizado.cilindrada ?? null,
        atualizado.tipo ?? null,
        atualizado.imagem || null,
        JSON.stringify(atualizado.imagens),
        atualizado.descricao,
        JSON.stringify(atualizado.equipamentos),
        JSON.stringify(atualizado.fichaTecnica),
        atualizado.status,
        atualizado.destaque ? 1 : 0,
        JSON.stringify(atualizado.financiamento),
        atualizado.seoDescription,
        now,
        id,
      )
      .run();

    return (await this.obterPorId(id)) as Vehicle;
  }
}
