// client/src/components/notes/NoteEditorShell.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { NotesEditor } from "@/components/notes/NotesEditor";
import { NotesPreview } from "@/components/notes/NotesPreview";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileText, Eye, Columns2, PlusCircle } from "lucide-react";

export type NoteDraft = { title: string; content: string };

type NoteEditorShellProps = {
  heading: string;
  subheading?: string;

  draft: NoteDraft;
  setDraft: (next: NoteDraft) => void;

  isNew?: boolean;
  isDirty: boolean;

  onSave: (title: string, content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onBack: () => void;

  quickActionTo?: string; // optional (e.g. "/notes/editor")
};

type ViewMode = "editor" | "preview" | "dual";

const MODE_KEY = "note-manager:editor-mode";
const isViewMode = (v: unknown): v is ViewMode =>
  v === "editor" || v === "preview" || v === "dual";

export function NoteEditorShell({
  heading,
  subheading,
  draft,
  setDraft,
  isNew = false,
  isDirty,
  onSave,
  onDelete,
  onBack,
  quickActionTo,
}: NoteEditorShellProps) {
  const [mode, setMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(MODE_KEY);
    return isViewMode(saved) ? saved : "dual";
  });

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const editor = (
    <NotesEditor
      note={draft}
      isNew={isNew}
      isDirty={isDirty}
      onSave={onSave}
      onDelete={onDelete}
      onBack={onBack}
      onTitleChange={(t) => setDraft({ ...draft, title: t })}
      onContentChange={(c) => setDraft({ ...draft, content: c })}
    />
  );

  const preview = <NotesPreview title={draft.title} content={draft.content} />;

  const dual = useMemo(
    () => (
      <div className="grid h-full gap-4 md:grid-cols-2">
        <div className="h-full min-h-0">{editor}</div>
        <div className="h-full min-h-0">{preview}</div>
      </div>
    ),
    [editor, preview],
  );

  return (
    <PageTransition>
      <Section padding="py-6">
        <Container className="max-w-7xl">
          <div className="flex flex-col gap-6">
            {/* Header row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
              <SlideUp delay={0}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-4xl font-black tracking-tight">
                        {heading}
                      </h1>
                      {subheading && (
                        <p className="text-muted-foreground">{subheading}</p>
                      )}
                    </div>

                    {quickActionTo && (
                      <Link
                        to={quickActionTo}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        <PlusCircle className="h-4 w-4" />
                        New Note
                      </Link>
                    )}
                  </div>
                </div>
              </SlideUp>

              <SlideUp delay={40}>
                <ToggleGroup
                  type="single"
                  value={mode}
                  onValueChange={(v) => {
                    if (v === "editor" || v === "preview" || v === "dual")
                      setMode(v);
                  }}
                  className="justify-start rounded-md border bg-background p-1 shadow-sm"
                >
                  <ToggleGroupItem
                    value="editor"
                    aria-label="Editor"
                    className="rounded-sm px-3"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Editor
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="preview"
                    aria-label="Preview"
                    className="rounded-sm px-3"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="dual"
                    aria-label="Dual"
                    className="rounded-sm px-3"
                  >
                    <Columns2 className="h-4 w-4 mr-2" />
                    Dual
                  </ToggleGroupItem>
                </ToggleGroup>
              </SlideUp>
            </div>

            {/* Content area height + internal scrolling */}
            <div className="flex-1 min-h-[calc(100vh-18rem)] py-8">
              {mode === "dual" ? (
                dual
              ) : (
                <div className="h-full min-h-0">
                  {mode === "editor" ? editor : preview}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}
