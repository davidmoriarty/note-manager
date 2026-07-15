// client/src/components/theme-provider.tsx

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function syncHighlightTheme(resolved: ResolvedTheme) {
  const id = "hljs-theme";
  const href =
    resolved === "dark" ? "/hljs/github-dark.css" : "/hljs/github.css";

  let link = document.querySelector<HTMLLinkElement>(`link#${id}`);

  if (!link) {
    link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  const absolute = new URL(href, window.location.origin).href;

  if (link.href !== absolute) {
    link.href = href;
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "note-manager-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme),
  );

  useEffect(() => {
    const root = window.document.documentElement;

    const apply = () => {
      const resolved = resolveTheme(theme);

      setResolvedTheme(resolved);
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      syncHighlightTheme(resolved);
    };

    apply();

    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", apply);

    return () => mediaQuery.removeEventListener("change", apply);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (nextTheme: Theme) => {
        localStorage.setItem(storageKey, nextTheme);
        setThemeState(nextTheme);
      },
    }),
    [resolvedTheme, storageKey, theme],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
