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
import { Badge } from "@/components/ui/badge";
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
      <NotesViewerHeader />

      <Section padding="pt-4 pb-8">
        <Container padding="px-4 md:px-6 lg:px-8" className="max-w-7xl">
          <article
            className="
              mx-auto w-full max-w-4xl rounded-lg border border-gray-300 p-5 shadow sm:p-8 dark:border-gray-600"
          >
            <Skeleton className="h-8 w-2/3 animate-pulse" />

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-36" />
            </div>

            <div className="mt-2 flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            <div className="py-4">
              <Skeleton className="h-75 w-full animate-pulse" />
            </div>
          </article>

          <div className="mx-auto w-full max-w-4xl">
            <ButtonGroup className="mt-6">
              <LinkButton to="/notes" variant="secondary" size="md">
                Back
              </LinkButton>
            </ButtonGroup>
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}

function NotesViewerPage() {
  const note = Route.useLoaderData();

  return (
    <PageTransition>
      <NotesViewerHeader />

      <Section padding="pt-4 pb-8">
        <Container padding="px-4 md:px-6 lg:px-8" className="max-w-7xl">
          <article className="mx-auto w-full max-w-4xl rounded-lg border border-gray-300 p-5 shadow sm:p-8 dark:border-gray-600">
            <header className="text-2xl font-bold tracking-tight sm:text-3xl">
              {note.title}
            </header>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>Created {formatDate(note.createdAt)}</span>
              <span>Updated {formatDate(note.updatedAt)}</span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <Badge variant="outline">Markdown</Badge>
              <Badge variant="outline">
                {note.published ? "Published" : "Private"}
              </Badge>
            </div>

            <section className="py-4">
              <MarkdownRenderer
                content={note.content}
                className="[&_.prose_pre+pre]:mt-4"
              />
            </section>
          </article>

          <ButtonGroup className="mt-6">
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
        </Container>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/notes/viewer/$noteId")({
  beforeLoad: async () => {
    await requireAuth();
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

function NotesViewerHeader() {
  return (
    <Section padding="py-8">
      <Container padding="px-4 md:px-6 lg:px-8" className="max-w-7xl">
        <div className="space-y-2">
          <SlideUp delay={0}>
            <h1 className="text-4xl font-black tracking-tight">Note View</h1>
          </SlideUp>

          <SlideUp delay={40}>
            <p className="text-muted-foreground">
              See the full content of your note. If you want to edit it, click
              the edit button.
            </p>
          </SlideUp>
        </div>
      </Container>
    </Section>
  );
}
