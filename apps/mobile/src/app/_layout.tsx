import { ApiProvider } from "@repo/api-client/query";
import { ThemeProvider } from "@repo/ui/lib/theme-context";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { ThemeProvider as NavThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { api } from "@/lib/api";
import { NAV_THEME } from "@/lib/theme";
import { themeStorage } from "@/lib/theme-storage";
import "../global.css";

// Touch `api` so the validated env + client initialize at startup (and a
// misconfigured .env fails fast). Safe to remove once a screen imports it.
void api;

export default function RootLayout() {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <ThemeProvider storage={themeStorage}>
      <ApiProvider>
        <NavThemeProvider value={NAV_THEME[colorScheme]}>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          {/* contentStyle background matches the theme so toggling doesn't flash a
              mismatched (white) navigator background between renders. */}
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: NAV_THEME[colorScheme].colors.background },
            }}
          />
          <PortalHost />
        </NavThemeProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}
