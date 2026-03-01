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
    <>
      <HeadContent />
      <Header />
      <main className="flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}

export const Route = createRootRoute({
  notFoundComponent: () => <ErrorPage status={404} />,
  component: RootLayout,
});
