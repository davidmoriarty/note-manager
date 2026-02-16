// client/src/components/layout/Header.tsx
import { Link } from "@tanstack/react-router";
import { UserMenu } from "@/components/layout/UserMenu";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/auth";

export function Header() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 sm:px-8 py-6">
        <a href="/" className="text-lg font-bold">
          Note Manager
        </a>

        <nav className="flex flex-row items-center gap-x-6">
          {isAuthenticated && <Link to="/notes">Notes</Link>}
          <UserMenu />
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
