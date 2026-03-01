// client/src/routes/notes/viewer/$noteId.tsx
import { createFileRoute, notFound } from "@tanstack/react-router";
import { MarkdownRenderer } from "@/components/notes/MarkdownRenderer";
import { ErrorPage } from "@/components/error/ErrorPage";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { LinkButton } from "@/components/ui/LinkButton";
import { notesApi } from "@/lib/api";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";

const formatDate = (ts: string | Date) =>
  new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function NotesViewerSkeleton() {
  return (
    <PageTransition>
      <Section>
        <Container className="max-w-4xl">
          <div className="space-y-2 py-6 mb-2">
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

          <article
            className="
              max-w-4xl mx-auto
              border border-gray-300 dark:border-gray-600 rounded
              prose dark:prose-invert p-4 pb-0 space-y-4
            "
          >
            <header className="font-bold prose-2xl">
              <Skeleton className="h-8 w-3/4 animate-pulse" />
            </header>

            <section className="py-4">
              <div className="w-full animate-pulse">
                <Skeleton className="h-75 w-full my-6" />
              </div>
            </section>

            <section className="pb-6 mt-4">
              <ButtonGroup>
                <LinkButton to="/notes" variant="secondary" size="md">
                  Back
                </LinkButton>
              </ButtonGroup>
            </section>
          </article>
        </Container>
      </Section>
    </PageTransition>
  );
}

function NotesViewerPage() {
  const note = Route.useLoaderData();

  return (
    <PageTransition>
      <Section>
        <Container className="max-w-4xl">
          <div className="space-y-2 py-6 mb-2">
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

          <article
            className="
              max-w-4xl mx-auto
              border border-gray-300 dark:border-gray-600 rounded
              prose dark:prose-invert p-4 pb-0 space-y-4
            "
          >
            <header className="font-bold prose-2xl">{note.title}</header>

            <section className="prose dark:prose-invert">
              <p>Created: {formatDate(note.createdAt)}</p>
              <p>Last updated: {formatDate(note.updatedAt)}</p>
            </section>

            <section className="py-4">
              <MarkdownRenderer
                content={note.content || "No content available"}
                className="[&_.prose_pre+pre]:mt-4"
              />
            </section>
          </article>

          <section className="pb-6 mt-4">
            <ButtonGroup>
              <LinkButton to="/notes" variant="secondary" size="md">
                Back
              </LinkButton>

              <ButtonGroupSeparator />

              <LinkButton
                to="/notes/editor/$noteId"
                params={{ noteId: String(note.id) }}
                variant="primary"
                size="md"
              >
                Edit
              </LinkButton>
            </ButtonGroup>
          </section>
        </Container>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/notes/viewer/$noteId")({
  beforeLoad: async () => {
    requireAuth();
  },

  loader: async ({ params }) => {
    const idNum = Number(params.noteId);
    if (Number.isNaN(idNum)) throw notFound();

    try {
      return await notesApi.getOne(idNum);
    } catch (err) {
      // If the API returned 404 → treat as notFound
      const msg = err instanceof Error ? err.message : "";

      if (msg.includes("404") || msg.toLowerCase().includes("not found")) {
        throw notFound();
      }

      // Otherwise let it bubble (500, network, etc.)
      throw err;
    }
  },

  pendingComponent: NotesViewerSkeleton,
  notFoundComponent: () => <ErrorPage status={404} />,

  head: ({ loaderData }) =>
    buildHead({
      title: loaderData?.title ?? "View Note",
      description:
        "View a single note rendered with Markdown support inside a protected session.",
      path: `/notes/viewer/${loaderData?.id ?? ""}`,
    }),

  component: NotesViewerPage,
});
