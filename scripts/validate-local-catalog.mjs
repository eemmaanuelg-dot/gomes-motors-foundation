import { execFileSync } from "node:child_process";

const output = execFileSync(
  "npx",
  [
    "wrangler",
    "d1",
    "execute",
    "gomes-motors-db",
    "--local",
    "--json",
    "--command",
    "SELECT v.id, v.status, i.published, i.display_order FROM vehicles v INNER JOIN inventory_entries i ON i.vehicle_id = v.id ORDER BY i.display_order ASC;",
  ],
  { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
);

const payload = JSON.parse(output);
const rows = payload.flatMap((entry) => entry.results ?? []);
const expectedIds = [
  "civic-exl",
  "corolla-gli",
  "polo",
  "onix",
  "cb500f",
  "mt03",
];

const actualIds = rows.map((row) => row.id);
const published = rows.filter((row) => Number(row.published) === 1);
const invalidStatus = rows.filter((row) => row.status === "vendido");

if (rows.length !== expectedIds.length) {
  throw new Error(`Catálogo público inválido: esperado ${expectedIds.length} veículos, recebido ${rows.length}.`);
}

if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
  throw new Error(
    `Catálogo público inválido: ordem/IDs recebidos ${JSON.stringify(actualIds)}.`,
  );
}

if (published.length !== expectedIds.length || invalidStatus.length > 0) {
  throw new Error("Catálogo público inválido: existem veículos não publicados ou vendidos.");
}

console.log(
  `Catálogo local validado com sucesso: ${rows.length} veículos publicados, ordem e IDs conferidos.`,
);
