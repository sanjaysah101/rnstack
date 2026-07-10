import { join } from "node:path";
import { readJson, writeJson } from "./fs-utils.js";

type RootPkg = {
  name: string;
  version?: string;
  private?: boolean;
  description?: string;
  keywords?: string[];
  repository?: unknown;
  author?: unknown;
  scripts?: Record<string, string>;
} & Record<string, unknown>;

// Scripts that only make sense in the rnstack repo (publishing the CLI, cutting
// releases) — they reference create-rnstack / changesets and must not leak.
const SCAFFOLD_ONLY_SCRIPTS = ["changeset", "version-packages", "release"];

/**
 * Reset the generated root package.json to clean, project-neutral metadata.
 * The blind `rnstack -> name` rename corrupts starter-owned fields (repository
 * URL, description, keywords, release script); this runs AFTER the rename and
 * overwrites them so the user's project doesn't inherit rnstack's identity.
 */
export async function configureRootMetadata(projectRoot: string, name: string): Promise<void> {
  const pkgPath = join(projectRoot, "package.json");
  const pkg = await readJson<RootPkg>(pkgPath);

  pkg.name = name;
  pkg.version = "0.1.0";
  pkg.private = true;
  pkg.description = "";
  pkg.keywords = [];
  pkg.repository = undefined;
  pkg.author = undefined;

  if (pkg.scripts) {
    for (const s of SCAFFOLD_ONLY_SCRIPTS) {
      delete pkg.scripts[s];
    }
  }

  // Drop undefined keys so they don't serialize as null.
  for (const key of Object.keys(pkg)) {
    if (pkg[key] === undefined) {
      delete pkg[key];
    }
  }

  await writeJson(pkgPath, pkg);
}
