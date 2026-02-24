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
      <Container className="max-w-400 lg:px-8">
        <div className="flex flex-row items-center justify-between py-4">
          <a href="/" className="text-lg font-black">
            Note Manager
          </a>

          <nav className="flex flex-row items-center gap-x-6">
            {isAuthenticated && <Link to="/notes">Notes</Link>}
            <UserMenu />
            <ModeToggle />
          </nav>
        </div>
      </Container>
    </header>
  );
}
