---
"create-rnstack": patch
---

Scaffolded projects now start as a fresh git repo with an initial commit (skippable with `--no-git`), and rnstack's own CHANGELOG files are no longer copied into new projects. Also fixed the git commit failing on Windows due to shell argument splitting.
