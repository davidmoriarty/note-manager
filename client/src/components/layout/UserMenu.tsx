// client/src/components/layout/UserMenu.tsx
import { useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { DemoBadge } from "../demo/DemoBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { submitLogout } from "@/lib/auth-submit";

export function UserMenu() {
  const navigate = useNavigate();

  const { user, isDemoUser } = useAuth();
  const label = user?.name ?? user?.email ?? "Account";

  const handleLogout = async () => {
    const result = await submitLogout({});
    if (result.ok) {
      // Redirect after logout
      navigate({ to: "/login" });
    } else {
      console.warn("Logout failed:", result.formError);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="text-foreground hover:no-underline"
        >
          <span className="flex items-center gap-2">
            <span>{label}</span>
            {isDemoUser && <DemoBadge />}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {user ? (
          <>
            <DropdownMenuItem
              onSelect={() => {
                navigate({ to: "/profile" });
              }}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onSelect={() => {
                navigate({ to: "/login" });
              }}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                navigate({ to: "/register" });
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign up
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
