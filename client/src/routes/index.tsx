// client/src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/motion/PageTransition";
import { ScrollDownIndicator } from "@/components/motion/ScrollDownIndicator";
import { LinkButton } from "@/components/ui/LinkButton";

function LandingPage() {
  return (
    <PageTransition>
      <PageHeader
        title="Notes App"
        subtitle="The note app you never knew you needed! Say hello to your new note-taking companion — and goodbye to lost ideas."
        actions={
          <LinkButton to="/login" variant="primary" size="lg">
            Get Started!
          </LinkButton>
        }
        indicator={<ScrollDownIndicator />}
      />
      <FeaturesSection />
    </PageTransition>
  );
}

export const Route = createFileRoute("/")({
  component: LandingPage,
});
