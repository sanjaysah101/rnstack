---
name: rnstack-project
description: Architecture, conventions, and native gotchas for the rnstack React Native monorepo starter. READ THIS before adding or editing code in this repo — especially before touching NativeWind theming, RN Reusables components, the package layout, or the dependency setup. Applies to any work under apps/* or packages/*.
---

# rnstack — project guide

**rnstack** is a batteries-included, **mobile-first** React Native monorepo starter: Expo + Turborepo + pnpm, NativeWind v5 (Tailwind v4), and React Native Reusables (RNR) components pre-fixed to render correctly on native. The goal is that a user can scaffold a working RN monorepo in one command instead of fighting the setup for days.

> Branding: the product/package name is **rnstack** (root `package.json` `name: "rnstack"`; CLI: `create-rnstack`; repo: github.com/sanjaysah101/rnstack). The local working folder may still be named `rn-monorepo` — that's cosmetic; the product is **rnstack**.

Primary target is **native (iOS/Android)**. Web works but is secondary — never trade native correctness for web parity.

## Repository layout

```
rn-monorepo/
├── apps/
│   └── mobile/                 # Expo app (expo-router, SDK 57)
│       ├── src/
│       │   ├── app/            # expo-router routes
│       │   │   ├── (tabs)/      #   Home (index) + Settings tab group
│       │   │   ├── gallery/     #   component gallery (pushed over tabs)
│       │   │   └── data-demo.tsx#   api-client demo (pushed over tabs)
│       │   ├── lib/            # app glue: theme.ts (THEME/NAV_THEME), env.ts,
│       │   │                   #   api.ts, theme-storage.ts
│       │   └── global.css      # SINGLE source of truth for theming (see below)
│       ├── metro.config.js     # minimal; expo/metro-config handles the monorepo
│       ├── babel.config.js     # explicit react-native-worklets/plugin (pnpm needs it)
│       ├── app.json            # static Expo base (bundle id, icons, plugins)
│       ├── app.config.ts       # dynamic: APP_VARIANT suffixes (dev/preview/prod)
│       ├── eas.json            # build profiles (no account identity)
│       └── AGENTS.md           # "read versioned Expo docs before coding"
├── packages/
│   ├── ui/                     # @repo/ui — the shared UI kit (RNR components live here)
│   │   ├── src/
│   │   │   ├── components/ui/  # RNR components (button, input, dialog, ...)
│   │   │   ├── lib/utils.ts    # cn()
│   │   │   └── index.ts        # barrel: re-exports lib/utils
│   │   └── components.json     # RNR/shadcn CLI config (aliases point at @repo/ui)
│   ├── api-client/             # @repo/api-client — http() + 401 refresh + TanStack Query
│   │   └── src/
│   │       ├── http.ts         # createHttpClient: /v1, error envelope, single-flight 401 retry
│   │       ├── auth/types.ts   # AuthProvider interface (the swap-in seam)
│   │       ├── auth/jwt.ts     # default JWT + expo-secure-store provider
│   │       ├── query.tsx       # ApiProvider + createQueryClient
│   │       └── hooks/          # example query hooks (delete the example one)
│   ├── config/                 # @repo/config — shared tsconfig.base.json + biome.json
│   └── create-rnstack/         # the scaffolding CLI (Node; published to npm)
│       └── src/                # index.ts (orchestrator), apps.ts, fs-utils.ts
├── pnpm-workspace.yaml         # workspaces + nodeLinker: hoisted + overrides + allowBuilds
└── turbo.json                  # lint / typecheck / build / start / dev tasks
```

## Non-negotiable setup decisions (do NOT revert without strong reason)

These were each chosen to fix a concrete, verified breakage. Changing them re-breaks native.

1. **`nodeLinker: hoisted`** in `pnpm-workspace.yaml`. pnpm's default isolated store creates a *separate instance of `react-native` per peer context*, loading two copies into one bundle → `Maximum call stack size exceeded` at startup. Hoisting guarantees one physical copy. This is Expo's recommended linker for monorepos.
2. **Workspace `overrides`** pin every RN-family package (`react`, `react-native`, `react-native-reanimated`, `react-native-worklets`, `react-native-safe-area-context`, `react-native-screens`) to one version. Belt-and-suspenders with hoisting.
3. **`lightningcss: 1.30.1`** override. Newer 1.32.x crashes the react-native-css compiler ("failed to deserialize Specifier"). pnpm v11 reads overrides from `pnpm-workspace.yaml`, NOT `package.json`.
4. **`apps/mobile/babel.config.js`** explicitly adds `react-native-worklets/plugin` with `{ worklets: false, reanimated: false }` on the preset. In a pnpm monorepo `babel-preset-expo` can't resolve the worklets plugin from its hoisted location and silently skips it → reanimated recursion crash.
5. **`@repo/ui` RN-family deps are `peerDependencies`** (+ dev copies for standalone typecheck), never regular `dependencies` — the app provides the single native runtime.
6. **`metro.config.js` is minimal.** Expo SDK 52+ auto-configures monorepos; do not add manual `watchFolders` / `nodeModulesPaths` / resolver hacks.

## Theming — `apps/mobile/src/global.css` is the canonical palette

NativeWind v5 + Tailwind v4 is **CSS-first** (no `tailwind.config.js`). Structure: tokens → `@theme inline` → `@source`.

**Three rules that are not optional — each fixes a bug that only appears on native:**

- **Store color tokens as FULL colors**, e.g. `--primary: hsl(0 0% 9%)`, and reference them in `@theme inline` as `var(--primary)`. Do NOT store bare HSL channels (`0 0% 9%`) consumed via `hsl(var(--primary))`. Channel-tokens + an opacity modifier (`bg-primary/90`, `dark:bg-input/30`) **flicker** on theme change on native.
- **Radius tokens must be concrete rems** (`--radius-md: 0.5rem`), never `calc(var(--radius) - 2px)`. react-native-css doesn't resolve nested `calc(var())` on native → `rounded-*` collapses to 0 (square corners).
- **`@source "../../../packages/ui/src/**/*.{ts,tsx}"`** must stay — workspace packages are symlinked and Tailwind won't scan them otherwise, so classes used only in `@repo/ui` get purged.

