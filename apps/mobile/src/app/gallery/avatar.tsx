import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { Text } from "@repo/ui/components/ui/text";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function AvatarDemo() {
  return (
    <DemoScreen title="Avatar">
      <DemoSection label="Image + fallback">
        <View className="flex flex-row items-center gap-4">
          <Avatar alt="User avatar">
            <AvatarImage source={{ uri: "https://github.com/shadcn.png" }} />
            <AvatarFallback>
              <Text>CN</Text>
            </AvatarFallback>
          </Avatar>
          <Avatar alt="Fallback only" className="size-12">
            <AvatarFallback>
              <Text>RN</Text>
            </AvatarFallback>
          </Avatar>
        </View>
      </DemoSection>
    </DemoScreen>
  );
}
