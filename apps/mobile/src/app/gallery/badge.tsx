import { Badge } from "@repo/ui/components/ui/badge";
import { Text } from "@repo/ui/components/ui/text";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function BadgeDemo() {
  return (
    <DemoScreen title="Badge">
      <DemoSection label="Variants">
        <View className="flex flex-row flex-wrap items-center gap-2">
          <Badge>
            <Text>Default</Text>
          </Badge>
          <Badge variant="secondary">
            <Text>Secondary</Text>
          </Badge>
          <Badge variant="destructive">
            <Text>Destructive</Text>
          </Badge>
          <Badge variant="outline">
            <Text>Outline</Text>
          </Badge>
        </View>
      </DemoSection>
    </DemoScreen>
  );
}
