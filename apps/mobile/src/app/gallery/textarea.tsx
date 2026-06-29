import { Textarea } from "@repo/ui/components/ui/textarea";
import { useState } from "react";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function TextareaDemo() {
  const [value, setValue] = useState("");

  return (
    <DemoScreen title="Textarea">
      <DemoSection label="Controlled">
        <Textarea placeholder="Write a message…" value={value} onChangeText={setValue} />
      </DemoSection>
      <DemoSection label="Disabled">
        <Textarea defaultValue="Read-only content" editable={false} />
      </DemoSection>
    </DemoScreen>
  );
}