Dark mode: NativeWind v5 maps `dark:` to `@media (prefers-color-scheme: dark)`. Toggle at runtime with `Appearance.setColorScheme()` — the `useColorScheme` hook from `nativewind` is deprecated; use the one from `react-native`.

**Theme preference (light/dark/system):** `@repo/ui/lib/theme-context` (`ThemeProvider` + `useThemePreference`) owns the persisted three-way choice. It calls `Appearance.setColorScheme(pref === "system" ? "unspecified" : pref)` — note RN 0.86's `ColorSchemeName` is `'light' | 'dark' | 'unspecified'` (NO `null`); "unspecified" is how you follow the OS. The provider is storage-agnostic via a `ThemeStorage` adapter; the app wires AsyncStorage in `lib/theme-storage.ts`. Wrap once in the root `_layout.tsx` (outermost, so the saved scheme is applied before the React Navigation theme reads `useColorScheme()`). The Settings screen's Appearance section is the UI for it; the simpler `ThemeToggle` (two-way, no persistence) still exists for quick in-screen toggles.

### ⚠️ Theme colors live in TWO places — keep them in sync

`global.css` and `apps/mobile/src/lib/theme.ts` hold the **same color values** for two different systems that can't read each other. **When you re-brand or change any token, edit BOTH** (light *and* dark in each), or the navigator chrome will drift from the app UI.

- **`global.css`** — drives **NativeWind/Tailwind utilities** (`bg-primary`, `text-foreground`, …). Every `@repo/ui` component styled via `className` reads from here. Values are CSS custom properties.
- **`lib/theme.ts`** — a JS mirror of the same tokens for things that can't use `className`:
  - `NAV_THEME` → React Navigation's `ThemeProvider` (header / screen background / border in `_layout.tsx`).
  - `THEME` → raw color strings for any inline `style` / non-className consumer (e.g. a chart lib, an icon tint computed in JS).

