<!--
Draft for a NEW issue on https://github.com/founded-labs/react-native-reusables
Suggested title:
  NativeWind v5 (Tailwind v4) compatibility — the component changes that were needed
Review, then open the issue yourself. Not posted automatically.
-->

## Summary

I ran the full React Native Reusables kit on **NativeWind v5 (preview) + Tailwind v4** (Expo SDK 57, RN 0.86, New Architecture) and found four components that need changes to render correctly on **native** — they look fine on web, so the issues only show up on a device. Sharing the exact changes and expected behavior so:

1. others hitting the same problems can find the fixes, and
2. the RNR / NativeWind teams have a consolidated list of the v4→v5 native gaps.

I verified each of these against a fresh `add --all` from the current CLI, so they reflect what the shipped components still do today (not stale local edits). Everything runs in a public setup so it's reproducible end-to-end: <https://github.com/sanjaysah101/rnstack>. Narrative writeup: <https://dev.to/sanjaysah/building-react-native-shouldnt-feel-like-assembling-ikea-furniture-a-modern-monorepo-starter-kit-pef>.

## Environment

- `nativewind@5.0.0-preview.4`, `react-native-css@^3.0.7`, `tailwindcss@^4` (CSS-first)
- Expo SDK 57, `react-native@0.86`, New Architecture, `react-native-reanimated@4`

## Component changes needed

### 1. `icon.tsx` — `cssInterop` → `styled`

**Current:** the shipped component imports `cssInterop` from `nativewind`. In v5 the styling runtime moved to `react-native-css`, and `cssInterop` no longer maps `className` onto the icon.

**Expected:** the icon's `className` (color, size) applies on native. Fix is `styled()` from `react-native-css` with the size remap:

```tsx
import { styled } from "react-native-css";

const IconImpl = styled(IconBase, {
  className: {
    target: "style",
    // preview typings don't model this yet → needs @ts-expect-error today
    nativeStyleToProp: { height: "size", width: "size" },
  },
});
```

### 2. `input.tsx` — Android `TextInput` clips text / shrinks when empty

**Current:** a single fixed-height `TextInput`. On Android this clips descenders (g/j/p/y) and the field shrinks when empty.

**Expected:** text is fully visible and the field keeps a stable height. Wrapping the input in a fixed-height `View` and disabling Android font padding fixes both:

```tsx
<View className="h-10 flex-row items-center ...">
  <TextInput
    className="flex-1 p-0 text-base leading-5 ..."
    style={{ includeFontPadding: false, textAlignVertical: "center" }}
  />
</View>
```

### 3. `textarea.tsx` — placeholder color doesn't theme on native

**Current:** placeholder color is set via `placeholderClassName`. On native (react-native-css) that doesn't reliably apply, so the placeholder is invisible/unthemed in dark mode.

**Expected:** placeholder uses the themed muted color. Using the `placeholder:` utility in `className` (like `input.tsx` does) works on native:

```tsx
// className: "... placeholder:text-muted-foreground ..."  (drop placeholderClassName)
```

### 4. `select.tsx` — SelectContent width on native (see #534)

**Current:** `w-[--radix-select-trigger-width]` is web-only, so on native the dropdown is narrower than the trigger.

**Expected:** the dropdown matches the trigger width. The primitive already measures the trigger — read `useRootContext().triggerPosition.width` and apply it as the content width on native. (Full snippet on #534.)

## Not RNR bugs, but worth documenting (theme/config, in the app's files)

These live in the app's `global.css` / `metro.config.js`, not in RNR components — but every RNR + v5 user will hit them, so they belong in the migration story:

- **Color tokens as full colors, not HSL channels.** Channels consumed via `hsl(var(--x))` + an opacity modifier (`bg-primary/90`) **flicker** on theme change on native. Store `--primary: hsl(0 0% 9%)` and reference `var(--primary)` directly in `@theme inline`. (Also flatten dark `--border`/`--input` off alpha like `oklch(1 0 0 / 10%)` to opaque — alpha triggers the same repaint flicker.)
- **Radius as concrete rems, not `calc(var())`.** `--radius-md: calc(var(--radius) - 2px)` collapses to 0 on native (square corners); use `--radius-md: 0.5rem`.
- **`metro.config.js` needs `inlineRem: 16`**, and `global.css` uses the v5 `@import` directives instead of `@tailwind`.

## Note on drift

RNR has moved forward since I based my copies on it — e.g. the overlays now use `ReduceMotion.System` and `asChild`/`as="Pressable"`. So this is specifically about the four native-only gaps above, which the current components still have; it's not a claim that my versions are otherwise ahead.

## Offer

Happy to open focused PRs for any of the four (`icon`, `input`, `textarea`, `select`) if useful — just say which. Once RNR ships first-class NativeWind v5 components, most of this becomes moot.
