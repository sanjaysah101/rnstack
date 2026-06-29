import { Icon } from "@repo/ui/components/ui/icon";
import { Text } from "@repo/ui/components/ui/text";
import { type ThemePreference, useThemePreference } from "@repo/ui/lib/theme-context";
import Constants from "expo-constants";
import { type Href, useRouter } from "expo-router";
import { Check, ChevronRight, Database, LayoutGrid } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </Text>
  );
}

/** A grouped "card" of rows, hairline-separated, matching native settings UIs. */
function Group({ children }: { children: React.ReactNode }) {
  return (
    <View className="overflow-hidden rounded-lg border border-border bg-card">{children}</View>
  );
}

function Row({
  label,
  trailing,
  onPress,
  first,
}: {
  label: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  first?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between px-4 py-3.5 active:bg-accent ${first ? "" : "border-t border-border"}`}
    >
      <Text className="text-foreground">{label}</Text>
      {trailing}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { preference, setPreference } = useThemePreference();
  const version = Constants.expoConfig?.version ?? "—";

  return (
    <ScrollView contentContainerClassName="gap-6 bg-background p-6">
      <View className="gap-2">
        <SectionLabel>Appearance</SectionLabel>
        <Group>
          {THEME_OPTIONS.map((opt, i) => (
            <Row
              key={opt.value}
              label={opt.label}
              first={i === 0}
              onPress={() => setPreference(opt.value)}
              trailing={
                preference === opt.value ? (
                  <Icon as={Check} className="text-primary" size={20} />
                ) : null
              }
            />
          ))}
        </Group>
        <Text className="px-1 text-xs text-muted-foreground">
          “System” follows your device’s light/dark setting.
        </Text>
      </View>

      <View className="gap-2">
        <SectionLabel>Developer</SectionLabel>
        <Group>
          <Row
            label="Component gallery"
            first
            onPress={() => router.push("/gallery" as Href)}
            trailing={
              <View className="flex-row items-center gap-1">
                <Icon as={LayoutGrid} className="text-muted-foreground" size={18} />
                <Icon as={ChevronRight} className="text-muted-foreground" size={18} />
              </View>
            }
          />
          <Row
            label="Data fetching demo"
            onPress={() => router.push("/data-demo" as Href)}
            trailing={
              <View className="flex-row items-center gap-1">
                <Icon as={Database} className="text-muted-foreground" size={18} />
                <Icon as={ChevronRight} className="text-muted-foreground" size={18} />
              </View>
            }
          />
        </Group>
      </View>

      <View className="gap-2">
        <SectionLabel>About</SectionLabel>
        <Group>
          <Row label="Version" first trailing={<Text variant="muted">{version}</Text>} />
        </Group>
      </View>
    </ScrollView>
  );
}
