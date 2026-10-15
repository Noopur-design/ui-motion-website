import { Contact } from "@/sections/Contact";
import { NextSteps } from "@/sections/NextSteps";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function ContactPage() {
  usePageMeta("Contact", "Tell us what you’re imagining. Let’s turn it into something worth watching.");

  return (
    <>
      <Contact index="01" headingAs="h1" />
      <NextSteps index="02" />
    </>
  );
}
