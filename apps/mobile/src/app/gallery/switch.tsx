import { Label } from "@repo/ui/components/ui/label";
import { Switch } from "@repo/ui/components/ui/switch";
import { useState } from "react";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function SwitchDemo() {
  const [on, setOn] = useState(false);

  return (
    <DemoScreen title="Switch">
      <DemoSection label="Controlled">
        <View className="flex flex-row items-center gap-3">
          <Switch checked={on} onCheckedChange={setOn} />
          <Label onPress={() => setOn((v) => !v)}>Airplane mode</Label>
        </View>
      </DemoSection>
      <DemoSection label="States">
        <View className="flex flex-row items-center gap-3">
          <Switch checked onCheckedChange={() => {}} />
          <Switch checked={false} onCheckedChange={() => {}} />
          <Switch checked disabled onCheckedChange={() => {}} />
        </View>
      </DemoSection>
    </DemoScreen>
  );
}
