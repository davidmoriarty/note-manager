// client/src/routes/notes/index.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Eye,
  FilePenLine,
  FolderOpen,
  ShieldCheck,
} from "lucide-react";
import { DEMO_WELCOME_KEY } from "@/lib/demo";
import { NoteCard } from "@/components/notes/NoteCard";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LinkButton } from "@/components/ui/LinkButton";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { DemoWelcomeDialog } from "@/components/demo/DemoWelcomeDialog";
import type { NoteDto } from "@shared";
import { useAuth } from "@/lib/auth";
import { notesApi } from "@/lib/api";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";

const demoFeatures = [
  {
    icon: FilePenLine,
    title: "Write",
    description: "Create and edit Markdown notes.",
  },
  {
    icon: Eye,
    title: "Preview",
    description: "Switch between editor and preview views.",
  },
  {
    icon: FolderOpen,
    title: "Organize",
    description: "Browse, sort, and manage your notes.",
  },
  {
    icon: ShieldCheck,
    title: "Private accounts",
    description: "Sign up to keep your own notes private.",
  },
] as const;

function NotesOverviewPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<NoteDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const isDemoUser = useAuth((state) => state.isDemoUser);

  const skeletonCount = isDemoUser ? 3 : 8;
  const skeletonKeys = Array.from(
    { length: skeletonCount },
    (_, i) => `skeleton-${i}`,
  );

  const [showDemoWelcome, setShowDemoWelcome] = useState(false);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() => {
    const savedSort = localStorage.getItem("noteSort");
    return savedSort === "desc" ? "desc" : "asc";
  });

  useEffect(() => {
    if (!isDemoUser) return;

    if (sessionStorage.getItem(DEMO_WELCOME_KEY) === "true") {
      return;
    }

    const timer = setTimeout(() => {
      setShowDemoWelcome(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [isDemoUser]);

  useEffect(() => {
    localStorage.setItem("noteSort", sortOrder);
  }, [sortOrder]);

  // Show toast for success query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    if (success) {
      toast.success(success);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const dismissDemoWelcome = () => {
    sessionStorage.setItem(DEMO_WELCOME_KEY, "true");
    setShowDemoWelcome(false);
  };

  // Fetch notes whenever the sort order changes.
  useEffect(() => {
    async function fetchNotes() {
      setIsLoading(true);

      try {
        const fetched = await notesApi.getAll(sortOrder);
        setNotes(fetched);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        toast.error("Failed to load notes.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotes();
  }, [sortOrder]);

  const deleteNote = async (id: number) => {
    try {
      await notesApi.remove(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setNoteToDelete(null);
      toast.success("Note deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note.");
    }
  };

  return (
    <PageTransition className="min-h-[calc(100vh-10rem)]">
      <DemoWelcomeDialog
        open={showDemoWelcome}
        appName="Note Manager"
        description="Explore curated sample notes showcasing Markdown editing, organization, and note management."
        features={demoFeatures}
        notice="This demo uses a shared temporary account. Don’t enter personal or sensitive information. Create an account to keep your own notes private."
        onPrimary={dismissDemoWelcome}
        onSecondary={() => navigate({ to: "/register" })}
      />

      <Section padding="py-6 sm:py-8">
        <Container
          padding="px-6 sm:px-8 md:px-10 lg:px-12"
          className="max-w-7xl"
        >
          <div className="border-b border-border pb-4 sm:pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <SlideUp delay={0}>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Notes Overview
                  </h1>
                </SlideUp>

                <SlideUp delay={40}>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    All your notes in one place. Quickly browse, edit, or create
                    new notes.
                  </p>
                </SlideUp>
              </div>

              <SlideUp delay={80}>
                <LinkButton
                  to="/notes/editor"
                  variant="primary"
                  size="sm"
                  className="shrink-0 sm:hidden"
                >
                  + New
                </LinkButton>

                <LinkButton
                  to="/notes/editor"
                  variant="primary"
                  size="sm"
                  className="hidden shrink-0 sm:inline-flex"
                >
                  + New Note
                </LinkButton>
              </SlideUp>
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="pb-4">
        <Container
          padding="px-6 sm:px-8 md:px-10 lg:px-12"
          className="max-w-7xl"
        >
          <div className="flex w-full items-center justify-end gap-3 py-2">
            <span className="text-sm font-medium text-muted-foreground">
              Sort by
            </span>

            {/*Notes sorting toggles*/}
            <ToggleGroup
              type="single"
              value={sortOrder}
              onValueChange={(value) => {
                if (value === "asc" || value === "desc") {
                  setSortOrder(value);
                }
              }}
            >
              <ToggleGroupItem value="desc" aria-label="Newest First">
                <ArrowDownAZ />
              </ToggleGroupItem>

              <ToggleGroupItem value="asc" aria-label="Oldest First">
                <ArrowUpAZ />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Container>
      </Section>

      <Section padding="pb-8">
        <Container
          padding="px-6 sm:px-8 md:px-10 lg:px-12"
          className="max-w-7xl"
        >
          {/* Notes Grid */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-4 md:gap-8">
            {isLoading
              ? skeletonKeys.map((key) => (
                  <div
                    key={key}
                    className="flex h-full flex-col rounded-md border p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <Skeleton className="mb-2 h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <div className="flex gap-1">
                        <Skeleton className="size-8 rounded" />
                        <Skeleton className="size-8 rounded" />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))
              : notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    noteToDelete={noteToDelete}
                    setNoteToDelete={setNoteToDelete}
                    onDelete={deleteNote}
                  />
                ))}
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/notes/")({
  beforeLoad: async () => {
    await requireAuth();
  },

  head: () =>
    buildHead({
      title: "Notes Overview",
      description:
        "Access and manage all your notes with protected routes and secure JWT authentication.",
      path: "/notes",
    }),

  component: NotesOverviewPage,
});
