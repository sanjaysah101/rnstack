import { join } from "node:path";
import { copyDir, readJson, removePath, writeJson } from "./fs-utils.js";

type AppJson = {
  expo: {
    name: string;
    slug: string;
    scheme?: string;
    ios?: Record<string, unknown>;
    android?: Record<string, unknown>;
  } & Record<string, unknown>;
};

/** Android package / iOS bundle segments must be alphanumeric — drop dashes. */
function toIdSegment(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

/**
 * The template ships one app at apps/mobile. Turn it into the requested set of
 * apps: rename the first in place, then copy it for each additional app. Each
 * app gets its own package name, Expo name/slug/scheme, and a unique native
 * bundle identifier `<prefix>.<app>` (e.g. com.demo.customer).
 */
export async function generateApps(
  projectRoot: string,
  appNames: string[],
  bundleIdPrefix: string
): Promise<void> {
  const appsDir = join(projectRoot, "apps");
  const templateDir = join(appsDir, "mobile");

  for (let i = 0; i < appNames.length; i++) {
    const name = appNames[i] as string;
    const destDir = join(appsDir, name);

    if (name !== "mobile") {
      await copyDir(templateDir, destDir);
    }

    await configureApp(destDir, name, bundleIdPrefix);
  }

  // If the template app ("mobile") isn't in the requested set, drop it.
  if (!appNames.includes("mobile")) {
    await removePath(templateDir);
  }
}

async function configureApp(appDir: string, name: string, bundleIdPrefix: string): Promise<void> {
  // package.json name
  const pkgPath = join(appDir, "package.json");
  const pkg = await readJson<{ name: string }>(pkgPath);
  pkg.name = name;
  await writeJson(pkgPath, pkg);

  // app.json: Expo name/slug/scheme + unique native identifiers.
  const appJsonPath = join(appDir, "app.json");
  const appJson = await readJson<AppJson>(appJsonPath);
  const bundleId = `${bundleIdPrefix}.${toIdSegment(name)}`;

  appJson.expo.name = name;
  appJson.expo.slug = name;
  appJson.expo.scheme = name;
  // Merge, preserving existing ios/android config (icons, etc.).
  appJson.expo.ios = { ...appJson.expo.ios, bundleIdentifier: bundleId };
  appJson.expo.android = { ...appJson.expo.android, package: bundleId };

  await writeJson(appJsonPath, appJson);
}
