import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { View } from "react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function SkeletonDemo() {
  return (
    <DemoScreen title="Skeleton">
      <DemoSection label="Card placeholder">
        <View className="flex flex-row items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </View>
        </View>
      </DemoSection>
      <DemoSection label="Block">
        <Skeleton className="h-24 w-full rounded-xl" />
      </DemoSection>
    </DemoScreen>
  );
}