They're duplicated because NativeWind (CSS variables) and React Navigation (a JS theme object) are separate systems — there is no single runtime value both consume. Treat `global.css` as the canonical palette and `theme.ts` as its hand-maintained JS copy. (A future improvement could generate `theme.ts` from the CSS tokens; until then it's manual.)

## Data layer — `@repo/api-client`

A typed HTTP client + TanStack Query wiring that stays **auth-agnostic**. The design principle: the client owns transport (base URL + `/v1`, JSON, error envelope, single-flight 401 refresh + retry); it never owns auth.

- **`createHttpClient({ baseUrl, apiPrefix?, auth? })`** → `{ get, post, put, patch, delete, request }`, all generic over the response type. Throws `HttpError` (with `status` + parsed `body`) on non-2xx. On a 401 it calls `auth.refresh()` **once** for a burst of concurrent failures (single-flight), retries with the new token, and calls `auth.onAuthError()` if refresh fails.
- **`AuthProvider`** (`auth/types.ts`) is the swap-in seam: `{ getAccessToken, refresh, onAuthError? }`. Ship the default **`createJwtAuthProvider({ refreshUrl })`** (`auth/jwt.ts`) — bearer access token in `expo-secure-store`, refresh against an endpoint. To use **Clerk / Supabase / Firebase**, write a ~15-line provider returning that SDK's token; transport/refresh plumbing is unchanged. Never hardcode an auth scheme into `http.ts`.
- **`ApiProvider`** (`query.tsx`) wraps the app once (in `_layout.tsx`); `createQueryClient()` sets mobile defaults (no refetch-on-focus, retry 2, 30s stale).
- App glue lives in `apps/mobile/src/lib/api.ts` (`createHttpClient` + `EXPO_PUBLIC_API_BASE_URL` + JWT provider). Screens call **query hooks, never `fetch` directly**.
- **Cancellation:** `RequestOptions` extends `RequestInit`, so pass `signal` to cancel (`api.get(path, { signal })`). In hooks, forward TanStack Query's signal — `queryFn: ({ signal }) => api.get(path, { signal })` — so requests auto-cancel on unmount/refetch.
- `hooks/use-example-posts.ts` + the `data-demo` route are a removable demo pointed at a public API so a fresh clone shows live data — delete both when wiring a real backend.

## Writing / editing RN Reusables components (native correctness)

RNR's published components target web patterns; several break only on device. Before editing a component, know these:

- **`grid` / grid-`gap` do nothing on native.** Use `flex flex-col gap-N`.
- **Android `TextInput` clips text and shrinks when empty.** The fix pattern (see `components/ui/input.tsx`): wrap the `TextInput` in a `View` that owns the fixed height (`h-10`); let the input fill it at natural line size (`flex-1 p-0 leading-5`, no `h-full`); set `style={{ includeFontPadding: false, textAlignVertical: "center" }}` (these are TextStyle props, not JSX props — `includeFontPadding` is not on `TextInputProps`).
- **Web-only utilities** (`hover:`, `focus-visible:`, `ring-*`, `outline-none`, `transition-*`, `select-text`, `scroll-m-*`) belong inside `Platform.select({ web: ... })`. They are no-ops on native and clutter the native style.
- Always test components **on a device/emulator**, not just web — web rendering is not representative.

**Forked-for-v5 components (kept in sync with upstream).** Four RNR components are patched for NativeWind v5 and will drift as RNR ships updates: `icon.tsx` (`cssInterop`→`styled`), `input.tsx` (Android clip fix), `textarea.tsx` (placeholder via `placeholder:` utility), `select.tsx` (native width via `triggerPosition.width`). When re-importing RNR or bumping its version, follow the re-import + re-apply ritual in `docs/rnr-sync.md` and re-apply those four. `button.tsx` etc. are NOT forked — don't invent changes there.

Full detail on these gotchas is also captured in the memory note `nativewind-v5-native-gotchas`.

## Conventions

