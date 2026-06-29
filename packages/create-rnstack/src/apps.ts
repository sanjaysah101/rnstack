import { join } from "node:path";
import { copyDir, readJson, removePath, writeJson } from "./fs-utils.js";

type AppJson = {
  expo: { name: string; slug: string; scheme?: string } & Record<string, unknown>;
};

/**
 * The template ships one app at apps/mobile. Turn it into the requested set of
 * apps: rename the first in place, then copy it for each additional app. Each
 * app gets its own package name, Expo name/slug/scheme.
 */
export async function generateApps(projectRoot: string, appNames: string[]): Promise<void> {
  const appsDir = join(projectRoot, "apps");
  const templateDir = join(appsDir, "mobile");

  // Configure each target app from a fresh copy of the template.
  for (let i = 0; i < appNames.length; i++) {
    const name = appNames[i] as string;
    const destDir = join(appsDir, name);

    if (name !== "mobile") {
      await copyDir(templateDir, destDir);
    }

    await configureApp(destDir, name);
  }

  // If the template app ("mobile") isn't in the requested set, drop it.
  if (!appNames.includes("mobile")) {
    await removePath(templateDir);
  }
}

async function configureApp(appDir: string, name: string): Promise<void> {
  // package.json name
  const pkgPath = join(appDir, "package.json");
  const pkg = await readJson<{ name: string }>(pkgPath);
  pkg.name = name;
  await writeJson(pkgPath, pkg);

  // app.json: Expo name/slug/scheme
  const appJsonPath = join(appDir, "app.json");
  const appJson = await readJson<AppJson>(appJsonPath);
  appJson.expo.name = name;
  appJson.expo.slug = name;
  appJson.expo.scheme = name;
  await writeJson(appJsonPath, appJson);
}
