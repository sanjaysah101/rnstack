import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { Icon } from "@repo/ui/components/ui/icon";
import { Text } from "@repo/ui/components/ui/text";
import { type Href, useRouter } from "expo-router";
import { Rocket, Settings } from "lucide-react-native";
import { ScrollView, View } from "react-native";

/**
 * Home — a clean starting point, not a component showcase. Replace this with
 * your app's first screen; the component gallery and data demo live under
 * Settings → Developer.
 */
export default function Home() {
  const router = useRouter();

  return (
    <ScrollView contentContainerClassName="gap-6 bg-background p-6">
      <View className="gap-2">
        <Text className="text-3xl font-bold text-foreground">Welcome to rnstack</Text>
        <Text variant="muted">
          A mobile-first Expo + Turborepo starter with NativeWind v5, RN Reusables, and a typed API
          layer. This is your Home screen — make it your own.
        </Text>
      </View>

      <Card className="gap-3 p-5">
        <View className="flex-row items-center gap-2">
          <Icon as={Rocket} className="text-foreground" size={18} />
          <Text className="text-lg font-semibold text-foreground">Get started</Text>
        </View>
        <Text variant="muted">
          Edit <Text className="font-mono text-sm text-foreground">app/(tabs)/index.tsx</Text> to
          change this screen, or open Settings to tweak the theme and explore the included
          components.
        </Text>
        <Button onPress={() => router.push("/settings" as Href)}>
          <Icon as={Settings} className="text-primary-foreground" size={18} />
          <Text>Open Settings</Text>
        </Button>
      </Card>
    </ScrollView>
  );
}
