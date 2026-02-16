// client/src/components/landing/FeaturesSection.tsx
import { SlideUp } from "@/components/motion/SlideUp";

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
    <section
      id="features-section"
      className="bg-accent text-foreground w-full py-32 px-8"
    >
      <div className="container mx-auto flex flex-col gap-y-16">
        <SlideUp delay={0} className="text-center">
          <h2 className="text-4xl font-bold tracking-tight">What, Why & How</h2>
          <p className="mt-2 text-lg">
            A quick overview of the purpose and design behind the project.
          </p>
        </SlideUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
      </div>
    </section>
  );
}
