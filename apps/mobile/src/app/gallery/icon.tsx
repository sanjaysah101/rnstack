import { Icon } from "@repo/ui/components/ui/icon";
import { Heart, Rocket, Star, Sun } from "lucide-react-native";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function IconDemo() {
  return (
    <DemoScreen title="Icon">
      <DemoSection label="Default + sizes">
        <View className="flex flex-row items-center gap-4">
          <Icon as={Rocket} />
          <Icon as={Rocket} size={20} />
          <Icon as={Rocket} size={28} />
          <Icon as={Rocket} size={36} />
        </View>
      </DemoSection>
      <DemoSection label="Color via className tokens">
        <View className="flex flex-row items-center gap-4">
          <Icon as={Heart} size={28} className="text-destructive" />
          <Icon as={Star} size={28} className="text-primary" />
          <Icon as={Sun} size={28} className="text-muted-foreground" />
        </View>
      </DemoSection>
    </DemoScreen>
  );
}
