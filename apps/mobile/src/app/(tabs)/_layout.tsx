import { Icon } from "@repo/ui/components/ui/icon";
import { Tabs } from "expo-router";
import { House, Settings } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Icon as={House} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Icon as={Settings} size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
