import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { Text } from "@repo/ui/components/ui/text";
import { DemoScreen, DemoSection } from "@/components/demo-screen";

export default function AccordionDemo() {
  return (
    <DemoScreen title="Accordion">
      <DemoSection label="Single, collapsible">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Text>Is it accessible?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>Yes. It follows the RN Reusables accessibility patterns.</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Text>Is it styled?</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>Yes, with NativeWind v5 + Tailwind v4 tokens.</Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DemoSection>
    </DemoScreen>
  );
}
