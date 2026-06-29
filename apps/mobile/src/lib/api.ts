import { createHttpClient, createJwtAuthProvider } from "@repo/api-client";
import { env } from "@/lib/env";

/**
 * The app's configured API client. The base URL comes from the validated `env`
 * module (guaranteed present and a valid URL), and it uses the JWT + secure-store
 * auth provider by default.
 *
 * To use Clerk / Supabase / Firebase instead, swap `createJwtAuthProvider` for a
 * small adapter that implements AuthProvider against that SDK — the http client,
 * single-flight 401 refresh, and error handling stay the same.
 */
const baseUrl = env.EXPO_PUBLIC_API_BASE_URL;

export const api = createHttpClient({
  baseUrl,
  auth: createJwtAuthProvider({
    refreshUrl: `${baseUrl}/v1/auth/refresh`,
  }),
});
