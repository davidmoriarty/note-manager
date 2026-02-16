import { createRootRoute, Outlet } from "@tanstack/react-router";
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
      <Header />
      <main className="flex flex-col flex-1">
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
