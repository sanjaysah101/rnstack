import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/ui/alert";
import { CircleAlert, Info } from "lucide-react-native";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function AlertDemo() {
  return (
    <DemoScreen title="Alert">
      <DemoSection label="Default">
        <Alert icon={Info}>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
        </Alert>
      </DemoSection>
      <DemoSection label="Destructive">
        <Alert icon={CircleAlert} variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
      </DemoSection>
    </DemoScreen>
  );
}
