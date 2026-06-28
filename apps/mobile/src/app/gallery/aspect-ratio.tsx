import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { Text } from "@repo/ui/components/ui/text";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function AspectRatioDemo() {
  return (
    <DemoScreen title="Aspect Ratio">
      <DemoSection label="16 / 9">
        <AspectRatio ratio={16 / 9}>
          <View className="size-full items-center justify-center rounded-xl bg-muted">
            <Text className="text-muted-foreground">16:9</Text>
          </View>
        </AspectRatio>
      </DemoSection>
      <DemoSection label="1 / 1">
        <View className="w-40">
          <AspectRatio ratio={1}>
            <View className="size-full items-center justify-center rounded-xl bg-primary">
              <Text className="text-primary-foreground">1:1</Text>
            </View>
          </AspectRatio>
        </View>
      </DemoSection>
    </DemoScreen>
  );
}
