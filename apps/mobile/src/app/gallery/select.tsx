import {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Text } from "@repo/ui/components/ui/text";
import { useState } from "react";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function SelectDemo() {
  const [value, setValue] = useState<Option>(undefined);

  return (
    <DemoScreen title="Select">
      <DemoSection label="Choose a fruit">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent className="w-64">
            <SelectGroup>
              <SelectLabel>
                <Text>Fruits</Text>
              </SelectLabel>
              <SelectItem value="apple" label="Apple">
                Apple
              </SelectItem>
              <SelectItem value="banana" label="Banana">
                Banana
              </SelectItem>
              <SelectItem value="blueberry" label="Blueberry">
                Blueberry
              </SelectItem>
              <SelectItem value="grapes" label="Grapes">
                Grapes
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Text className="text-sm text-muted-foreground">Selected: {value?.label ?? "none"}</Text>
      </DemoSection>
    </DemoScreen>
  );
}
