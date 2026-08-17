<!--
Draft comment for https://github.com/founded-labs/react-native-reusables/issues/534
Review, then paste into the issue. Not posted automatically.
-->

You don't need `onLayout` yourself — the `@rn-primitives/select` root context already measures the trigger and exposes its width. On native the web class `w-[--radix-select-trigger-width]` is a no-op, so read `triggerPosition.width` from `useRootContext()` inside `SelectContent` and apply it as the content width:

```tsx
import { Platform } from "react-native";
import * as SelectPrimitive from "@rn-primitives/select";

function SelectContent({ className, children, portalHost, ...props }) {
  // The primitive measures the trigger; use its width so the dropdown lines up
  // with the input. `w-[--radix-select-trigger-width]` only works on web.
  const { triggerPosition } = SelectPrimitive.useRootContext();
  const nativeWidth =
    Platform.OS !== "web" && triggerPosition?.width
      ? { width: triggerPosition.width }
      : undefined;

  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      {/* ...overlay... */}
      <SelectPrimitive.Content style={nativeWidth} className={className} {...props}>
        {children}
      </SelectPrimitive.Content>
      {/* ... */}
    </SelectPrimitive.Portal>
  );
}
```

Keep the web `w-[var(--radix-select-trigger-width)]` behind `Platform.select({ web: ... })`, and let native use the measured `width` instead. That gets the dropdown to match the trigger exactly on iOS/Android.

We hit this (and a handful of other native-only quirks) while migrating the whole RNR kit to **NativeWind v5** — full notes + a working, v5-fixed setup here if useful: [create-rnstack](https://github.com/sanjaysah101/rnstack).
