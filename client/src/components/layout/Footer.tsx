// client/src/components/layout/Fooer.tsx
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="flex items-center justify-between px-4 sm:px-8 py-6">
        <p>
          &copy; {new Date().getFullYear()} Note Manager. All rights reserved.
        </p>

        <Button variant="primary" size="icon" className="rounded-full" asChild>
          <a href="#top">
            <ArrowUpIcon />
          </a>
        </Button>
      </div>
    </footer>
  );
}
