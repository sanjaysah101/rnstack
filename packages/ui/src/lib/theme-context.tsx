import * as React from "react";
import { Appearance } from "react-native";

/** User's theme preference. "system" follows the OS setting. */
export type ThemePreference = "light" | "dark" | "system";

/**
 * Minimal persistence seam so @repo/ui stays storage-agnostic. The app passes an
 * adapter (e.g. AsyncStorage); without one the choice isn't persisted across
 * launches. Methods may be sync or async.
 */
export type ThemeStorage = {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
};

const STORAGE_KEY = "rnstack.theme-preference";

function applyPreference(pref: ThemePreference) {
  // "unspecified" = follow the OS (RN 0.85's ColorSchemeName has no null);
  // NativeWind's `dark:` variant reacts to the resulting scheme.
  Appearance.setColorScheme(pref === "system" ? "unspecified" : pref);
}

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  storage,
}: {
  children: React.ReactNode;
  storage?: ThemeStorage;
}) {
  const [preference, setPreferenceState] = React.useState<ThemePreference>("system");

  // Load the persisted preference once on mount and apply it.
  React.useEffect(() => {
    let active = true;
    (async () => {
      const saved = await storage?.getItem(STORAGE_KEY);
      if (active && (saved === "light" || saved === "dark" || saved === "system")) {
        setPreferenceState(saved);
        applyPreference(saved);
      }
    })();
    return () => {
      active = false;
    };
  }, [storage]);

  const setPreference = React.useCallback(
    (pref: ThemePreference) => {
      setPreferenceState(pref);
      applyPreference(pref);
      void storage?.setItem(STORAGE_KEY, pref);
    },
    [storage]
  );

  const value = React.useMemo(() => ({ preference, setPreference }), [preference, setPreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Read/set the theme preference. Must be used within ThemeProvider. */
export function useThemePreference(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemePreference must be used within a ThemeProvider");
  }
  return ctx;
}
