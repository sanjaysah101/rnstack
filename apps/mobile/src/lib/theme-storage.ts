import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeStorage } from "@repo/ui/lib/theme-context";

/**
 * Backs the theme preference with AsyncStorage so the user's light/dark/system
 * choice survives app restarts. Passed to @repo/ui's ThemeProvider, which is
 * otherwise storage-agnostic.
 */
export const themeStorage: ThemeStorage = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
};
