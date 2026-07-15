// client/src/components/layout/UserMenu.tsx
import { useLocation, useNavigate } from "@tanstack/react-router";
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

  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isProfilePage = location.pathname === "/profile";

  const { user, isDemoUser, isAuthTransitioning } = useAuth();

  const visibleUser = isAuthTransitioning ? null : user;
  const visibleIsDemoUser = isAuthTransitioning ? false : isDemoUser;

  const label = visibleUser?.name ?? visibleUser?.email ?? "Account";

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
            {!visibleIsDemoUser && <span>{label}</span>}

            {visibleIsDemoUser ? (
              <>
                <span className="hidden sm:inline">{label}</span>
                <DemoBadge />
              </>
            ) : null}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {visibleUser ? (
          <>
            {!isProfilePage && (
              <DropdownMenuItem
                onSelect={() => {
                  navigate({ to: "/profile" });
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {!isLoginPage && (
              <DropdownMenuItem
                onSelect={() => {
                  navigate({ to: "/login" });
                }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </DropdownMenuItem>
            )}

            {!isRegisterPage && (
              <DropdownMenuItem
                onSelect={() => {
                  navigate({ to: "/register" });
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign up
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
