import { Input } from "@repo/ui/components/ui/input";
import { useState } from "react";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function InputDemo() {
  const [value, setValue] = useState("");

  return (
    <DemoScreen title="Input">
      <DemoSection label="Basic + controlled">
        <Input placeholder="Type here…" value={value} onChangeText={setValue} />
        <Input placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
      </DemoSection>
      <DemoSection label="States">
        <Input defaultValue="Pre-filled value" />
        <Input placeholder="Disabled" editable={false} />
      </DemoSection>
    </DemoScreen>
  );
}
