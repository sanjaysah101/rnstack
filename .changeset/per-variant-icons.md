---
"create-rnstack": minor
---

Add per-variant app icons. `app.config.ts` now tints the Android adaptive-icon background per build variant (dev = amber, preview = violet, production = the base colour from `app.json`), so the three side-by-side installs are distinguishable on the home screen without shipping extra icon art. The template keeps a single foreground image; drop per-variant `foregroundImage`s into `app.config.ts` if you want distinct art. Production is left fully untouched.
