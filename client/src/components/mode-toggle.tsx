// client/src/components/mode-toggle.tsx

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "system";

const themeOptions: Array<{
  value: Theme;
  label: string;
  icon: typeof Sun;
}> = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
  },
];

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={theme === "system" ? "w-12 gap-1" : undefined}
        >
          {theme === "light" && <Sun className="size-5" />}

          {theme === "dark" && <Moon className="size-5" />}

          {theme === "system" && (
            <>
              <Monitor className="size-4" />
              {resolvedTheme === "dark" ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </>
          )}

          <span className="sr-only">
            Theme: {theme}
            {theme === "system" ? ` (${resolvedTheme})` : ""}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value)}
            className="gap-2"
          >
            <Icon className="size-4" />

            <span>{label}</span>

            {value === "system" && (
              <span className="text-xs text-muted-foreground">
                ({resolvedTheme})
              </span>
            )}

            {theme === value && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
