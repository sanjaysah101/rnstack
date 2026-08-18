import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Dynamic Expo config for build variants (development / preview / production).
 *
 * This spreads the static base in `app.json` and overlays the variant-specific
 * bits so dev, preview, and production can be **installed side by side** on one
 * device (Android/iOS identify apps by their bundle identifier).
 *
 * ⚠️ `app.config.ts` takes precedence over `app.json` when both exist — edit
 * static values (icons, plugins) in `app.json`, variant logic here.
 *
 * The variant is selected by `APP_VARIANT` (set per profile in `eas.json`, or
 * inline: `APP_VARIANT=preview npx expo start`). Defaults to development.
 */
const VARIANTS = ["development", "preview", "production"] as const;
type Variant = (typeof VARIANTS)[number];

const variant: Variant = VARIANTS.includes(process.env.APP_VARIANT as Variant)
  ? (process.env.APP_VARIANT as Variant)
  : "development";

// Per-variant identifier suffix. Production keeps the base id (immutable once
// published); dev/preview add a suffix so they don't collide with production.
const SUFFIX: Record<Variant, string> = {
  development: ".dev",
  preview: ".preview",
  production: "",
};

// Per-variant display name so the icons are distinguishable on one device.
const NAME_TAG: Record<Variant, string> = {
  development: " (Dev)",
  preview: " (Preview)",
  production: "",
};

export default ({ config }: ConfigContext): ExpoConfig => {
  // Base bundle id from app.json (the create-rnstack CLI writes the real one at
  // scaffold time). Falls back to a documented placeholder — change it in app.json.
  const baseId = config.android?.package ?? config.ios?.bundleIdentifier ?? "com.example.app";
  const bundleId = `${baseId}${SUFFIX[variant]}`;
  const baseName = config.name ?? "App";

  return {
    ...config,
    name: `${baseName}${NAME_TAG[variant]}`,
    // slug MUST stay static across variants — it's the EAS project identity;
    // varying it creates separate EAS projects and breaks update channels.
    slug: config.slug ?? "app",
    // Deep-link scheme must differ per variant or the OS routes links to an
    // arbitrary installed build.
    scheme: variant === "production" ? config.scheme : `${config.scheme}-${variant}`,
    ios: { ...config.ios, bundleIdentifier: bundleId },
    android: { ...config.android, package: bundleId },
    extra: {
      ...config.extra,
      variant,
      apiUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    },
  };
};
