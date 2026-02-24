// client/src/components/layout/Fooer.tsx
import { ArrowUpIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
      <Container className="max-w-400 lg:px-8">
        <div className="flex flex-row items-center justify-between py-4">
          <p>
            &copy; {new Date().getFullYear()} Note Manager. All rights reserved.
          </p>

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
