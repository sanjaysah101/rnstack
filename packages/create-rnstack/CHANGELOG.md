# create-rnstack

## 0.4.0

### Minor Changes

- Add build variants (development / preview / production) so dev, preview, and production builds can be installed **side by side** on one device, following Expo's standard `app.config.ts` pattern:

  - `apps/mobile/app.config.ts` spreads the static `app.json` and appends a per-variant bundle-id suffix (`.dev` / `.preview` / none), name tag (`(Dev)` / `(Preview)`), and deep-link scheme, selected by `APP_VARIANT`.
  - `apps/mobile/eas.json` ships `development` / `preview` / `production` build profiles (no account identity — `owner`/`projectId` still come from `eas init`).
  - `src/lib/variant.ts` exposes typed `APP_VARIANT` / `IS_PRODUCTION` at runtime.
  - The base bundle id (written by `--bundle-id-prefix`) lives in `app.json`; `app.config.ts` reads it, so the two compose with no extra env var. Replaced the `com.anonymous.mobile` placeholder with `com.example.mobile`.
  - The scaffold outro now surfaces the variants and the immutable-bundle-id warning.

## 0.3.1

### Patch Changes

- Bump the template to the Expo SDK 57.0.14 patch (expo, expo-constants, expo-router, expo-splash-screen). Keeps a fresh scaffold in sync with the latest Expo Go build so it doesn't hit "Project is incompatible with this version of Expo Go". Also pins `@expo/metro-runtime` via an override to work around a stuck pnpm store resolution.

## 0.3.0

### Minor Changes

- Upgrade the template to **Expo SDK 57** (React Native 0.86.2, New Architecture):

  - Bump expo + all `expo-*` packages and the RN family (react-native 0.86.2, reanimated 4.5.1, worklets 0.10.1, gesture-handler ~2.32, screens ~4.26, `@expo/ui` 57) to the SDK-57 matrix; workspace overrides re-pinned in lockstep. Versions taken from Expo's `bundledNativeModules.json` (not npm `@latest`).
  - Update `@rn-primitives/*` to 1.5.x and refresh other dependency floors (tailwindcss 4.3.3, lucide-react-native 1.31, biome 2.5.8, turbo 2.10.10, etc.).
  - Tighten `@repo/ui` / `@repo/api-client` peer-dependency ranges off `"*"` to sensible floors (silences a false-positive security warning; the app still provides the single pinned runtime).
  - Force `tar` to a patched `>=7.5.19` via a workspace override (the `tiged` → `tar@6` chain had unpatched node-tar advisories; dev-only, template extraction, never in the app bundle).
  - `expo-doctor` is clean (21/21) and the Android bundle compiles on SDK 57.

## 0.2.0

### Minor Changes

- eb40b4c: Production-focused scaffolding improvements:

  - **Per-app bundle identifiers** — each generated app gets a unique `ios.bundleIdentifier` and `android.package` (`<prefix>.<app>`, e.g. `com.demo.customer`); configurable via `--bundle-id-prefix` (default `com.<project>`).
  - **Clean root metadata** — the rebrand no longer leaks the starter's repository URL, description, keywords, or release scripts into generated projects.
  - **Demos are opt-in** — the component gallery, data-demo screen, and example API hook are excluded by default (production-first). Include them with `--demo`; the interactive prompt defaults to No.
  - **README attribution** — generated projects get a project-specific README crediting `create-rnstack` (with version + link).
  - **Husky pre-commit ships** — the `.husky/pre-commit` hook is no longer stripped, so commit-time lint/typecheck works out of the box.
  - **Expo dependency validation** — apps include a `doctor` script (`expo install --check`), a shared Turbo `doctor` task, and a `postinstall` that validates SDK alignment as a non-blocking warning. Template Expo deps updated to the latest SDK 56 patch releases.
  - The intro now prints the CLI version.

## 0.1.1

### Patch Changes

- abe1457: Scaffolded projects now start as a fresh git repo with an initial commit (skippable with `--no-git`), ship a root `AGENTS.md` with vendor-neutral AI-agent context, and no longer copy rnstack's own CHANGELOG files. Also fixed the git commit failing on Windows due to shell argument splitting.

## 0.1.0

### Minor Changes

- Initial release. Scaffold a new rnstack monorepo in one command
  (`pnpm create rnstack <name>` / `npx create-rnstack <name>`): fetches the template at a
  pinned release tag, strips template-internal files, rebrands the project, optionally fans
  out multiple apps under `apps/`, and installs dependencies. Supports `--apps`, `--pm`,
  `--no-install`, and `-y` for non-interactive use.
