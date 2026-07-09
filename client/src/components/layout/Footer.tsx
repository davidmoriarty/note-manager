// client/src/components/layout/Fooer.tsx

import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <Container padding="px-4 py-4 sm:px-6 md:px-8" className="max-w-7xl">
        <p className="text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} Note Manager
        </p>
      </Container>
    </footer>
  );
}
