import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Text } from "@repo/ui/components/ui/text";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function CardDemo() {
  return (
    <DemoScreen title="Card">
      <DemoSection label="Full card">
        <Card>
          <CardHeader>
            <CardTitle>Project rnstack</CardTitle>
            <CardDescription>A mobile-first RN monorepo starter.</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>NativeWind v5 + Tailwind v4, pre-fixed RNR components.</Text>
          </CardContent>
          <CardFooter className="gap-3">
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
            <Button>
              <Text>Deploy</Text>
            </Button>
          </CardFooter>
        </Card>
      </DemoSection>
    </DemoScreen>
  );
}
