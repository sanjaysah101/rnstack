import { Button } from "@repo/ui/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import { Text } from "@repo/ui/components/ui/text";
import { useState } from "react";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function CollapsibleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <DemoScreen title="Collapsible">
      <DemoSection label="Toggle content">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              <Text>{open ? "Hide" : "Show"} details</Text>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <View className="mt-3 rounded-md border border-border bg-card p-4">
              <Text className="text-foreground">
                This content is revealed when the collapsible is open.
              </Text>
            </View>
          </CollapsibleContent>
        </Collapsible>
      </DemoSection>
    </DemoScreen>
  );
}
