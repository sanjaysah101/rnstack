import { Button } from "@repo/ui/components/ui/button";
import { Text } from "@repo/ui/components/ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/ui/tooltip";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function TooltipDemo() {
  return (
    <DemoScreen title="Tooltip">
      <DemoSection label="Press the trigger">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <Text>Hover / press me</Text>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <Text className="text-xs text-primary-foreground">Add to library</Text>
          </TooltipContent>
        </Tooltip>
      </DemoSection>
    </DemoScreen>
  );
}
