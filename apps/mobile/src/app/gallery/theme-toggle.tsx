import { Text } from "@repo/ui/components/ui/text";
import { ThemeToggle } from "@repo/ui/components/ui/theme-toggle";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function ThemeToggleDemo() {
  return (
    <DemoScreen title="Theme Toggle">
      <DemoSection label="Tap to switch light / dark">
        <View className="flex flex-row items-center gap-4">
          <ThemeToggle />
          <Text className="text-muted-foreground">Toggles the app color scheme at runtime.</Text>
        </View>
      </DemoSection>
      <DemoSection label="Token preview">
        <View className="gap-2">
          <View className="rounded-md bg-primary p-3">
            <Text className="text-primary-foreground">bg-primary</Text>
          </View>
          <View className="rounded-md bg-secondary p-3">
            <Text className="text-secondary-foreground">bg-secondary</Text>
          </View>
          <View className="rounded-md bg-muted p-3">
            <Text className="text-muted-foreground">bg-muted</Text>
          </View>
        </View>
      </DemoSection>
    </DemoScreen>
  );
}
