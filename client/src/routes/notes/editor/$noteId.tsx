// client/src/routes/notes/editor/$noteId.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { NotesEditor } from "@/components/notes/NotesEditor";
import { NotesPreview } from "@/components/notes/NotesPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlideUp } from "@/components/motion/SlideUp";
import { notesApi } from "@/lib/api";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";

function NoteEditorPage() {
  const navigate = useNavigate();
  const { noteId } = Route.useParams();

  // Fetched once by the route loader
  const loadedNote = Route.useLoaderData();

  const [tab, setTab] = useState("editor");

  // Keep local editable state (so typing doesn't refetch)
  const [note, setNote] = useState(loadedNote);
  const [content, setContent] = useState(loadedNote.content);

  // if title changes in editor, preview should reflect it
  const previewTitle = useMemo(
    () => note?.title ?? loadedNote.title,
    [note, loadedNote.title],
  );

  const handleSave = async (title: string, body: string): Promise<void> => {
    const updated = await notesApi.update(Number(noteId), {
      title,
      content: body,
    });
    setNote(updated);
    setContent(updated.content);
    navigate({ to: "/notes/viewer/$noteId", params: { noteId } });
  };

  const handleDelete = async () => {
    await notesApi.remove(Number(noteId));
    navigate({ to: "/notes" });
  };

  return (
    <PageTransition>
      <Section padding="py-16">
        <Container className="max-w-4xl">
          <div className="mb-8 space-y-2">
            <SlideUp delay={0}>
              <h1 className="text-4xl font-black tracking-tight">Edit Note</h1>
            </SlideUp>
            <SlideUp delay={40}>
              <p className="text-muted-foreground">
                Make changes to your note. Markdown is supported and autosaved
                locally.
              </p>
            </SlideUp>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Tabs
              value={tab}
              onValueChange={setTab}
              className="min-h-[75vh] bg-gray-100 dark:bg-gray-700 w-full rounded border-2 border-gray-100/50 dark:border-gray-700/50"
            >
              <TabsList className="w-full">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent
                value="editor"
                className="w-full mx-auto p-8 text-left prose dark:prose-invert"
              >
                <NotesEditor
                  note={note}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onBack={() =>
                    navigate({
                      to: "/notes/viewer/$noteId",
                      params: { noteId },
                    })
                  }
                  onTitleChange={(t) =>
                    setNote((prev) => (prev ? { ...prev, title: t } : prev))
                  }
                  onContentChange={setContent}
                />
              </TabsContent>

              <TabsContent
                value="preview"
                className="w-full mx-auto p-8 text-left prose dark:prose-invert"
              >
                <NotesPreview title={previewTitle} content={content} />
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/notes/editor/$noteId")({
  beforeLoad: async () => {
    requireAuth();
  },

  loader: async ({ params }) => {
    const idNum = Number(params.noteId);
    if (Number.isNaN(idNum)) {
      throw new Error("Invalid note id");
    }
    return notesApi.getOne(idNum);
  },

  head: ({ loaderData }) =>
    buildHead({
      title: loaderData?.title ?? "Note",
      description:
        "Edit your note with real-time Markdown preview and secure JWT-based authentication.",
      path: `/notes/editor/${loaderData?.id}`,
    }),

  component: NoteEditorPage,
});
