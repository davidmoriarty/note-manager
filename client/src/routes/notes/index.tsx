// client/src/routes/notes/index.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { LinkButton } from "@/components/ui/LinkButton";
import { Skeleton } from "@/components/ui/skeleton";
import { toastMessage } from "@/components/ui/toast";
import type { NoteDto } from "@shared";
import { notesApi } from "@/lib/api";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";

const SKELETON_KEYS = Array.from({ length: 8 }, (_, i) => `skeleton-${i}`);

function NotesOverviewPage() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState<NoteDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  const formatDate = (ts: string | Date) =>
    new Date(ts).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const preview = (content: string) =>
    content.length > 40 ? `${content.substring(0, 40)}...` : content;

  return (
    <PageTransition className="min-h-screen">
      <Section padding="py-16">
        <Container className="max-w-400">
          <div className="flex flex-row flex-wrap items-center justify-between gap-6 border-b border-border px-4 pb-8 mb-6">
            <div className="space-y-2">
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

          <div className="flex flex-col gap-3 px-4">
            {/*Notes sorting toggles*/}
            <ToggleGroup
              type="single"
              defaultValue="desc"
              onValueChange={(value) =>
                value && setSortOrder(value as "asc" | "desc")
              }
              className="ml-auto mb-2"
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
                    <Card
                      key={note.id}
                      className="flex flex-col justify-between pt-4"
                    >
                      <CardHeader>
                        <CardTitle className="prose-lg dark:prose-invert">
                          {note.title || "Untitled Note"}
                        </CardTitle>
                        {note.createdAt && (
                          <CardDescription className="prose dark:prose-invert">
                            {formatDate(note.createdAt)}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="font-normal font-sm">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {preview(note.content || "")}
                        </ReactMarkdown>
                      </CardContent>
                      <CardFooter>
                        <CardAction>
                          <ButtonGroup>
                            {/* SAVE / EDIT Button */}
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                navigate({
                                  to: `/notes/viewer/${note.id}`,
                                  params: { noteId: String(note.id) },
                                });
                              }}
                            >
                              View
                            </Button>
                            <ButtonGroupSeparator />
                            {/* DELETE NOTE Dialog */}
                            <DeleteNoteDialog
                              noteId={note.id}
                              open={noteToDelete === note.id}
                              onOpenChange={(open) =>
                                setNoteToDelete(open ? note.id : null)
                              }
                              onDelete={deleteNote}
                            />
                          </ButtonGroup>
                        </CardAction>
                      </CardFooter>
                    </Card>
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
