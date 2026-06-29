import { cp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

/** Recursively remove a path if it exists (no error if missing). */
export async function removePath(target: string): Promise<void> {
  await rm(target, { recursive: true, force: true });
}

/** Read a JSON file. */
export async function readJson<T = Record<string, unknown>>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, "utf8")) as T;
}

/** Write a JSON file with 2-space indent + trailing newline. */
export async function writeJson(file: string, data: unknown): Promise<void> {
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/** Copy a directory tree. */
export async function copyDir(src: string, dest: string): Promise<void> {
  await cp(src, dest, { recursive: true });
}

/**
 * Replace every occurrence of each `[from, to]` pair across all UTF-8 text files
 * under `dir`, skipping binary-ish and dependency directories. Used to rebrand
 * the scaffolded project (project name, etc.).
 */
const SKIP_DIRS = new Set(["node_modules", ".git", ".turbo", ".expo", "dist", "android", "ios"]);
const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mjs",
  ".cjs",
  ".yaml",
  ".yml",
  ".css",
  ".env",
  ".example",
]);

export async function replaceInTree(dir: string, replacements: [string, string][]): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) {
          return;
        }
        await replaceInTree(full, replacements);
        return;
      }
      const dot = entry.name.lastIndexOf(".");
      const ext = dot === -1 ? "" : entry.name.slice(dot);
      if (!TEXT_EXT.has(ext)) {
        return;
      }
      let content = await readFile(full, "utf8");
      let changed = false;
      for (const [from, to] of replacements) {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      }
      if (changed) {
        await writeFile(full, content, "utf8");
      }
    })
  );
}
