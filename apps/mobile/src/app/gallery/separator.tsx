import { Separator } from "@repo/ui/components/ui/separator";
import { Text } from "@repo/ui/components/ui/text";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function SeparatorDemo() {
  return (
    <DemoScreen title="Separator">
      <DemoSection label="Horizontal">
        <Text className="text-foreground">Above</Text>
        <Separator />
        <Text className="text-foreground">Below</Text>
      </DemoSection>
      <DemoSection label="Vertical">
        <View className="h-8 flex-row items-center gap-3">
          <Text className="text-foreground">Left</Text>
          <Separator orientation="vertical" />
          <Text className="text-foreground">Right</Text>
        </View>
      </DemoSection>
    </DemoScreen>
  );
}
