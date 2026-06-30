---
"create-rnstack": patch
---

Scaffolded projects now start as a fresh git repo with an initial commit (skippable with `--no-git`), ship a root `AGENTS.md` with vendor-neutral AI-agent context, and no longer copy rnstack's own CHANGELOG files. Also fixed the git commit failing on Windows due to shell argument splitting.
