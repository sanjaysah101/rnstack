import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function LabelDemo() {
  return (
    <DemoScreen title="Label">
      <DemoSection label="With input">
        <View className="gap-2">
          <Label>Email</Label>
          <Input placeholder="you@example.com" />
        </View>
      </DemoSection>
      <DemoSection label="Disabled">
        <Label disabled>Disabled label</Label>
      </DemoSection>
    </DemoScreen>
  );
}