- **Imports inside `@repo/ui`** use the package's own name + subpath: `import { cn } from "@repo/ui/lib/utils"`, `import { Text } from "@repo/ui/components/ui/text"`. Resolution works via the package `exports` map (`./components/*` → `./src/components/*.tsx`, `./lib/*` → `./src/lib/*.ts`).
- **One component = one import path. Do NOT add a barrel** (`components/ui/index.ts` or re-exporting everything from `src/index.ts`). Always import per file: `@repo/ui/components/ui/button`, not `@repo/ui/components/ui`. This is deliberate, not an accident of the RNR CLI: Metro's tree-shaking is weak, so a barrel pulls the whole component graph into every screen's bundle (larger bundle, slower cold start). The verbosity is handled by editor auto-import. (There are no export-name collisions today, so a barrel is *safe* — it's just *worse for bundle size*, which is why we don't.)
- **App imports** use `@/*` (→ `apps/mobile/src/*`) for app code and `@repo/ui/...` for the kit.
- **File naming:** components/files are **kebab-case** (`theme-toggle.tsx`, `alert-dialog.tsx`). Exported React components are PascalCase; hooks are `useXxx`.
- **Styling:** Tailwind classes via `className`, composed with `cn()`. No inline `StyleSheet` unless a prop can't be expressed in Tailwind (e.g. the `includeFontPadding` case).
- **Package names:** internal packages are scoped `@repo/*`. (When publishing, swap `@repo` for a real npm scope.)
- **Tooling:** Biome (not ESLint/Prettier) — config in `@repo/config/biome.json`, 2-space indent, 100 col. Run `pnpm lint` / `pnpm typecheck` (Turbo) before committing. TypeScript `strict`, `moduleResolution: bundler`.
- **Env vars:** all env access goes through ONE validated module — `apps/mobile/src/lib/env.ts` (Zod `safeParse` at import time; throws a clear error if a var is missing/invalid so misconfiguration fails fast). Never read `process.env` elsewhere — import `env` from there. Add a new var by extending the schema, `.env.example`, and `turbo.json` globalEnv. Public runtime config uses the `EXPO_PUBLIC_*` prefix. **Expo gotcha:** Metro statically inlines `EXPO_PUBLIC_*` at build time, so each must be referenced as a literal `process.env.EXPO_PUBLIC_FOO` (the schema input object does this) — never dynamic (`process.env[key]`), which breaks inlining.
- **Expo SDK 57:** read the versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing Expo-specific code (per `apps/mobile/AGENTS.md`).

### Upgrading the Expo SDK (gotchas learned on 56→57)

- **Get the exact RN-family versions from Expo's `bundledNativeModules.json`, NOT `npm @latest`.** For a target SDK: `https://raw.githubusercontent.com/expo/expo/sdk-<N>/packages/expo/bundledNativeModules.json`. `@latest` is often *ahead* of the SDK (e.g. SDK 57 uses react-native 0.86.2 and gesture-handler ~2.32, while npm latest was 0.87 / 3.2.1). Installing `@latest` breaks `expo-doctor`.
- **Bump ALL `expo-*` packages together**, not just `expo` — a mixed graph (expo 57 + expo-constants 56) is unsatisfiable and crashes the pnpm resolver.
- **Re-pin the `pnpm-workspace.yaml` overrides in lockstep** (react-native, reanimated, worklets, screens) to the new SDK versions, and sync the `@repo/*` dev/peer RN copies — otherwise the overrides fight `expo install`.
- **Stuck transitive Expo pins** (e.g. `@expo/metro-runtime@56`, `@expo/dom-webview@56` lingering after a bump) are a **pnpm store-cache** artifact: `rm -f pnpm-lock.yaml && pnpm install --force` clears them. Plain `pnpm install` won't.
- **Peer dependencies stay permissive floors** (`react-native: ">=0.79.0"`, not the exact SDK version). The APP pins the exact runtime; `@repo/ui`/`@repo/api-client` only gate out truly-incompatible old versions. Do NOT tighten peers to the current SDK — it causes false conflicts and forced lockstep bumps. Never use `"*"` (a security scanner flags it as matching ancient vulnerable versions).
- **Verify after:** `npx expo-doctor` (must be clean), `pnpm typecheck`, `pnpm lint`, and a real `npx expo export --platform android` bundle. Then bump the SDK version strings in `AGENTS.md` (×2), `README.md`, and this skill.

