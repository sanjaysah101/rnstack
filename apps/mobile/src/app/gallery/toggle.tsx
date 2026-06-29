import { Text } from "@repo/ui/components/ui/text";
import { Toggle, ToggleIcon } from "@repo/ui/components/ui/toggle";
import { Bold, Italic } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function ToggleDemo() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(true);

  return (
    <DemoScreen title="Toggle">
      <DemoSection label="Icon toggles">
        <View className="flex flex-row items-center gap-3">
          <Toggle pressed={bold} onPressedChange={setBold}>
            <ToggleIcon as={Bold} />
          </Toggle>
          <Toggle pressed={italic} onPressedChange={setItalic} variant="outline">
            <ToggleIcon as={Italic} />
          </Toggle>
        </View>
      </DemoSection>
      <DemoSection label="With text">
        <Toggle pressed={bold} onPressedChange={setBold} variant="outline">
          <ToggleIcon as={Bold} />
          <Text>Bold</Text>
        </Toggle>
      </DemoSection>
    </DemoScreen>
  );
}
