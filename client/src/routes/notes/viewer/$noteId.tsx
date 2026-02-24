// client/src/routes/notes/viewer/$noteId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageTransition } from "@/components/motion/PageTransition";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { LinkButton } from "@/components/ui/LinkButton";
import { Skeleton } from "@/components/ui/skeleton";
import { SlideUp } from "@/components/motion/SlideUp";
import { type Note, notesApi } from "@/lib/api";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";

function NotesViewerPage() {
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

  const formatDate = (ts: string | Date) =>
    new Date(ts).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const previewContent = () =>
    note?.content ? note.content : "No content available";

  return (
    <PageTransition className="min-h-[calc(100vh-8rem)]">
      <Section padding="py-16">
        <Container className="max-w-4xl">
          <div className="mb-8 space-y-2">
            <SlideUp delay={0}>
              <h1 className="text-4xl font-black tracking-tight">Note View</h1>
            </SlideUp>
            <SlideUp delay={40}>
              <p className="text-muted-foreground">
                See the full content of your note. If you want to edit it, click
                on the edit button.
              </p>
            </SlideUp>
          </div>

          <article className="max-w-4xl mx-auto border-2 border-gray-400 dark:border-gray-500 rounded prose dark:prose-invert p-8 space-y-4">
            <header className="font-bold prose-2xl">
              {!note || isLoading ? (
                <Skeleton className="h-8 w-3/4 animate-pulse" />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {note.title}
                </ReactMarkdown>
              )}
            </header>

            {note && !isLoading && note.createdAt && (
              <section className="prose dark:prose-invert">
                <p>Created: {formatDate(note.createdAt)}</p>
              </section>
            )}

            {note && !isLoading && note.updatedAt && (
              <section className="prose dark:prose-invert">
                <p>Last updated: {formatDate(note.updatedAt)}</p>
              </section>
            )}

            <section className="py-4">
              {!note || isLoading ? (
                <div className="w-full animate-pulse">
                  <Skeleton className="h-75 w-full my-6" />
                  <div className="flex flex-row items-center justify-center gap-x-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-8 w-3/4" />
                  </div>
                </div>
              ) : (
                <div className="text-left prose dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {previewContent()}
                  </ReactMarkdown>
                </div>
              )}
            </section>

            <section className="border-t border-gray-400 dark:border-gray-400 pt-6">
              <ButtonGroup>
                <LinkButton to="/notes" variant="secondary" size="md">
                  Back
                </LinkButton>

                {/* Only show Edit if note is loaded */}
                {note && !isLoading && (
                  <>
                    <ButtonGroupSeparator />

                    <LinkButton
                      to="/notes/editor/$noteId"
                      params={{ noteId: String(note.id) }}
                      variant="primary"
                      size="md"
                    >
                      Edit
                    </LinkButton>
                  </>
                )}
              </ButtonGroup>
            </section>
          </article>
        </Container>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/notes/viewer/$noteId")({
  beforeLoad: async () => {
    requireAuth();
  },

  head: () =>
    buildHead({
      title: "View Note",
      description:
        "View a single note rendered with Markdown support inside a protected session.",
      path: "/notes/viewer/$noteId",
    }),

  component: NotesViewerPage,
});
