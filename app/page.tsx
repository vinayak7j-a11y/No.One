import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <PageLayout>
      <Section spacing="lg" className="flex flex-1 items-center">
        <div className="text-center">
          <Text as="p" size="caption" tone="subtle">
            Vinayak Joshi
          </Text>

          <Heading as="h1" size="display" className="mt-4">
            No.One
          </Heading>

          <Text size="lg" tone="muted" className="mt-6 max-w-xl mx-auto">
            The Digital Headquarters of Vinayak Joshi.
          </Text>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button href="/about">About</Button>
            <Button variant="outline" href="/projects">
              Projects
            </Button>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
