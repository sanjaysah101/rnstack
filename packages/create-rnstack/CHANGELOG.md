# create-rnstack

## 0.1.0

### Minor Changes

- Initial release. Scaffold a new rnstack monorepo in one command
  (`pnpm create rnstack <name>` / `npx create-rnstack <name>`): fetches the template at a
  pinned release tag, strips template-internal files, rebrands the project, optionally fans
  out multiple apps under `apps/`, and installs dependencies. Supports `--apps`, `--pm`,
  `--no-install`, and `-y` for non-interactive use.
