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
2. Strips template-internal paths (`.claude`, `.turbo`, `.husky`, the CLI itself).
3. Rebrands the project to your chosen name.
4. Generates the app(s) you ask for under `apps/` (each with its own name/slug/scheme).
5. Installs dependencies (inheriting the template's tested versions).
6. Initializes a fresh git repo with an initial commit.

## Usage

```sh
create-rnstack [project-name] [options]
```

| Option | Description |
| --- | --- |
| `--apps <a,b,...>` | Comma-separated app names to create under `apps/` (default: `mobile`). |
| `--pm <pnpm\|npm\|yarn\|bun>` | Package manager (default: `pnpm`). |
| `--no-install` | Skip dependency installation. |
| `--no-git` | Skip git init + initial commit. |
| `-y` | Accept all defaults (non-interactive). |

Examples:

```sh
create-rnstack my-app                          # interactive
create-rnstack my-app -y                        # defaults: one "mobile" app, pnpm, install
create-rnstack my-app --apps mobile,web --pm bun --no-install
```

## Notes

- The template is pinned to a release ref for reproducibility. Set
  `RNSTACK_TEMPLATE_REF=<branch|tag>` to override (used for local development).
- Requires Node ≥ 20 and network access to fetch the template.
