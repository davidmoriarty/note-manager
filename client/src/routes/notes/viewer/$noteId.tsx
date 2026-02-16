// client/src/routes/notes/viewer/$noteId.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Section } from "@/components/layout/Section";
import { PageTransition } from "@/components/motion/PageTransition";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/LinkButton";
import { Skeleton } from "@/components/ui/skeleton";
import { type Note, notesApi } from "@/lib/api";
import { requireAuth } from "@/lib/route-guard";

function NotesViewerPage() {
  const navigate = useNavigate();

  const { noteId } = Route.useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notes
  useEffect(() => {
    let cancelled = false;
    const idNum = Number(noteId);

    if (!noteId || noteId === "new" || Number.isNaN(idNum)) {
      // RootRoute will handle 404
      setIsLoading(false);
      setNote(null);
      return;
    }

    setIsLoading(true);
    setNote(null);

    notesApi
      .getOne(idNum)
      .then((fetched) => {
        if (cancelled) return;
        setNote(fetched);
      })
      .catch(() => {
        if (cancelled) return;
        setNote(null);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [noteId]);

  const previewContent = () =>
    note?.content ? note.content : "No content available";

  return (
    <PageTransition className="min-h-screen">
      <Section centered className="h-full">
        <div className="container mx-auto">
          {/* Header */}
          {!note || isLoading ? (
            <div className="w-full mx-auto animate-pulse">
              <Skeleton className="h-8 w-3/4" />
            </div>
          ) : (
            <div className="py-8">
              <h1 className="text-4xl font-semibold">{note.title}</h1>
            </div>
          )}

          {/* Content */}
          <div className="lg:col-span-8">
            {!note || isLoading ? (
              <div className="w-full animate-pulse">
                <Skeleton className="h-75 w-full my-6" />
                <div className="flex flex-row items-center justify-center gap-x-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
              </div>
            ) : (
              <article className="text-lg font-medium py-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {previewContent()}
                </ReactMarkdown>

                <div className="flex flex-row items-center justify-center gap-x-4 mt-12">
                  <LinkButton to="/notes" variant="primary" size="md">
                    Back
                  </LinkButton>
                  <Button
                    variant="sky"
                    size="md"
                    onClick={() => {
                      navigate({
                        to: "/notes/editor/$noteId",
                        params: { noteId: String(note.id) },
                      });
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </article>
            )}
          </div>
        </div>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/notes/viewer/$noteId")({
  beforeLoad: async () => {
    requireAuth();
  },
  component: NotesViewerPage,
});
