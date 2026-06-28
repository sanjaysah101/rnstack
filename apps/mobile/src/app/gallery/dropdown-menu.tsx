import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Text } from "@repo/ui/components/ui/text";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function DropdownMenuDemo() {
  return (
    <DemoScreen title="Dropdown Menu">
      <DemoSection label="Menu with groups">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Text>Open menu</Text>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              <Text>My Account</Text>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Text>Profile</Text>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Text>Settings</Text>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Text>Log out</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DemoSection>
    </DemoScreen>
  );
}
