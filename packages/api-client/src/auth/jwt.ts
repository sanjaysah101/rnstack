import type { AuthProvider } from "@repo/api-client/auth/types";
import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "rnstack.access_token";
const REFRESH_KEY = "rnstack.refresh_token";

/** Tokens returned by the backend's login / refresh endpoints. */
export type JwtTokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtAuthConfig = {
  /**
   * Absolute URL of the refresh endpoint, e.g. `${baseUrl}/v1/auth/refresh`.
   * Receives `{ refreshToken }` and must return `{ accessToken, refreshToken }`.
   * Kept separate from the http() client so a refresh can't recurse through the
   * same 401-retry path.
   */
  refreshUrl: string;
  /** Map the refresh response body to tokens (override if your shape differs). */
  parseTokens?: (body: unknown) => JwtTokens;
};

const defaultParseTokens = (body: unknown): JwtTokens => {
  const b = body as { accessToken?: string; refreshToken?: string };
  if (!b?.accessToken || !b?.refreshToken) {
    throw new Error("Refresh response missing accessToken/refreshToken");
  }
  return { accessToken: b.accessToken, refreshToken: b.refreshToken };
};

/** Persist tokens after a successful login. Call this from your login flow. */
export async function setJwtTokens(tokens: JwtTokens): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
  ]);
}

/** Clear tokens (logout). */
export async function clearJwtTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
  ]);
}

/**
 * The default AuthProvider: bearer access token stored in the OS keychain via
 * expo-secure-store, refreshed against `refreshUrl`. On refresh failure it
 * clears the tokens so the app falls back to its unauthenticated state.
 */
export function createJwtAuthProvider(config: JwtAuthConfig): AuthProvider {
  const parseTokens = config.parseTokens ?? defaultParseTokens;

  return {
    getAccessToken: () => SecureStore.getItemAsync(ACCESS_KEY),

    refresh: async () => {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
      if (!refreshToken) {
        return null;
      }
      const res = await fetch(config.refreshUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        await clearJwtTokens();
        return null;
      }
      const tokens = parseTokens(await res.json());
      await setJwtTokens(tokens);
      return tokens.accessToken;
    },

    onAuthError: clearJwtTokens,
  };
}
