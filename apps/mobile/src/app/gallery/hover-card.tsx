import { Button } from "@repo/ui/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@repo/ui/components/ui/hover-card";
import { Text } from "@repo/ui/components/ui/text";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function HoverCardDemo() {
  return (
    <DemoScreen title="Hover Card">
      <DemoSection label="Press to preview (native)">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">
              <Text>@rnstack</Text>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <View className="gap-1">
              <Text className="font-semibold text-popover-foreground">rnstack</Text>
              <Text className="text-sm text-muted-foreground">
                Mobile-first RN monorepo starter — joined June 2026.
              </Text>
            </View>
          </HoverCardContent>
        </HoverCard>
      </DemoSection>
    </DemoScreen>
  );
}
