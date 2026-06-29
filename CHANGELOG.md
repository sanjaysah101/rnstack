# Changelog

All notable changes to rnstack are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[Semantic Versioning](https://semver.org/). Per-package changelogs live alongside each
package; this file tracks the project as a whole.

## [0.1.0] - 2026-06-29

Initial public baseline.

### Added

- **Monorepo foundation** — Expo SDK 56 (New Architecture, RN 0.85) + Turborepo + pnpm
  (`nodeLinker: hoisted` to guarantee a single native runtime).
- **`@repo/ui`** — React Native Reusables component kit on NativeWind v5 (Tailwind v4),
  pre-fixed to render correctly on native; persisted light/dark/system theme provider.
- **`@repo/api-client`** — typed HTTP client with single-flight 401 refresh + retry, a
  pluggable `AuthProvider` (JWT + expo-secure-store default), and TanStack Query wiring.
- **Mobile app** — bottom-tab navigation with Home + Settings, Zod-validated env, and a
  removable data-fetching demo.
- **`create-rnstack`** — CLI to scaffold a new monorepo in one command (`pnpm create rnstack`),
  with multi-app support.
- **Tooling** — Biome (lint/format), Changesets (independent per-package versioning).

[0.1.0]: https://github.com/sanjaysah101/rnstack/releases/tag/v0.1.0
