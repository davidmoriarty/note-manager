// client/src/routes/login.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DEMO_WELCOME_KEY } from "@/lib/demo";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { AuthLoadingOverlay } from "@/components/auth/AuthLoadingOverlay";
import { useAuth } from "@/lib/auth";
import { DemoButton } from "@/components/demo/DemoButton";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/ui/LinkButton";
import { submitDemoLogin, submitLogin } from "@/lib/auth-submit";
import { buildHead } from "@/lib/meta";
import { cn } from "@/lib/utils";

const authOverlayContent = {
  login: {
    title: "Signing you in...",
    steps: [
      "Verifying credentials",
      "Creating secure session",
      "Loading your workspace",
      "Opening your workspace...",
    ],
  },
  demo: {
    title: "Preparing your demo workspace...",
    steps: [
      "Creating temporary account",
      "Loading sample notes",
      "Signing you in",
      "Opening your workspace...",
    ],
  },
} as const;

function LoginPage() {
  const navigate = useNavigate();
  const { reason, redirect } = Route.useSearch();

  const [sessionNotice] = useState(() => {
    if (reason === "demo-expired") {
      return "Your demo session ended. Start a new demo session to continue.";
    }

    if (reason === "session-expired") {
      return "Your session expired. Please sign in again.";
    }

    return null;
  });

  useEffect(() => {
    if (!reason) return;

    void navigate({
      to: "/login",
      search: redirect ? { redirect } : {},
      replace: true,
    });
  }, [navigate, reason, redirect]);

  const [form, setForm] = useState({ email: "", password: "" });
  const [authLoadingMode, setAuthLoadingMode] = useState<
    "login" | "demo" | null
  >(null);
  const isAuthLoading = authLoadingMode !== null;
  const setAuthTransitioning = useAuth((state) => state.setAuthTransitioning);
  const [authSucceeded, setAuthSucceeded] = useState(false);
  const [overlayCompleted, setOverlayCompleted] = useState(false);
  const [errors, setErrors] = useState({
    form: null as string | null,
    email: null as string | null,
    password: null as string | null,
  });

  useEffect(() => {
    if (!authSucceeded || !overlayCompleted) return;

    navigate({ to: "/notes", replace: true }).then(() => {
      setAuthTransitioning(false);
    });
  }, [authSucceeded, overlayCompleted, navigate, setAuthTransitioning]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ email: null, password: null, form: null });
    setAuthTransitioning(true);
    setAuthLoadingMode("login");
    setAuthSucceeded(false);
    setOverlayCompleted(false);

    const result = await submitLogin(form);

    if (result.ok) {
      setAuthSucceeded(true);
      return;
    }

    setAuthTransitioning(false);
    setAuthSucceeded(false);
    setOverlayCompleted(false);
    setAuthLoadingMode(null);

    setErrors((prev) => ({
      ...prev,
      ...result.fieldErrors,
      form: result.formError ?? result.fieldErrors?.form ?? "Login failed",
    }));
  };

  const handleDemoLogin = async () => {
    setErrors({ email: null, password: null, form: null });
    setAuthTransitioning(true);
    setAuthLoadingMode("demo");
    setAuthSucceeded(false);
    setOverlayCompleted(false);

    const result = await submitDemoLogin({});

    if (result.ok) {
      sessionStorage.removeItem(DEMO_WELCOME_KEY);
      setAuthSucceeded(true);
      return;
    }

    setAuthTransitioning(false);
    setAuthSucceeded(false);
    setOverlayCompleted(false);
    setAuthLoadingMode(null);

    setErrors((prev) => ({
      ...prev,
      form: result.formError ?? result.fieldErrors?.form ?? "Demo login failed",
    }));
  };

  const overlay =
    authLoadingMode === null ? null : authOverlayContent[authLoadingMode];

  return (
    <PageTransition className="min-h-[calc(100vh-10rem)]">
      {overlay && (
        <AuthLoadingOverlay
          open={isAuthLoading}
          title={overlay.title}
          steps={overlay.steps}
          onComplete={() => setOverlayCompleted(true)}
        />
      )}

      <Section padding="pt-8 pb-4">
        <Container padding="px-4 md:px-6 lg:px-8" className="max-w-7xl">
          <div className="space-y-2">
            <SlideUp delay={0}>
              <h1 className="text-4xl font-black tracking-tight">Sign in</h1>
            </SlideUp>

            <SlideUp delay={40}>
              <p className="text-muted-foreground">
                Enter your email and password to access your account.
              </p>
            </SlideUp>
          </div>
        </Container>

        {sessionNotice && (
          <Container padding="px-4 md:px-6 lg:px-8" className="mt-6 max-w-7xl">
            <output className="block rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
              {sessionNotice}
            </output>
          </Container>
        )}
      </Section>

      <Section padding="pt-8 pb-12 md:pt-12 lg:pt-16">
        <AuthFormShell>
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <Field>
                <FieldLabel htmlFor="email" className="sr-only">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  autoComplete="email"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className={cn(
                    "placeholder:text-muted-foreground",
                    errors.email && "border-destructive",
                  )}
                />

                <FieldError>{errors.email}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="password" className="sr-only">
                  Password
                </FieldLabel>

                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  autoComplete="current-password"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className={cn(
                    "placeholder:text-muted-foreground",
                    errors.password && "border-destructive",
                  )}
                />

                <FieldError>{errors.password}</FieldError>
              </Field>

              <Field>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isAuthLoading}
                >
                  Sign in
                </Button>

                <DemoButton
                  loading={authLoadingMode === "demo"}
                  onClick={handleDemoLogin}
                  disabled={isAuthLoading}
                />
              </Field>

              {errors.form && (
                <p className="mt-2 text-destructive text-center">
                  {errors.form}
                </p>
              )}
            </FieldSet>
          </form>

          <div className="flex flex-row items-center justify-center gap-x-4 pt-6 text-center">
            <p>Don't have an account?</p>

            <LinkButton to="/register" variant="ghost" size="sm">
              Sign up
            </LinkButton>
          </div>
        </AuthFormShell>
      </Section>
    </PageTransition>
  );
}

type LoginSearch = {
  redirect?: string;
  reason?: "session-expired" | "demo-expired";
};

function validateLoginSearch(search: Record<string, unknown>): LoginSearch {
  const reason =
    search.reason === "session-expired" || search.reason === "demo-expired"
      ? search.reason
      : undefined;

  return {
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    reason,
  };
}

export const Route = createFileRoute("/login")({
  validateSearch: validateLoginSearch,
  head: () =>
    buildHead({
      title: "Sign in",
      description: "Sign in to access your notes securely.",
      path: "/login",
    }),
  component: LoginPage,
});
