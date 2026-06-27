import fs from "node:fs/promises";
import path from "node:path";
import { SNAPSHOT_DIR, isValidSnapshot } from "./paths";

export async function readSnapshot(name: string): Promise<any | null> {
  if (!isValidSnapshot(name)) return null;
  try {
    const raw = await fs.readFile(path.join(SNAPSHOT_DIR, `${name}.json`), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeSnapshotAtomic(name: string, data: unknown): Promise<void> {
  if (!isValidSnapshot(name)) throw new Error(`invalid snapshot name: ${name}`);
  await fs.mkdir(SNAPSHOT_DIR, { recursive: true });
  const dest = path.join(SNAPSHOT_DIR, `${name}.json`);
  const tmp = path.join(SNAPSHOT_DIR, `.${name}.${Date.now()}.tmp`);
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, dest);
}
