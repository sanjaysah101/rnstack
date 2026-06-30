# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Copilot, Zed, Aider, …) working in this
repo — a mobile-first Expo + Turborepo monorepo. **Read this before changing theming, UI
components, the package layout, or dependencies.**

> Primary target is **native (iOS/Android)**. Web works but is secondary — never trade native
> correctness for web parity. Always verify UI changes on a device/emulator, not just web.

## Stack & layout

Expo SDK 56 (New Architecture, RN 0.85) · Expo Router · NativeWind v5 (Tailwind v4) · React
Native Reusables · TanStack Query · TypeScript · pnpm + Turborepo · Biome.

```
apps/
  <app>/              Expo app(s) (Expo Router) — screens in src/app
packages/
  ui/                 @repo/ui — RN Reusables components, theme provider, cn()
  api-client/         @repo/api-client — http() + 401 refresh + pluggable auth + TanStack Query
  config/             @repo/config — shared tsconfig base + Biome config
```

## Non-negotiable setup (do NOT revert — each fixes a verified breakage)

- **`nodeLinker: hoisted`** (pnpm-workspace.yaml) — guarantees a single physical `react-native`;
  pnpm's default isolated layout loads two copies → `Maximum call stack size exceeded` at startup.
- **Workspace `overrides`** pin every RN-family package to one version; **`lightningcss` pinned**
  (newer crashes the RN CSS compiler).
- **`apps/<app>/babel.config.js`** explicitly adds `react-native-worklets/plugin` (pnpm hides it
  from babel-preset-expo otherwise → reanimated recursion crash).
- **`@repo/*` RN-family deps are `peerDependencies`** — the app provides the single native runtime.
- **`metro.config.js` stays minimal** — Expo SDK 52+ auto-configures monorepos.

## Theming — `apps/<app>/src/global.css` is the canonical palette

NativeWind v5 + Tailwind v4 is CSS-first (no `tailwind.config.js`). Three native-only rules:

- **Store color tokens as FULL colors** (`--primary: hsl(0 0% 9%)`), referenced in `@theme inline`
  as `var(--primary)`. Bare HSL channels + an opacity modifier (`bg-primary/90`) **flicker** on
  theme change on native.
- **Radius tokens must be concrete rems** (`0.5rem`), never `calc(var(--radius) - 2px)` — nested
  `calc(var())` collapses to 0 on native (square corners).
- Keep the `@source "../../../packages/ui/src/**/*.{ts,tsx}"` line — workspace packages are
  symlinked and Tailwind won't scan them otherwise (classes get purged).

Theme colors live in **two** places that must stay in sync: `global.css` (NativeWind utilities) and
`apps/<app>/src/lib/theme.ts` (React Navigation `NAV_THEME` + raw `THEME` values). Dark mode follows
the system scheme via `Appearance`; the persisted light/dark/system preference lives in
`@repo/ui`'s `ThemeProvider` / `useThemePreference`.

## RN Reusables components — native gotchas

- **`grid` / grid-`gap` do nothing on native** — use `flex flex-col gap-N`.
- **Android `TextInput`** clips text / shrinks when empty — wrap in a fixed-height `View`, set
  `includeFontPadding: false` + `textAlignVertical: "center"` via `style` (see `ui/input.tsx`).
- **Web-only utilities** (`hover:`, `focus-visible:`, `ring-*`, `transition-*`) belong inside
  `Platform.select({ web: ... })`.
- Add components with the RNR CLI from `packages/ui`:
  `npx @react-native-reusables/cli@latest add <name> -y`, then audit for the above.

## Data layer — `@repo/api-client`

Auth-agnostic. `createHttpClient` owns transport (base URL + `/v1`, JSON, `HttpError`, single-flight
401 → refresh → retry, `signal` cancellation). Auth is injected via an `AuthProvider` (default: JWT +
expo-secure-store; swap a ~15-line adapter for Clerk/Supabase/Firebase). **Screens call query hooks,
never `fetch`.** `ApiProvider` wraps the app in the root layout.

## Conventions

- Import within `@repo/ui` per file (`@repo/ui/components/ui/button`), **not** a barrel — Metro's
  tree-shaking is weak; a barrel bloats the bundle.
- App imports use `@/*` (→ `apps/<app>/src/*`); the kit via `@repo/ui/...`.
- Files are kebab-case; components PascalCase; hooks `useXxx`.
- Style with Tailwind `className` + `cn()`; avoid inline `StyleSheet` unless a prop can't be a class.
- **Env**: all access goes through one Zod-validated module (`src/lib/env.ts`) that fails fast on a
  missing/invalid var. Public config uses the `EXPO_PUBLIC_*` prefix; never read `process.env`
  elsewhere.
- **Tooling**: Biome (not ESLint/Prettier). Run `pnpm lint` / `pnpm typecheck` before committing.

## Commands

```sh
pnpm install
cp .env.example apps/<app>/.env     # set EXPO_PUBLIC_API_BASE_URL
pnpm start                          # expo start (press a / i / w)
pnpm lint && pnpm typecheck         # quality gate
```

After babel/metro/linker changes, always start with a cleared cache (`expo start --clear`).
