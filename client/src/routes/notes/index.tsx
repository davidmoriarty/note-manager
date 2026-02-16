// client/src/routes/notes/index.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section } from "@/components/layout/Section";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/ui/LinkButton";
import { Skeleton } from "@/components/ui/skeleton";
import { toastMessage } from "@/components/ui/toast";
import { type Note, notesApi } from "@/lib/api";
import { requireAuth } from "@/lib/route-guard";

function NotesOverviewPage() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

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
        const fetched = await notesApi.getAll();
        setNotes(fetched);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        toastMessage("error", "Failed to load notes.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotes();
  }, []);

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

  const formatDate = (ts: number) =>
    new Date(ts * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const preview = (content: string) =>
    content.length > 80 ? `${content.substring(0, 80)}...` : content;

  return (
    <PageTransition className="min-h-screen">
      <Section centered className="py-20 gap-y-8">
        <SlideUp
          delay={0}
          className="text-4xl md:text-5xl font-black text-center"
        >
          <h1>Notes Overview</h1>
        </SlideUp>

        <SlideUp delay={40} className="text-lg text-center">
          All your notes in one place. Quickly browse, edit, or create new
          notes.
        </SlideUp>

        <SlideUp delay={80}>
          <LinkButton to="/notes/editor" variant="primary" size="lg">
            + New Note
          </LinkButton>
        </SlideUp>
      </Section>

      <Section centered className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: Math.max(notes.length, 8) }).map(() => {
                const key = crypto.randomUUID(); // unique key
                return (
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
                );
              })
            : notes.map((note) => (
                <Card
                  key={note.id}
                  className="flex flex-col justify-between h-full"
                >
                  <CardHeader>
                    <CardTitle>{note.title || "Untitled Note"}</CardTitle>
                    {note.created_at && (
                      <CardDescription>
                        {formatDate(note.created_at)}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>{preview(note.content || "")}</CardContent>

                  <CardAction className="px-5">
                    <ButtonGroup className="gap-1">
                      {/* SAVE / EDIT Button */}
                      <Button
                        variant="sky"
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
                </Card>
              ))}
        </div>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/notes/")({
  beforeLoad: async () => {
    requireAuth();
  },
  component: NotesOverviewPage,
});
