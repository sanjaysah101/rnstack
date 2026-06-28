import { Text } from "@repo/ui/components/ui/text";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function TextDemo() {
  return (
    <DemoScreen title="Text">
      <DemoSection label="Sizes">
        <Text className="text-xs text-foreground">text-xs — Extra small</Text>
        <Text className="text-sm text-foreground">text-sm — Small</Text>
        <Text className="text-base text-foreground">text-base — Base</Text>
        <Text className="text-lg text-foreground">text-lg — Large</Text>
        <Text className="text-2xl text-foreground">text-2xl — Heading</Text>
      </DemoSection>
      <DemoSection label="Weights & color tokens">
        <Text className="font-bold text-foreground">font-bold foreground</Text>
        <Text className="font-medium text-muted-foreground">font-medium muted-foreground</Text>
        <Text className="text-primary">text-primary</Text>
        <Text className="text-destructive">text-destructive</Text>
      </DemoSection>
    </DemoScreen>
  );
}