## How to add things

**Add an RNR component** — run the RNR CLI from `packages/ui` (it reads `components.json`, writes into `src/components/ui`, and adds `@rn-primitives/*` deps):
```
cd packages/ui && npx @react-native-reusables/cli@latest add <name> --yes
```
Then audit it for the native gotchas above (grid, TextInput, web-only utils) before using it.

**Add a shared component to the kit:** put it in `packages/ui/src/components/...`, import within the package via `@repo/ui/...`, and (if it should be part of the public surface) re-export from `src/index.ts`.

**Add a screen:** create a route file under `apps/mobile/src/app/` (expo-router file-based routing).

**Component gallery / test harness:** `apps/mobile/src/app/gallery/` holds one demo route per
`@repo/ui` component (driven by the registry in `apps/mobile/src/lib/gallery.ts`, grouped into
Tier 1 primitives / Tier 2 inputs / Tier 3 overlays). Each screen uses the `DemoScreen` +
`DemoSection` wrappers from `apps/mobile/src/components/demo-screen.tsx` (themed ScrollView with a
ThemeToggle pinned top-right). This exists because RNR targets NativeWind v4 and we run v5-preview —
every component must be eyeballed on-device in Expo Go for styling/flicker. When adding a new
`@repo/ui` component, also add a gallery entry + demo route, and eyeball it on-device.

## Building the app — keep it build-tool agnostic

This is a **starter/CLI template**: it must NOT bake in any individual's EAS/cloud **account** —
but generic build *config* (profiles) IS shipped. The default path is local dev (`pnpm start`).

**Committed — generic, no account identity:** `apps/mobile/eas.json` ships **build profiles only**
(`development` / `preview` / `production` with `APP_VARIANT` env), and `apps/mobile/app.config.ts`
+ `app.json` define the variant bundle ids/names. These are safe for everyone.

**Deliberately NOT committed** (each ties to one Expo account / would break forkers): `owner` and
`extra.eas.projectId` — `eas init` writes these into the *developer's own* copy. Do NOT add account
identifiers to the template; that leaks the maintainer's org identity and makes every fork's build
fail. (The rule is "no account identity", NOT "no eas.json".)

**Build variants** (`app.config.ts`): a dynamic config spreads `app.json` and appends per-variant
suffixes so dev/preview/production install side by side. `APP_VARIANT` (set per eas.json profile)
→ `.dev`/`.preview`/`""` bundle-id suffix + `(Dev)`/`(Preview)` name + distinct scheme. The base
bundle id lives in `app.json` `android.package` (the CLI's `configureApp` writes the real one at
scaffold; `app.config.ts` reads it — the two compose, no `APP_BUNDLE_ID` env needed). Runtime
access via `src/lib/variant.ts` (`APP_VARIANT`, `IS_PRODUCTION`) reading `Constants.expoConfig.extra`.
⚠️ `app.config.ts` takes precedence over `app.json` when both exist (a known footgun — edit static
values in `app.json`, variant logic in `app.config.ts`); `slug` MUST stay static (EAS identity).

**Local native build** (needs Android Studio / Xcode): `npx expo run:android` / `run:ios`, or
`npx expo prebuild` then Gradle/Xcode. `package.json` already has `android`/`ios` scripts.

**EAS cloud build** (opt-in — no local toolchain). Non-obvious rules (each fixed a real failure):

1. **Run every `eas` command from `apps/mobile/`, never the repo root.** `eas init` / `eas build`
   key off the nearest `app.json`. Run at the root and the CLI links a *different* project (e.g.
   `@<account>/rnstack`) and writes a stray root `eas.json` — delete it if that happens.
2. **`eas project:init --path <dir>` does not exist** — `--path` is not a valid flag. Use
   `cd apps/mobile && eas init`.
