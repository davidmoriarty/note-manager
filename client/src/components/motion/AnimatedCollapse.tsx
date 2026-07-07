// client/src/components/motion/AnimatedCollapse.tsx

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AnimatedCollapseProps = {
  open: boolean;
  children: ReactNode;
  className?: string;
  duration?: number;
  openClassName?: string;
  closedClassName?: string;
};

export function AnimatedCollapse({
  open,
  children,
  className,
  duration = 300,
  openClassName,
  closedClassName,
}: AnimatedCollapseProps) {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all ease-out",
        open
          ? "max-h-96 translate-y-0 opacity-100"
          : "max-h-0 -translate-y-2 opacity-0",
        open ? openClassName : closedClassName,
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
