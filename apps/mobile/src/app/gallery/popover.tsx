import { Button } from "@repo/ui/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Text } from "@repo/ui/components/ui/text";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function PopoverDemo() {
  return (
    <DemoScreen title="Popover">
      <DemoSection label="Anchored content">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Text>Open popover</Text>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <View className="gap-2">
              <Text className="font-medium text-popover-foreground">Dimensions</Text>
              <Text className="text-sm text-muted-foreground">
                Set the dimensions for the layer here.
              </Text>
            </View>
          </PopoverContent>
        </Popover>
      </DemoSection>
    </DemoScreen>
  );
}
