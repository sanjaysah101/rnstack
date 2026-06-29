import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";
import { useState } from "react";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <DemoScreen title="Checkbox">
      <DemoSection label="Controlled">
        <View className="flex flex-row items-center gap-3">
          <Checkbox checked={checked} onCheckedChange={setChecked} />
          <Label onPress={() => setChecked((c) => !c)}>Accept terms</Label>
        </View>
      </DemoSection>
      <DemoSection label="States">
        <View className="flex flex-row items-center gap-3">
          <Checkbox checked onCheckedChange={() => {}} />
          <Checkbox checked={false} onCheckedChange={() => {}} />
          <Checkbox checked disabled onCheckedChange={() => {}} />
        </View>
      </DemoSection>
    </DemoScreen>
  );
}
