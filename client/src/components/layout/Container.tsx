// client/src/components/ui/Container.tsx
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: Props) {
  return (
    <div className={`container mx-auto px-4 ${className}`}>{children}</div>
  );
}

// USAGE
// <Container className="my-4">
//   <div className="bg-white rounded-lg shadow-md p-4">
//     <h2 className="text-xl font-bold mb-2">Notes Overview</h2>
//     <p className="text-gray-600">Manage your notes here.</p>
//   </div>
// </Container>
