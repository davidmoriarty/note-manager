// client/src/routes/profile.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageTransition } from "@/components/motion/PageTransition";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SlideUp } from "@/components/motion/SlideUp";
import { Badge } from "@/components/ui/badge";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";
import { authApi } from "@/lib/api";
import {
  Mail,
  FileText,
  PlusCircle,
  ShieldCheck,
  Calendar,
  Clock,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

function formatFullDate(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return initials || "??";
}

function ProfilePage() {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me(),
  });

  const statsQuery = useQuery({
    queryKey: ["meStats"],
    queryFn: () => authApi.meStats(),
  });

  const me = meQuery.data;
  const stats = statsQuery.data;
  const initials = me ? initialsFromName(me.name) : "??";

  const isDemoUser = useAuth((state) => state.isDemoUser);
  const displayEmail = isDemoUser ? "demo@example.com" : (me?.email ?? "-");

  return (
    <PageTransition className="min-h-screen pb-4">
      <Section padding="py-6 md:py-8">
        <Container padding="px-4 sm:px-6 md:px-8" className="max-w-7xl">
          <div className="space-y-1">
            <SlideUp delay={0}>
              <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
            </SlideUp>

            <SlideUp delay={40}>
              <p className="text-muted-foreground">
                Profile and account overview
              </p>
            </SlideUp>
          </div>
        </Container>
      </Section>

      <Section padding="py-0 sm:py-3 md:py-8">
        <Container padding="px-4 sm:px-6 md:px-8" className="max-w-7xl">
          <Card className="overflow-hidden border-2 bg-transparent">
            <CardContent className="grid grid-cols-1 gap-8 px-4 sm:px-8 md:grid-cols-[20rem_1fr] md:items-center md:gap-12">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 shadow-xl">
                  <AvatarImage src="#" alt="" />
                  <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <CardTitle className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
                  {meQuery.isLoading ? "Loading..." : (me?.name ?? "-")}
                </CardTitle>

                <Badge className="mt-1 bg-teal-500 px-4 text-sm font-bold text-background">
                  User ID: {me?.id ?? "-"}
                </Badge>
              </div>

              {/* Email, role, and member-since rows */}
              <div className="mx-auto flex w-fit flex-col justify-center gap-5 md:mx-0 md:justify-self-center">
                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Mail className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Email Address
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                      <span className="break-all">{displayEmail}</span>

                      {me?.emailVerified ? (
                        <Badge className="border-teal-400/20 bg-teal-400/10 text-teal-400">
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Role (still placeholder) */}
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Account Role
                    </p>
                    <p className="text-sm font-semibold">Standard User</p>
                  </div>
                </div>

                {/* Member since */}
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Member Since
                    </p>
                    <p className="text-sm font-semibold">
                      {formatFullDate(me?.memberSince)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>

      <Section padding="py-4 md:py-8">
        <Container padding="px-4 sm:px-6 md:px-8" className="max-w-7xl">
          <div className="grid grid-cols-1 gap-4 mt-4 md:mt-8 md:grid-cols-3">
            {/* TOTAL NOTES */}
            <Card className="flex sm:h-40 bg-gray-300 border-none shadow-sm dark:bg-gray-700">
              <CardContent className="flex flex-1 items-center gap-8 px-6">
                <div className="p-3 bg-primary/20 rounded-full text-primary dark:bg-gray-400/30 dark:text-gray-300">
                  <FileText className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-sm text-black dark:text-white font-bold">
                    Total Notes
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {statsQuery.isLoading ? "-" : (stats?.totalNotes ?? 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* LAST LOGIN */}
            <Card className="flex sm:h-40 bg-teal-300 border-none shadow-sm dark:bg-teal-700">
              <CardContent className="flex flex-1 items-center gap-8 px-6">
                <div className="p-3 bg-teal-600/30 rounded-full text-teal-700 dark:bg-teal-400/30 dark:text-teal-300">
                  <Clock className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-sm text-black dark:text-white font-bold">
                    Last Login
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {formatDateTime(me?.lastLoginAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* QUICK ACTION */}
            <Link to="/notes/editor" className="group block">
              <Card className="flex sm:h-40 bg-sky-300 border-none shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md dark:bg-sky-700">
                <CardContent className="flex flex-1 items-center gap-8 px-6">
                  <div className="p-3 bg-sky-600/30 rounded-full text-sky-700 dark:bg-sky-400/30 dark:text-sky-300">
                    <PlusCircle className="h-10 w-10" />
                  </div>
                  <div>
                    <p className="text-sm text-black dark:text-white font-bold">
                      Quick Action
                    </p>
                    <p className="text-2xl font-bold mt-2">New Note</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Errors (optional UI) */}
          {(meQuery.isError || statsQuery.isError) && (
            <div className="mt-6 text-sm text-destructive">
              Failed to load dashboard data.
            </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/profile")({
  beforeLoad: async () => {
    await requireAuth();
  },

  head: () =>
    buildHead({
      title: "Profile",
      description:
        "Authenticated user profile secured with JWT access tokens and rotating refresh tokens.",
      path: "/profile",
    }),

  component: ProfilePage,
});
