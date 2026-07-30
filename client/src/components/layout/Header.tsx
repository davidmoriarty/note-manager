// client/src/components/layout/Header.tsx
import { Link } from "@tanstack/react-router";
import { UserMenu } from "@/components/layout/UserMenu";
import { ModeToggle } from "@/components/mode-toggle";
import { Container } from "@/components/layout/Container";
import { useAuth } from "@/lib/auth";

export function Header() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      <Container padding="px-4 sm:px-6 md:px-8" className="max-w-7xl">
        <div className="flex flex-row items-center justify-between py-4">
          <Link to="/" className="text-lg font-black">
            Note Manager
          </Link>

          <nav className="flex flex-row items-center gap-x-2 sm:gap-x-4">
            {isAuthenticated && <Link to="/notes">Notes</Link>}
            <UserMenu />
            <ModeToggle />
          </nav>
        </div>
      </Container>
    </header>
  );
}
