// client/src/components/notes/NoteEditorShell.tsx
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { NotesEditor } from "@/components/notes/NotesEditor";
import { NotesPreview } from "@/components/notes/NotesPreview";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
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
  const [mode, setMode] = useState<ViewMode>("dual");

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

  return (
    <PageTransition className="min-h-screen">
      <Section padding="py-8">
        <Container className="max-w-6xl">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <SlideUp delay={0}>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  {/* Left: Heading */}
                  <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                      {heading}
                    </h1>
                    {subheading && (
                      <p className="text-muted-foreground text-sm md:text-base">
                        {subheading}
                      </p>
                    )}
                  </div>

                  {/* Right: Controls */}
                  <div className="flex flex-col items-start md:items-end gap-3">
                    <ToggleGroup
                      type="single"
                      value={mode}
                      onValueChange={(v) => {
                        if (v === "editor" || v === "preview" || v === "dual")
                          setMode(v);
                      }}
                      className="justify-start md:justify-end"
                    >
                      <ToggleGroupItem value="editor">
                        <FileText className="h-4 w-4 mr-2" />
                        Editor
                      </ToggleGroupItem>
                      <ToggleGroupItem value="preview">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </ToggleGroupItem>
                      <ToggleGroupItem value="dual">
                        <Columns2 className="h-4 w-4 mr-2" />
                        Dual
                      </ToggleGroupItem>
                    </ToggleGroup>

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
            </div>

            {/* Content */}
            {mode === "dual" ? (
              <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
                <div className="min-h-0 h-full">{editor}</div>
                <div className="min-h-0 h-full">{preview}</div>
              </div>
            ) : (
              <div className="min-h-0">
                {mode === "editor" ? editor : preview}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}
