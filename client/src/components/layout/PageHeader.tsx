// client/src/components/ui/PageHeader.tsx
import type { ReactNode } from "react";
import { SlideUp } from "@/components/motion/SlideUp";

type Props = {
  title: string;
  subtitle?: string | ReactNode;
  actions?: ReactNode;
  indicator?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  actions,
  indicator,
  className = "",
  children,
}: Props) {
  return (
    <section
      className={`relative min-h-[95vh] mx-auto px-8 py-32 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-y-8 ${className}`}
    >
      <SlideUp
        delay={0}
        className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-center"
      >
        {title}
      </SlideUp>
      {subtitle && (
        <SlideUp
          delay={40}
          className="max-w-[40ch] sm:max-w-[50ch] font-base text-center"
        >
          {subtitle}
        </SlideUp>
      )}
      {actions && <div className="flex flex-col gap-2 mt-4">{actions}</div>}
      {indicator && (
        <div className="absolute bottom-4 flex items-center justify-center">
          {indicator}
        </div>
      )}

      {children}
    </section>
  );
}
