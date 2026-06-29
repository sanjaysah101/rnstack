import { z } from "zod";

/**
 * Single source of truth for environment configuration. Validated with Zod at
 * import time so a misconfigured .env fails fast with a clear message instead of
 * surfacing as a confusing runtime error deep in the app.
 *
 * NOTE: Expo (Metro) statically inlines `EXPO_PUBLIC_*` vars at build time — they
 * are find-and-replaced in the bundle, so each one must be referenced as a
 * literal `process.env.EXPO_PUBLIC_FOO`. Do NOT read them dynamically
 * (e.g. `process.env[key]`) — that breaks the inlining and yields undefined.
 */
const EnvSchema = z.object({
  // Zod v4: use the top-level z.url() (the chained .url() method is deprecated).
  EXPO_PUBLIC_API_BASE_URL: z.url({
    error:
      "EXPO_PUBLIC_API_BASE_URL must be a valid URL (e.g. https://api.example.com) — set it in apps/mobile/.env",
  }),
});

const parsed = EnvSchema.safeParse({
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(
    `Invalid environment configuration:\n${issues}\n\nCopy .env.example to apps/mobile/.env and fill in the values.`
  );
}

export const env = parsed.data;
