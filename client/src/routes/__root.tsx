// client/src/routes/__root.tsx

import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { ErrorPage } from "@/components/error/ErrorPage";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { AuthLoader } from "@/lib/auth-loader";

function RootLayout() {
  useEffect(() => {
    AuthLoader().catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <HeadContent />
      <Header />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <Footer />
      <Toaster />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  );
}

export const Route = createRootRoute({
  notFoundComponent: () => <ErrorPage status={404} />,
  component: RootLayout,
});
