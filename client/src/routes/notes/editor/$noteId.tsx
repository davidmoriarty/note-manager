// client/src/routes/notes/editor/$noteId.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageTransition } from "@/components/motion/PageTransition";
import { NotesEditor } from "@/components/notes/NotesEditor";
import { NotesPreview } from "@/components/notes/NotesPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notesApi } from "@/lib/api";
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
    <PageTransition className="h-screen p-0">
      <Section centered className="h-274 p-0">
        <Container className="h-200 p-8">
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="bg-gray-50 rounded border min-h-full w-full mx-auto p-8 space-y-4"
          >
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
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

            <TabsContent value="preview">
              <NotesPreview title={previewTitle} content={content} />
            </TabsContent>
          </Tabs>
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

  head: ({ loaderData }) => ({
    meta: [
      {
        name: "title",
        content: `Edit: ${loaderData?.title || "Untitled Note"} | Note Manager`,
      },
      {
        name: "description",
        content:
          "Edit your note with real-time Markdown preview and secure JWT-based authentication.",
      },
    ],
  }),

  component: NoteEditorPage,
});
