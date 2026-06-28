import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@repo/ui/components/ui/menubar";
import { Text } from "@repo/ui/components/ui/text";
import { useState } from "react";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function MenubarDemo() {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <DemoScreen title="Menubar">
      <DemoSection label="Menu bar">
        <Menubar value={value} onValueChange={setValue}>
          <MenubarMenu value="file">
            <MenubarTrigger>
              <Text>File</Text>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Text>New Tab</Text>
              </MenubarItem>
              <MenubarItem>
                <Text>New Window</Text>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Text>Share</Text>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger>
              <Text>Edit</Text>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Text>Undo</Text>
              </MenubarItem>
              <MenubarItem>
                <Text>Redo</Text>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </DemoSection>
    </DemoScreen>
  );
}
