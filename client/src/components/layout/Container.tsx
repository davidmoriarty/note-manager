// client/src/components/ui/Container.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  padding?: string;
  className?: string;
};

export function Container({ children, padding, className }: Props) {
  return (
    <div className={cn("container mx-auto", padding, className)}>
      {children}
    </div>
  );
}
