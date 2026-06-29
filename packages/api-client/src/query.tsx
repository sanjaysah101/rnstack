import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

/**
 * Sensible mobile defaults: don't refetch on window focus (no real "focus" on
 * native), retry a couple of times, and keep data fresh for a short window.
 * Override per-query as needed.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Wrap the app once (in the root layout) so every screen can use query hooks.
 * Accepts an optional client for tests; creates a stable one otherwise.
 */
export function ApiProvider({
  children,
  client,
}: {
  children: React.ReactNode;
  client?: QueryClient;
}) {
  const [queryClient] = React.useState(() => client ?? createQueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
