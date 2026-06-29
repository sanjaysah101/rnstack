import { Text } from "@repo/ui/components/ui/text";
import { ThemeToggle } from "@repo/ui/components/ui/theme-toggle";
import type * as React from "react";
import { ScrollView, View } from "react-native";

/**
 * Shared wrapper for every gallery demo screen. Renders a scrollable, themed
 * surface with the demo title and a ThemeToggle pinned top-right so dark/light
 * can be verified on each component without leaving the screen.
 */
export function DemoScreen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <ScrollView contentContainerClassName="gap-6 bg-background p-6 pb-24">
      <View className="flex flex-row items-start justify-between gap-4">
        <Text className="flex-1 text-2xl font-bold text-foreground">{title}</Text>
        <ThemeToggle />
      </View>
      {children}
    </ScrollView>
  );
}

/** A labeled group of related examples within a demo screen. */
export function DemoSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="flex flex-col gap-3">
      <Text className="text-sm font-medium text-muted-foreground">{label}</Text>
      <View className="flex flex-col gap-3">{children}</View>
    </View>
  );
}
