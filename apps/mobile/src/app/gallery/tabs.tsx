import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { Text } from "@repo/ui/components/ui/text";
import { useState } from "react";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function TabsDemo() {
  const [value, setValue] = useState("account");

  return (
    <DemoScreen title="Tabs">
      <DemoSection label="Controlled">
        <Tabs value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="account">
              <Text>Account</Text>
            </TabsTrigger>
            <TabsTrigger value="password">
              <Text>Password</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Text className="text-foreground">Manage your account details here.</Text>
          </TabsContent>
          <TabsContent value="password">
            <Text className="text-foreground">Change your password here.</Text>
          </TabsContent>
        </Tabs>
      </DemoSection>
    </DemoScreen>
  );
}
