// client/src/routes/login.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/ui/LinkButton";
import { submitDemoLogin, submitLogin } from "@/lib/auth-submit";
import { buildHead } from "@/lib/meta";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    form: null as string | null,
    email: null as string | null,
    password: null as string | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ email: null, password: null, form: null });

    const result = await submitLogin(form);

    if (result.ok) {
      // Redirect to notes overview
      navigate({ to: "/notes" });
    } else {
      setErrors((prev) => ({
        ...prev,
        ...result.fieldErrors,
        form: result.formError ?? result.fieldErrors?.form ?? "Login failed",
      }));
    }
  };

  const handleDemoLogin = async () => {
    setErrors({ email: null, password: null, form: null });

    const result = await submitDemoLogin({});

    if (result.ok) {
      navigate({ to: "/notes" });
    } else {
      setErrors((prev) => ({
        ...prev,
        form:
          result.formError ?? result.fieldErrors?.form ?? "Demo login failed",
      }));
    }
  };

  return (
    <PageTransition className="min-h-[calc(100vh-10rem)]">
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
      </Section>

      <Section padding="py-8">
        <Container
          padding="px-4 md:px-6 lg:px-8"
          className="max-w-3xl sm:rounded"
        >
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className={errors.email ? "border-destructive" : ""}
                />
                <FieldError>{errors.email}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className={errors.password ? "border-destructive" : ""}
                />
                <FieldError>{errors.password}</FieldError>
              </Field>

              <Field className="mt-4">
                <Button type="submit" variant="primary" size="lg">
                  Sign in
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleDemoLogin}
                >
                  Try Demo
                </Button>
              </Field>

              {errors.form && (
                <p className="mt-2 text-destructive text-center">
                  {errors.form}
                </p>
              )}
            </FieldSet>
          </form>

          <div className="flex flex-row items-center justify-center text-center gap-x-4 pt-6">
            <p>Don't have an account?</p>
            <LinkButton to="/register" variant="ghost" size="sm">
              Sign up
            </LinkButton>
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/login")({
  head: () =>
    buildHead({
      title: "Sign in",
      description: "Sign in to access your notes securely.",
      path: "/login",
    }),
  component: LoginPage,
});
