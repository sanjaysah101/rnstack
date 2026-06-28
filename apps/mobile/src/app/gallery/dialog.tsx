import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Text } from "@repo/ui/components/ui/text";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function DialogDemo() {
  return (
    <DemoScreen title="Dialog">
      <DemoSection label="Modal with form">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Text>Open dialog</Text>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes and save when you're done. more text
              </DialogDescription>
            </DialogHeader>
            <View className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input defaultValue="Pedro Duarte" />
            </View>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  <Text>Cancel</Text>
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>
                  <Text>Save</Text>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DemoSection>
    </DemoScreen>
  );
}
