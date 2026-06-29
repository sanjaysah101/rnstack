import { Button } from "@repo/ui/components/ui/button";
import { Progress } from "@repo/ui/components/ui/progress";
import { Text } from "@repo/ui/components/ui/text";
import { useState } from "react";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function ProgressDemo() {
  const [value, setValue] = useState(40);

  return (
    <DemoScreen title="Progress">
      <DemoSection label="Static values">
        <View className="gap-4">
          <Progress value={25} />
          <Progress value={60} />
          <Progress value={90} />
        </View>
      </DemoSection>
      <DemoSection label="Interactive">
        <Progress value={value} />
        <View className="flex flex-row gap-3">
          <Button variant="outline" onPress={() => setValue((v) => Math.max(0, v - 10))}>
            <Text>-10</Text>
          </Button>
          <Button variant="outline" onPress={() => setValue((v) => Math.min(100, v + 10))}>
            <Text>+10</Text>
          </Button>
        </View>
      </DemoSection>
    </DemoScreen>
  );
}
