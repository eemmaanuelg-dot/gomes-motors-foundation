import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const database = "gomes-motors-db";
const backupDir = resolve(process.cwd(), "backups");
const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
const output = resolve(backupDir, `${database}-${timestamp}.sql`);

mkdirSync(backupDir, { recursive: true });

const result = spawnSync(
  "npx",
  ["wrangler", "d1", "export", database, "--remote", `--output=${output}`],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Backup D1 concluído: ${output}`);
