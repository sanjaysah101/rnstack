import { useExamplePosts } from "@repo/api-client/hooks/use-example-posts";
import { Card } from "@repo/ui/components/ui/card";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { Text } from "@repo/ui/components/ui/text";
import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";

/**
 * EXAMPLE — demonstrates @repo/api-client end to end: ApiProvider (root) →
 * useExamplePosts (TanStack Query + http client) → loading / error / data.
 * Delete this screen and the example hook when you wire your real backend.
 */
export default function DataDemo() {
  const { data: posts, isPending, isError, error, refetch } = useExamplePosts();

  return (
    <>
      <Stack.Screen options={{ title: "Data fetching" }} />
      <ScrollView contentContainerClassName="gap-4 bg-background p-6 pb-24">
        <Text variant="muted">
          Live data via @repo/api-client (TanStack Query + http client) from a public demo API.
        </Text>

        {isPending && (
          <View className="gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-md" />
            ))}
          </View>
        )}

        {isError && (
          <Card className="gap-2 border-destructive p-4">
            <Text className="font-semibold text-destructive">Failed to load</Text>
            <Text variant="muted">{error instanceof Error ? error.message : "Unknown error"}</Text>
            <Text className="text-primary" onPress={() => refetch()}>
              Tap to retry
            </Text>
          </Card>
        )}

        {posts?.map((post) => (
          <Card key={post.id} className="gap-1 p-4">
            <Text className="font-semibold text-foreground">{post.title}</Text>
            <Text variant="muted" numberOfLines={2}>
              {post.body}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </>
  );
}
