import { Text } from "@repo/ui/components/ui/text";
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from "@repo/ui/components/ui/toggle-group";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react-native";
import { useState } from "react";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function ToggleGroupDemo() {
  const [align, setAlign] = useState<string | undefined>("left");

  return (
    <DemoScreen title="Toggle Group">
      <DemoSection label="Single select (outline)">
        <ToggleGroup type="single" value={align} onValueChange={setAlign} variant="outline">
          <ToggleGroupItem value="left" isFirst>
            <ToggleGroupIcon as={AlignLeft} />
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <ToggleGroupIcon as={AlignCenter} />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" isLast>
            <ToggleGroupIcon as={AlignRight} />
          </ToggleGroupItem>
        </ToggleGroup>
        <Text className="text-sm text-muted-foreground">Selected: {align ?? "none"}</Text>
      </DemoSection>
    </DemoScreen>
  );
}
