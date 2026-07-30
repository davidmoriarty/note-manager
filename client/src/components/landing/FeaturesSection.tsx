// client/src/components/landing/FeaturesSection.tsx
import { SlideUp } from "@/components/motion/SlideUp";
import { Container } from "@/components/layout/Container";

export function FeaturesSection() {
  const items = [
    {
      title: "What",
      text: "A modern note-taking app built with Bun, Hono, and TanStack — fast, lightweight, and designed for clarity.",
    },
    {
      title: "Why",
      text: "I built this project to demonstrate clean architecture, full-stack TypeScript patterns, and elegant UI/UX.",
    },
    {
      title: "How",
      text: "The app uses Hono for the API, Hono RPC for end-to-end types, TanStack Router for navigation, and framer-motion animations.",
    },
  ];

  return (
    <section id="features-section" className="bg-muted text-foreground py-16">
      <Container padding="px-4 sm:px-6 md:px-8" className="max-w-7xl">
        <div className="flex flex-col gap-4 mb-16 text-center">
          <SlideUp delay={0}>
            <h2 className="text-3xl font-semibold tracking-tight">
              What, Why & How
            </h2>
          </SlideUp>

          <SlideUp delay={40}>
            <p className="text-foreground/80">
              A quick overview of the purpose and design behind the project.
            </p>
          </SlideUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {items.map((item, i) => (
            <SlideUp key={item.title} delay={80 * (i + 1)}>
              <div className="flex flex-col items-start gap-y-3">
                <h3 className="text-2xl font-semibold tracking-wide">
                  {item.title}
                </h3>
                <p className="leading-relaxed">{item.text}</p>
              </div>
            </SlideUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