3. **Cloud keystore:** on the first Android build, answer **yes** to "Generate a new Android
   Keystore?" — Expo stores it server-side (works with no local `keytool`).
4. **Monorepo install on the server:** EAS uploads only git-tracked source and installs on its
   workers using the root `pnpm-lock.yaml` + `pnpm-workspace.yaml` (`nodeLinker: hoisted`). Keep
   the lockfile committed/in sync.
5. No-Android-Studio: when EAS asks "Install and run on emulator?", answer **no** (yes →
   `spawn adb ENOENT`, harmless — the build artifact is already done). Or use `--no-wait`.

```sh
eas login && cd apps/mobile
eas init && eas build:configure                  # links YOUR account; writes app.json + eas.json
eas build --platform android --profile preview   # installable APK; prints a download URL/QR
```

## Verifying changes

- `pnpm typecheck` (Turbo, all packages) — or `cd apps/mobile && npx tsc --noEmit`. NOTE: a stray `apps/mobile/example/` dir (leftover Expo template) reports unrelated errors — filter them out (`grep -v '^example/'`).
- `pnpm lint` (Biome via Turbo). Don't run `npx biome` directly — npm's devEngines guard rejects it; use `pnpm exec biome ...`.
- Real check for native runtime issues: `cd apps/mobile && npx expo export --platform android --output-dir <tmp>` compiles the full bundle (catches resolution/CSS-compile errors a typecheck misses). For behavior, run on device with `npx expo start --clear`.
- After babel/metro/resolver/linker changes, ALWAYS clear cache (`--clear`) — stale Metro cache masks fixes.

## Versioning & releases — Changesets

