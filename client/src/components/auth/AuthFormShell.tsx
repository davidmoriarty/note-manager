// client/src/components/auth/AuthFormShell.tsx

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";

type AuthFormShellProps = {
  children: ReactNode;
};

export function AuthFormShell({ children }: AuthFormShellProps) {
  return (
    <Container
      padding="p-8"
      className={cn(
        "max-w-xl bg-slate-50 sm:max-w-2xl sm:rounded lg:max-w-3xl",
      )}
    >
      {children}
    </Container>
  );
}
