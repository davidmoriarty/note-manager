// client/src/components/layout/Fooer.tsx
import { ArrowUpIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
      <Container padding="px-4 sm:px-6 md:px-8" className="max-w-7xl">
        <div className="w-full flex flex-row items-center justify-between py-4">
          <div className="text-xs sm:text-base flex flex-col sm:flex-row gap-1">
            <p>&copy; {new Date().getFullYear()} Note Manager.</p>
            <p>All rights reserved.</p>
          </div>

          <Button
            variant="primary"
            size="icon"
            className="rounded-full"
            asChild
          >
            <a href="#top">
              <ArrowUpIcon />
            </a>
          </Button>
        </div>
      </Container>
    </footer>
  );
}
