import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/ui/LinkButton";
import { submitRegister } from "@/lib/auth-submit";
import { buildHead } from "@/lib/meta";

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
    <PageTransition className="min-h-[90vh] flex flex-col items-center justify-center ">
      <Section padding="py-16">
        <Container className="max-w-xl">
          <div className="mb-8 space-y-2">
            <SlideUp delay={0}>
              <h1 className="text-4xl mb-4">Sign up</h1>
            </SlideUp>
            <SlideUp delay={40}>
              <p className="text-muted-foreground">
                An account allows you to use the notes services. Creating an
                account is required.
              </p>
            </SlideUp>
          </div>

          <form onSubmit={handleSubmit}>
            <FieldSet className="max-w-xl mx-auto">
              <Field>
                <FieldLabel htmlFor="name">Full name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={errors.name ? "border-destructive" : ""}
                />
                <FieldError>{errors.name}</FieldError>
              </Field>

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
                <Button type="submit" variant="sky" size="lg">
                  Sign up
                </Button>
              </Field>
            </FieldSet>
          </form>

          <div className="flex flex-row items-center justify-center text-center gap-x-2 pt-4">
            <p>Already have an account?</p>
            <LinkButton to="/login" variant="link" size="sm">
              Sign in
            </LinkButton>
          </div>
        </Container>
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
