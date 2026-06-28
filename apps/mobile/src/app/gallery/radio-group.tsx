import { Label } from "@repo/ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

const OPTIONS = ["comfortable", "compact", "spacious"] as const;

export default function RadioGroupDemo() {
  const [value, setValue] = useState<string>("comfortable");

  return (
    <DemoScreen title="Radio Group">
      <DemoSection label="Controlled">
        <RadioGroup value={value} onValueChange={setValue}>
          {OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => setValue(option)}
              className="flex flex-row items-center gap-3"
            >
              <RadioGroupItem value={option} />
              <Label className="capitalize">{option}</Label>
            </Pressable>
          ))}
        </RadioGroup>
        <View className="h-1" />
      </DemoSection>
    </DemoScreen>
  );
}
