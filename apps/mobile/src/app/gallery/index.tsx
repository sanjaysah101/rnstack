import { Card } from "@repo/ui/components/ui/card";
import { Text } from "@repo/ui/components/ui/text";
import { ThemeToggle } from "@repo/ui/components/ui/theme-toggle";
import { type Href, Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { GALLERY } from "@/lib/gallery";

export default function GalleryIndex() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Component Gallery" }} />
      <ScrollView contentContainerClassName="gap-6 bg-background p-6 pb-24">
        <View className="flex flex-row items-start justify-between gap-4">
          <View className="flex-1 gap-1">
            <Text className="text-2xl font-bold text-foreground">Component Gallery</Text>
            <Text className="text-sm text-muted-foreground">
              NativeWind v5 + Tailwind v4 — test each component in Expo Go.
            </Text>
          </View>
          <ThemeToggle />
        </View>

        {GALLERY.map((group) => (
          <View key={group.tier} className="flex flex-col gap-3">
            <View className="gap-0.5">
              <Text className="text-base font-semibold text-foreground">{group.tier}</Text>
              <Text className="text-xs text-muted-foreground">{group.description}</Text>
            </View>
            <View className="flex flex-col gap-2">
              {group.entries.map((entry) => (
                <Pressable
                  key={entry.slug}
                  // slug is dynamic data; cast to Href since typed routes can't
                  // narrow a runtime-built path to the specific route union.
                  onPress={() => router.push(`/gallery/${entry.slug}` as Href)}
                >
                  <Card className="flex flex-row items-center justify-between px-4 py-3">
                    <Text className="text-foreground">{entry.title}</Text>
                    <Text className="text-muted-foreground">›</Text>
                  </Card>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
