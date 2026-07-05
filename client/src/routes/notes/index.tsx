// client/src/routes/notes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { NoteCard } from "@/components/notes/NoteCard";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LinkButton } from "@/components/ui/LinkButton";
import { Skeleton } from "@/components/ui/skeleton";
import { toastMessage } from "@/components/ui/toast";
import type { NoteDto } from "@shared";
import { useAuth } from "@/lib/auth";
import { notesApi } from "@/lib/api";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";

const SKELETON_KEYS = Array.from({ length: 8 }, (_, i) => `skeleton-${i}`);

function NotesOverviewPage() {
  const [notes, setNotes] = useState<NoteDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const isDemoUser = useAuth((state) => state.isDemoUser);
  const [showDemoNotice, setShowDemoNotice] = useState(isDemoUser);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    () => (localStorage.getItem("noteSort") as "asc" | "desc") ?? "asc",
  );

  useEffect(() => {
    localStorage.setItem("noteSort", sortOrder);
  }, [sortOrder]);

  // Show toast for success query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    if (success) {
      toastMessage("success", success);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Fetch notes whenever user changes (user is guaranteed to be ready by api.ts)
  useEffect(() => {
    async function fetchNotes() {
      setIsLoading(true);

      try {
        // Pass 'asc' for Old-New, or 'desc' for New-Old sorting
        const fetched = await notesApi.getAll(sortOrder);
        setNotes(fetched);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        toastMessage("error", "Failed to load notes.");
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
      toastMessage("success", "Note deleted!");
    } catch (err) {
      console.error(err);
      toastMessage("error", "Failed to delete note.");
    }
  };

  return (
    <PageTransition className="min-h-[calc(100vh-10rem)]">
      <Section padding="py-8">
        <Container padding="px-2 sm:px-4 md:px-6 lg:px-8" className="max-w-7xl">
          <div className="flex flex-row flex-wrap items-center justify-between gap-6 border-b border-border px-4 pb-6 mb-6">
            <div className="space-y-1">
              <SlideUp delay={0}>
                <h1 className="text-4xl font-black tracking-tight">
                  Notes Overview
                </h1>
              </SlideUp>

              <SlideUp delay={40}>
                <p className="text-muted-foreground">
                  All your notes in one place. Quickly browse, edit, or create
                  new notes.
                </p>
              </SlideUp>
            </div>

            <SlideUp delay={80}>
              <LinkButton to="/notes/editor" variant="primary" size="md">
                + New Note
              </LinkButton>
            </SlideUp>
          </div>

          {isDemoUser && showDemoNotice && (
            <div
              className="mx-4 mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 shadow-sm"
              role="note"
              aria-label="Demo mode notice"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm">
                  <p>
                    <strong>Demo mode:</strong> This is a temporary demo
                    workspace.
                  </p>
                  <p>Please don't enter sensitive information.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDemoNotice(false)}
                  className="shrink-0 rounded px-2 text-lg leading-none text-amber-950 hover:bg-amber-100"
                  aria-label="Dismiss notice"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/*Notes sorting toggles*/}
          <ToggleGroup
            type="single"
            value={sortOrder}
            onValueChange={(value) =>
              value && setSortOrder(value as "asc" | "desc")
            }
            className="ml-auto pr-2 sm:pr-4 md:pr-6 lg:pr-8"
          >
            <ToggleGroupItem
              value="desc"
              aria-label="Newest First"
              className="bg-secondary text-background"
            >
              <ArrowDownAZ />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="asc"
              aria-label="Oldest First"
              className="bg-secondary text-background"
            >
              <ArrowUpAZ />
            </ToggleGroupItem>
          </ToggleGroup>
        </Container>
      </Section>

      <Section padding="pb-8">
        <Container padding="px-2 sm:px-4 md:px-6 lg:px-8" className="max-w-7xl">
          <div className="flex flex-col gap-3 px-4">
            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {isLoading
                ? SKELETON_KEYS.map((key) => (
                    <div
                      key={key}
                      className="flex flex-col justify-between h-full border rounded-md p-4"
                    >
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6 mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="mt-4 flex gap-2">
                        <Skeleton className="h-8 w-16 rounded" />
                        <Skeleton className="h-8 w-16 rounded" />
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
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/notes/")({
  beforeLoad: async () => {
    requireAuth();
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
