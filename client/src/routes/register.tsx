import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/ui/LinkButton";
import { submitRegister } from "@/lib/auth-submit";
import { buildHead } from "@/lib/meta";
import { cn } from "@/lib/utils";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: null as string | null,
    email: null as string | null,
    password: null as string | null,
    form: null as string | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: null, email: null, password: null, form: null });

    const result = await submitRegister(form);

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

  return (
    <PageTransition className="min-h-[calc(100vh-10rem)]">
      <Section padding="pt-8 pb-2">
        <Container padding="px-4 md:px-6 lg:px-8" className="max-w-7xl">
          <div className="space-y-2">
            <SlideUp delay={0}>
              <h1 className="text-4xl font-black tracking-tight">Sign up</h1>
            </SlideUp>

            <SlideUp delay={40}>
              <p className="text-muted-foreground">
                An account allows you to use the notes services. Creating an
                account is required.
              </p>
            </SlideUp>
          </div>
        </Container>
      </Section>

      <Section padding="pt-8 pb-12 md:pt-12 lg:pt-16">
        <AuthFormShell>
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <Field>
                <FieldLabel htmlFor="name" className="sr-only">
                  Full name
                </FieldLabel>

                <Input
                  id="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={cn(
                    "placeholder:text-muted-foreground",
                    errors.name && "border-destructive",
                  )}
                />

                <FieldError>{errors.name}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="sr-only">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
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
                <Button type="submit" variant="primary" size="lg">
                  Sign up
                </Button>
              </Field>
            </FieldSet>
          </form>

          <div className="flex flex-row items-center justify-center gap-x-4 pt-6 text-center">
            <p>Already have an account?</p>

            <LinkButton to="/login" variant="ghost" size="sm">
              Sign in
            </LinkButton>
          </div>
        </AuthFormShell>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/register")({
  head: () =>
    buildHead({
      title: "Sign up",
      description:
        "Create your account to securely write, preview, and manage your notes.",
      path: "/register",
    }),
  component: RegisterPage,
});
