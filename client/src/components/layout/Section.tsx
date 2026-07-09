// client/src/components/ui/Section.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  padding?: string;
};

export function Section({ children, padding, className }: Props) {
  return (
    <section className={cn("w-full", padding, className)}>{children}</section>
  );
}
