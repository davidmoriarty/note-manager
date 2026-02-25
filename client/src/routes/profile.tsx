// client/src/routes/profile.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageTransition } from "@/components/motion/PageTransition";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

function formatDate(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
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

  return (
    <PageTransition className="min-h-screen">
      <Section padding="py-12">
        <Container className="max-w-4xl">
          <div className="mb-8">
            <SlideUp delay={0}>
              <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
            </SlideUp>

            <SlideUp delay={40}>
              <p className="text-muted-foreground">
                Profile and account overview
              </p>
            </SlideUp>
          </div>

          <Card className="bg-transparent overflow-hidden border-2">
            <CardHeader>
              <div className="flex flex-col items-center sm:flex-row sm:gap-6">
                <Avatar className="h-32 w-32 shadow-xl">
                  <AvatarImage src="#" alt="#" />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center sm:text-left mt-4 sm:mt-0 space-y-1">
                  <CardTitle className="text-4xl font-black tracking-tight">
                    {meQuery.isLoading ? "Loading..." : (me?.name ?? "-")}
                  </CardTitle>
                  <CardDescription>
                    <Badge className="bg-gray-200 text-muted-foreground px-4 text-sm">
                      User ID: {me?.id ?? "-"}
                    </Badge>

                    {me?.emailVerified ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
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
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-6 pt-8">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Mail className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-muted-foreground">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold">{me?.email ?? "-"}</p>
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
                    {formatDate(me?.memberSince)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* TOTAL NOTES */}
            <Card className="bg-white dark:bg-slate-900 shadow-sm border-none">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Notes
                  </p>
                  <p className="text-2xl font-bold">
                    {statsQuery.isLoading ? "-" : (stats?.totalNotes ?? 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* LAST LOGIN */}
            <Card className="bg-white dark:bg-slate-900 shadow-sm border-none">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Last Login
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDateTime(me?.lastLoginAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* QUICK ACTION */}
            <Link to="/notes/editor" className="group">
              <Card className="bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all border-none h-full">
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80 font-medium">
                      Quick Action
                    </p>
                    <p className="text-xl font-bold">New Note</p>
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
    requireAuth();
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
