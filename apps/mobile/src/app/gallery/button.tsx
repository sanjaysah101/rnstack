import { Button } from "@repo/ui/components/ui/button";
import { Icon } from "@repo/ui/components/ui/icon";
import { Text } from "@repo/ui/components/ui/text";
import { Rocket } from "lucide-react-native";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function ButtonDemo() {
  return (
    <DemoScreen title="Button">
      <DemoSection label="Variants">
        <View className="flex flex-col gap-3">
          <Button>
            <Text>Default</Text>
          </Button>
          <Button variant="secondary">
            <Text>Secondary</Text>
          </Button>
          <Button variant="destructive">
            <Text>Destructive</Text>
          </Button>
          <Button variant="outline">
            <Text>Outline</Text>
          </Button>
          <Button variant="ghost">
            <Text>Ghost</Text>
          </Button>
          <Button variant="link">
            <Text>Link</Text>
          </Button>
        </View>
      </DemoSection>
      <DemoSection label="Sizes">
        <View className="flex flex-col gap-3">
          <Button size="sm">
            <Text>Small</Text>
          </Button>
          <Button size="default">
            <Text>Default</Text>
          </Button>
          <Button size="lg">
            <Text>Large</Text>
          </Button>
        </View>
      </DemoSection>
      <DemoSection label="With icon & disabled">
        <View className="flex flex-col gap-3">
          <Button>
            <Icon as={Rocket} className="text-primary-foreground" />
            <Text>Launch</Text>
          </Button>
          <Button disabled>
            <Text>Disabled</Text>
          </Button>
        </View>
      </DemoSection>
    </DemoScreen>
  );
}
