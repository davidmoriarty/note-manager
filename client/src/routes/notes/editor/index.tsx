// client/src/routes/notes/editor/index.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { PageTransition } from "@/components/motion/PageTransition";
import { NotesEditor } from "@/components/notes/NotesEditor";
import { NotesPreview } from "@/components/notes/NotesPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notesApi } from "@/lib/api";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";

function NewNotePage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("editor");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = async (title: string, content: string) => {
    await notesApi.create({ title, content });
    navigate({ to: "/notes" });
  };

  return (
    <PageTransition>
      <Section centered className="max-w-7xl mx-auto min-h-[85vh] p-8">
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="min-h-[65vh] bg-gray-200 dark:bg-gray-700 w-full rounded px-12 pt-8 space-y-4"
        >
          <TabsList className="w-full">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <NotesEditor
              isNew
              onSave={handleSave}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onBack={() =>
                navigate({
                  to: "/notes",
                })
              }
            />
          </TabsContent>

          <TabsContent value="preview">
            <NotesPreview title={title} content={content} />
          </TabsContent>
        </Tabs>
      </Section>
    </PageTransition>
  );
}

export const Route = createFileRoute("/notes/editor/")({
  beforeLoad: async () => {
    requireAuth();
  },

  head: () =>
    buildHead({
      title: "New Note",
      description:
        "Edit your note with real-time Markdown preview and secure token-based authentication.",
      path: "/notes/editor",
    }),

  component: NewNotePage,
});
