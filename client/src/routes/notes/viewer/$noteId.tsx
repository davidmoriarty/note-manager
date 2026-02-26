// client/src/routes/notes/viewer/$noteId.tsx
import { createFileRoute, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ErrorPage } from "@/components/error/ErrorPage";
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
              <Skeleton className="h-8 w-3/4 animate-pulse" />
            </header>

            <section className="py-4">
              <div className="w-full animate-pulse">
                <Skeleton className="h-75 w-full my-6" />
              </div>
            </section>

            <section className="border-t border-gray-400 dark:border-gray-400 pt-6">
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {note.title}
              </ReactMarkdown>
            </header>

            <section className="prose dark:prose-invert">
              <p>Created: {formatDate(note.createdAt)}</p>
              <p>Last updated: {formatDate(note.updatedAt)}</p>
            </section>

            <section className="py-4">
              <div className="text-left prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {note.content || "No content available"}
                </ReactMarkdown>
              </div>
            </section>

            <section className="border-t border-gray-400 dark:border-gray-400 pt-6">
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
