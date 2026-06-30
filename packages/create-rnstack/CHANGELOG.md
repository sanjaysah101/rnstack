# create-rnstack

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
