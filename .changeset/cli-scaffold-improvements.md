---
"create-rnstack": minor
---

Production-focused scaffolding improvements:

- **Per-app bundle identifiers** — each generated app gets a unique `ios.bundleIdentifier` and `android.package` (`<prefix>.<app>`, e.g. `com.demo.customer`); configurable via `--bundle-id-prefix` (default `com.<project>`).
- **Clean root metadata** — the rebrand no longer leaks the starter's repository URL, description, keywords, or release scripts into generated projects.
- **Demos are opt-in** — the component gallery, data-demo screen, and example API hook are excluded by default (production-first). Include them with `--demo`; the interactive prompt defaults to No.
- **README attribution** — generated projects get a project-specific README crediting `create-rnstack` (with version + link).
- **Husky pre-commit ships** — the `.husky/pre-commit` hook is no longer stripped, so commit-time lint/typecheck works out of the box.
- **Expo dependency validation** — apps include a `doctor` script (`expo install --check`), a shared Turbo `doctor` task, and a `postinstall` that validates SDK alignment as a non-blocking warning. Template Expo deps updated to the latest SDK 56 patch releases.
- The intro now prints the CLI version.
