# create-rnstack

Scaffold a new [rnstack](https://github.com/sanjaysah101/rnstack) monorepo — Expo + Turborepo +
pnpm, NativeWind v5, React Native Reusables, and a typed API layer — in one command.

```sh
pnpm create rnstack my-app
# or
npx create-rnstack my-app
```

## What it does

1. Fetches the rnstack template (this repo) via [tiged](https://github.com/tiged/tiged).
2. Strips template-internal paths (`.claude`, `.turbo`, the CLI itself) and resets the root
   `package.json` to clean, project-neutral metadata.
3. Rebrands the project to your chosen name and writes a project README (with attribution).
4. Generates the app(s) under `apps/`, each with its own name/slug/scheme and native bundle IDs
   (`<prefix>.<app>`).
5. Excludes demo content by default (opt in with `--demo`).
6. Installs dependencies (inheriting the template's tested versions).
7. Initializes a fresh git repo with an initial commit.

## Usage

```sh
create-rnstack [project-name] [options]
```

| Option | Description |
| --- | --- |
| `--apps <a,b,...>` | Comma-separated app names to create under `apps/` (default: `mobile`). |
| `--pm <pnpm\|npm\|yarn\|bun>` | Package manager (default: `pnpm`). |
| `--bundle-id-prefix <id>` | Reverse-DNS prefix for native bundle IDs (default: `com.<project>`). Each app becomes `<prefix>.<app>`. |
| `--demo` | Include demo content (component gallery + data-fetching demo). Excluded by default. |
| `--no-install` | Skip dependency installation. |
| `--no-git` | Skip git init + initial commit. |
| `-y` | Accept all defaults (non-interactive). |

Examples:

```sh
create-rnstack my-app                          # interactive
create-rnstack my-app -y                        # defaults: one "mobile" app, pnpm, no demos
create-rnstack my-app --apps customer,pos --bundle-id-prefix com.acme
create-rnstack my-app --demo                    # include the component gallery + data demo
```

## Notes

- Scaffolded projects include an `AGENTS.md` at the root — vendor-neutral context for AI coding
  agents (Claude Code, Cursor, Copilot, Zed, Aider, …) so they understand the project's
  conventions and native gotchas from the start.
- The template is pinned to a release ref for reproducibility. Set
  `RNSTACK_TEMPLATE_REF=<branch|tag>` to override (used for local development).
- Requires Node ≥ 20 and network access to fetch the template.
