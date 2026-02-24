// client/src/routes/notes/editor/index.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
      <Section padding="py-16">
        <Container className="max-w-4xl">
          <div className="mb-8 space-y-2">
            <SlideUp delay={0}>
              <h1 className="text-4xl font-black tracking-tight">
                Create Note
              </h1>
            </SlideUp>
            <SlideUp delay={40}>
              <p className="text-muted-foreground">
                Draft your thoughts. Markdown is supported and autosaved
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

              <TabsContent
                value="preview"
                className="w-full mx-auto p-8 text-left prose dark:prose-invert"
              >
                <NotesPreview title={title} content={content} />
              </TabsContent>
            </Tabs>
          </div>
        </Container>
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
