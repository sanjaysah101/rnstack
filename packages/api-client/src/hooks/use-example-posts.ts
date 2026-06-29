import { createHttpClient } from "@repo/api-client/http";
import { useQuery } from "@tanstack/react-query";

/**
 * EXAMPLE — delete when you wire your real backend.
 *
 * Demonstrates the full pattern (http client → typed response → query hook)
 * against a public demo API so a fresh clone shows live data with no backend.
 * dummyjson serves under the root, so apiPrefix is "" here; your real client
 * would use the default "/v1" and an AuthProvider.
 */
const demoClient = createHttpClient({
  baseUrl: "https://dummyjson.com",
  apiPrefix: "",
});

export type ExamplePost = {
  id: number;
  title: string;
  body: string;
};

type PostsResponse = {
  posts: ExamplePost[];
};

export function useExamplePosts() {
  return useQuery({
    queryKey: ["example", "posts"],
    // Forward TanStack Query's AbortSignal so the request auto-cancels on
    // unmount / refetch (demonstrates the client's cancellation support).
    queryFn: ({ signal }) =>
      demoClient.get<PostsResponse>("/posts", { params: { limit: 10 }, signal }),
    select: (data) => data.posts,
  });
}
