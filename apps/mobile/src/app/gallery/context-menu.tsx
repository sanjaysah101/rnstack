import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@repo/ui/components/ui/context-menu";
import { Text } from "@repo/ui/components/ui/text";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function ContextMenuDemo() {
  return (
    <DemoScreen title="Context Menu">
      <DemoSection label="Long-press the area (native)">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <View className="h-32 items-center justify-center rounded-md border border-dashed border-border bg-card">
              <Text className="text-muted-foreground">Long-press here</Text>
            </View>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuLabel>
              <Text>Actions</Text>
            </ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Text>Back</Text>
            </ContextMenuItem>
            <ContextMenuItem>
              <Text>Reload</Text>
            </ContextMenuItem>
            <ContextMenuItem>
              <Text>Save as…</Text>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </DemoSection>
    </DemoScreen>
  );
}
