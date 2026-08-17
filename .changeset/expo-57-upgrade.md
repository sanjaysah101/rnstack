---
"create-rnstack": minor
---

Upgrade the template to **Expo SDK 57** (React Native 0.86.2, New Architecture):

- Bump expo + all `expo-*` packages and the RN family (react-native 0.86.2, reanimated 4.5.1, worklets 0.10.1, gesture-handler ~2.32, screens ~4.26, `@expo/ui` 57) to the SDK-57 matrix; workspace overrides re-pinned in lockstep.
- Update `@rn-primitives/*` to 1.5.x and refresh other dependency floors (tailwindcss 4.3.3, lucide-react-native 1.31, biome 2.5.8, turbo 2.10.10, etc.).
- Tighten `@repo/ui` / `@repo/api-client` peer-dependency ranges off `"*"` to sensible floors (silences a false-positive security warning; the app still provides the single pinned runtime).
- Force `tar` to a patched `>=7.5.19` via a workspace override (the `tiged` → `tar@6` chain had unpatched node-tar advisories; dev-only, template extraction, never in the app bundle).
- `expo-doctor` is clean (21/21) and the Android bundle compiles on SDK 57.
