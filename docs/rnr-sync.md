# Keeping `@repo/ui` in sync with React Native Reusables

We fork a small number of RNR components to make them work on **NativeWind v5** (see the four
fixes below). RNR keeps shipping improvements upstream, so our copies drift behind unless we
re-sync. Do this **each RNR release** (or before cutting a new template tag).

## The ritual

1. **Snapshot our current components** so you can diff afterwards:
   ```sh
   cp -r packages/ui/src/components/ui /tmp/ui-ours
   ```
2. **Re-import the latest RNR components** (overwrites ours):
   ```sh
   cd packages/ui
   npx @react-native-reusables/cli@latest add --all --overwrite --yes
   ```
3. **Format** so cosmetic churn doesn't hide real changes:
   ```sh
   pnpm exec biome format --write packages/ui/src/components/ui
   ```
4. **Diff** to see what upstream changed vs. our fixes:
   ```sh
   for f in /tmp/ui-ours/*.tsx; do diff -q "$f" "packages/ui/src/components/ui/$(basename "$f")"; done
   ```
   Keep upstream's improvements; **re-apply our four native fixes** (below) on top.
5. **Verify**: `pnpm typecheck && pnpm lint`, then run the app on a device (web hides these bugs).

## Our native fixes to re-apply after every re-import

Each is a v5/native gap the shipped RNR components still have (verified against `add --all`). Full
rationale + expected behavior: [`rnr-v5-migration-issue.md`](./rnr-v5-migration-issue.md).

- [ ] **`icon.tsx`** — replace `cssInterop` (from `nativewind`) with `styled` from `react-native-css`
      (`target: "style"`, `nativeStyleToProp: { height: "size", width: "size" }`, `@ts-expect-error`).
- [ ] **`input.tsx`** — wrap the `TextInput` in a fixed-height `View`; inner input is
      `flex-1 p-0 leading-5` with `style={{ includeFontPadding: false, textAlignVertical: "center" }}`.
- [ ] **`textarea.tsx`** — set placeholder color via the `placeholder:text-muted-foreground` utility
      in `className`, not `placeholderClassName`.
- [ ] **`select.tsx`** — in `SelectContent`, read `useRootContext().triggerPosition.width` and apply
      it as the content `width` on native (keep `w-[var(--radix-select-trigger-width)]` web-only).

Also confirm the app-level theme still follows the v5 rules (full-color tokens, concrete radius rems,
`inlineRem: 16`) — those live in `apps/*/global.css` and `metro.config.js`, not in RNR components.

## When RNR ships official NativeWind v5 components

Drop the corresponding fork(s) and track upstream directly — delete the checklist item once a fix
is no longer needed.
