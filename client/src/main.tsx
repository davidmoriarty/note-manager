import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "@/styles/index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
    historyState: {
      successMessage?: string;
    };
  }
}

function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const meta =
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]') ??
      (() => {
        const m = document.createElement("meta");
        m.name = "theme-color";
        document.head.appendChild(m);
        return m;
      })();

    const isDark = resolvedTheme === "dark";
    meta.content = isDark ? "#111827" : "#f9fafb";
  }, [resolvedTheme]);

  return null;
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the id is correct.",
  );
}

// Render the app
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <ThemeColorSync />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
