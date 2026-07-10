import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { removePath } from "./fs-utils.js";

// Bundled demo-free overrides ship alongside the built CLI (dist/../templates).
const CLI_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OVERRIDES = join(CLI_ROOT, "templates", "no-demo");

// Demo/reference content to remove from EACH app when demos are excluded.
const APP_DEMO_PATHS = [
  "src/app/gallery",
  "src/app/data-demo.tsx",
  "src/components/demo-screen.tsx",
  "src/lib/gallery.ts",
];

/**
 * Remove the component gallery, data-demo, and example API hook, then replace
 * the files that referenced them with clean, demo-free versions. Runs per app
 * (plus the shared api-client) after apps are generated.
 */
export async function stripDemos(projectRoot: string, appNames: string[]): Promise<void> {
  // 1. Remove the shared example hook + its export.
  await removePath(join(projectRoot, "packages/api-client/src/hooks/use-example-posts.ts"));
  await copyOverride(
    join(OVERRIDES, "api-client-index.ts"),
    join(projectRoot, "packages/api-client/src/index.ts")
  );

  // 2. Per app: delete demo routes/files and swap Home + Settings for clean copies.
  for (const app of appNames) {
    const appDir = join(projectRoot, "apps", app);
    await Promise.all(APP_DEMO_PATHS.map((p) => removePath(join(appDir, p))));
    await copyOverride(join(OVERRIDES, "home.tsx"), join(appDir, "src/app/(tabs)/index.tsx"));
    await copyOverride(
      join(OVERRIDES, "settings.tsx"),
      join(appDir, "src/app/(tabs)/settings.tsx")
    );
  }
}

async function copyOverride(from: string, to: string): Promise<void> {
  await writeFile(to, await readFile(from, "utf8"), "utf8");
}
