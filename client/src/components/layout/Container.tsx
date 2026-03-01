// client/src/components/ui/Container.tsx
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  padding?: string;
  className?: string;
};

export function Container({ children, padding = "", className = "" }: Props) {
  return (
    <div className={`container mx-auto ${padding} ${className}`}>
      {children}
    </div>
  );
}
