// client/src/components/ui/Section.tsx
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padding?: string;
};

export function Section({ children, className = "", padding = "" }: Props) {
  return (
    <section className={`w-full ${padding} ${className}`}>{children}</section>
  );
}