Every package/app is independently versioned with **[Changesets](https://github.com/changesets/changesets)** (config in `.changeset/`). Baseline is `0.1.0`. This repo uses the **version-on-`main`** flow — the CHANGELOG is written at release time, NOT in the feature PR.

> **A feature PR commits only a `.changeset/*.md` declaration — NOT a CHANGELOG edit. This is correct, not a bug.** The changelog is a separate generated artifact produced later by `pnpm version-packages`. Seeing `.changeset/` in the diff (and no CHANGELOG change) is the expected, intended state for a PR.

> **Use `pnpm version-packages`, NOT `pnpm version`.** `version` is a built-in pnpm command (it shadows the package.json script and demands a semver arg → `ERR_PNPM_INVALID_VERSION_BUMP`). The release script is named `version-packages` to avoid that clash.

1. **Per change (feature branch / PR):** run `pnpm changeset` — pick the affected package(s) and bump type (patch/minor/major), write a one-line summary. This drops a markdown file in `.changeset/`; commit **that file** with your PR. Do **not** version here.
2. **To release (on `main`, after merge):** `pnpm version-packages` (= `changeset version`) consumes the changeset files — applies the version bumps, **writes/updates each package's CHANGELOG**, and deletes the consumed `.changeset/*.md`. Commit this release commit to `main`.
3. **To publish:** `pnpm release` builds `create-rnstack` and runs `changeset publish` (publishes non-private packages to npm + creates per-package git tags like `create-rnstack@0.1.0`).

- `private: true` packages (`mobile`, root `rnstack`, `@repo/ui`, `@repo/api-client`, `@repo/config`) are **versioned but never published** — only `create-rnstack` publishes today. (The `@repo/*` packages would need a real npm scope before publishing; `@repo` is a workspace-internal placeholder.)
- **Template-ref tag is separate from changeset tags.** The CLI's `TEMPLATE_REF` pins to a **repo-wide tag** (e.g. `v0.1.0`) marking the whole template snapshot. When cutting a CLI release: bump `create-rnstack`, push a matching `v<x.y.z>` repo tag, and set `TEMPLATE_REF` to it so the published CLI scaffolds that exact frozen template (not `main`).
- **Every release tag must be documented** — don't push a bare tag:
  - **Annotate** it with a multi-line description: `git tag -a v<x.y.z> -F <file>` (or a heredoc), not `git tag v<x.y.z>`.
  - **Update CHANGELOGs** — `pnpm version` writes them from changesets; the root `CHANGELOG.md` + per-published-package `CHANGELOG.md` should always reflect what shipped.
  - **Create a GitHub Release** from the tag so the Releases page is populated (a tag alone doesn't create a release). Use `gh release create v<x.y.z> --title ... --notes-file <path>` — pass a file, NOT `--notes -` with a heredoc (stdin silently lands a literal `-` as the body).

## Scaffolding CLI — `create-rnstack` (`packages/create-rnstack`)

A Node CLI (TypeScript → bundled with tsup; published to npm as `create-rnstack`) that scaffolds a new project: `pnpm create rnstack <name>` / `npx create-rnstack <name>`.

- **Template source = THIS repo.** It fetches the repo via `tiged` (degit fork) at `TEMPLATE_REF` (pin to a release tag per published CLI version; `RNSTACK_TEMPLATE_REF` env overrides for local testing). There is no second template copy — what you build/test here is what users get.
- Flow (`src/index.ts`): prompt/flags → tiged clone → strip `STRIP_PATHS` → rebrand (`replaceInTree` swaps `rnstack` → project name; `@repo/*` scope untouched) → `configureRootMetadata` (reset root package.json — see below) → `writeGeneratedReadme` → `generateApps` (fan out `apps/mobile` into N apps: package name, Expo name/slug/scheme, **native bundle IDs** `<prefix>.<app>`) → `stripDemos` unless `--demo` → install → git init → next steps.
- **Modules:** `apps.ts` (fan-out + bundle IDs), `metadata.ts` (root package.json reset), `demo.ts` (+ `templates/no-demo/*` overrides for Home/Settings/api-client index), `readme.ts` (attribution).
- Flags: `--apps a,b`, `--pm <pnpm|npm|yarn|bun>`, `--bundle-id-prefix com.acme` (default `com.<project>`), `--demo` (include gallery/data-demo; **off by default**), `--no-install`, `--no-git`, `-y`.
- **`STRIP_PATHS`** removes `.claude`, `.turbo`, `.husky/_` (NOT `.husky/pre-commit` — that ships), `packages/create-rnstack`, and all CHANGELOGs.
- **Demos are opt-in.** Default scaffolds are production-first (no gallery/data-demo/example hook). `stripDemos` deletes those files AND overwrites Home/Settings/api-client-index with demo-free copies from `templates/no-demo/` (kept in the CLI, not markers in the template). If you change those 3 template files, update the overrides too.
- **Root metadata reset** (`metadata.ts`): the blind `rnstack→name` rename corrupts starter-owned fields, so after renaming, the root package.json is reset — `private:true`, empty description/keywords, no `repository`, and the scaffold-only scripts (`changeset`/`version-packages`/`release`) removed. Keep that `SCAFFOLD_ONLY_SCRIPTS` list in sync if you add root scripts that shouldn't ship.
- **Build-tool agnostic, enforced:** the scaffold MUST NOT carry an EAS/cloud account, keystore, or `projectId`/`owner` — those are per-developer (`eas init`).
- It's a **Node CLI**, not RN — its deps (`tiged`, `@clack/prompts`, `picocolors`, `tsup`) are plain Node packages; the "use `expo install`" rule does NOT apply to this package. `esbuild` (via tsup) is allow-listed in `pnpm-workspace.yaml` `allowBuilds`. `templates/` must be in the package `files` array so overrides ship.
- After changing the template structure, re-test the CLI end-to-end and update `STRIP_PATHS` / `generateApps` / `demo.ts` overrides if the assumptions changed.

## Roadmap — PLANNED, NOT YET BUILT

These do not exist in the repo yet. Do not assume their files/APIs are present; if asked to use them, build them first or confirm scope.

- **Auth/login starter screens** on top of `@repo/api-client`.
- **Pagination / infinite-query helpers** in `@repo/api-client`.
- **A web (Next.js) app target.**
- **More skills** — additional task-specific skills beyond this project guide.

When implementing roadmap items, keep them mobile-first, follow the conventions above, and add to/refresh this skill so it stays the accurate source of truth.
