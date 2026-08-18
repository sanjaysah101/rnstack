---
"create-rnstack": minor
---

Add build variants (development / preview / production) so dev, preview, and production builds can be installed **side by side** on one device — following Expo's standard app.config.ts pattern:

- `apps/mobile/app.config.ts` spreads the static `app.json` and appends a per-variant bundle-id suffix (`.dev` / `.preview` / none), name tag (`(Dev)` / `(Preview)`), and deep-link scheme, selected by `APP_VARIANT`.
- `apps/mobile/eas.json` ships `development` / `preview` / `production` build profiles (no account identity — `owner`/`projectId` still come from `eas init`).
- `src/lib/variant.ts` exposes the typed `APP_VARIANT` / `IS_PRODUCTION` at runtime (via `Constants.expoConfig.extra`).
- The scaffold's base bundle id (written by `--bundle-id-prefix`) lives in `app.json`; `app.config.ts` reads it, so the two compose with no extra env var. Replaced the `com.anonymous.mobile` placeholder with `com.example.mobile`.
- `.env.example` documents `APP_VARIANT`; README gains a Build variants section.
