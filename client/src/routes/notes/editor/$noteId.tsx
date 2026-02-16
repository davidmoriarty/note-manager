// client/src/routes/notes/editor/$noteId.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageTransition } from "@/components/motion/PageTransition";
import { NotesEditor } from "@/components/notes/NotesEditor";
import { NotesPreview } from "@/components/notes/NotesPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Note, notesApi } from "@/lib/api";
import { requireAuth } from "@/lib/route-guard";

function NoteEditorPage() {
  const navigate = useNavigate();
  const { noteId } = Route.useParams();

  const [tab, setTab] = useState("editor");
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState("");

  // Fetch note
  useEffect(() => {
    const idNum = Number(noteId);
    if (!noteId || Number.isNaN(idNum)) return;

    notesApi.getOne(idNum).then((fetched) => {
      if (!fetched) return;
      setNote(fetched);
      setContent(fetched.content);
    });
  }, [noteId]);

  const handleSave = async (title: string, content: string): Promise<void> => {
    if (!noteId) return;

    const updated = await notesApi.update(Number(noteId), { title, content });
    setNote(updated);
    setContent(updated.content);

    // Navigate to viewer page after saving
    navigate({ to: `/notes/viewer/${noteId}` });
  };

  const handleDelete = async () => {
    if (!noteId) return;
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
                  setNote((prev) => prev && { ...prev, title: t })
                }
                onContentChange={setContent}
              />
            </TabsContent>

            <TabsContent value="preview">
              <NotesPreview title={note?.title} content={content} />
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
  component: NoteEditorPage,
});
