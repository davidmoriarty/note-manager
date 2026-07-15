// client/src/components/notes/NoteEditorShell.tsx

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlideUp } from "@/components/motion/SlideUp";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { NotesEditor } from "@/components/notes/NotesEditor";
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

export type ViewMode = "editor" | "preview" | "dual";

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
  const [mode, setMode] = useState<ViewMode>("editor");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 48rem)");

    const handleViewportChange = () => {
      if (!mediaQuery.matches) {
        setMode((currentMode) =>
          currentMode === "dual" ? "editor" : currentMode,
        );
      }
    };

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  return (
    <PageTransition>
      <Section padding="pt-8 pb-2">
        <Container padding="px-4 md:px-6 lg:px-8" className="max-w-7xl">
          {/* Header row */}
          <div className="flex flex-col gap-8 md:flex-row md:items-baseline md:justify-between">
            <SlideUp delay={0}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
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
            </SlideUp>

            <SlideUp delay={40} className="w-full md:w-auto">
              <ToggleGroup
                type="single"
                value={mode}
                onValueChange={(v) => {
                  if (v === "editor" || v === "preview" || v === "dual")
                    setMode(v);
                }}
                className="grid w-full grid-cols-2 rounded-md border bg-background p-1 shadow-sm md:flex md:w-auto"
              >
                <ToggleGroupItem
                  value="editor"
                  aria-label="Editor"
                  className="h-10 w-full rounded-sm px-2 md:w-auto md:px-3"
                >
                  <FileText className="mr-2 size-4" />
                  Editor
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="preview"
                  aria-label="Preview"
                  className="h-10 w-full rounded-sm px-2 md:w-auto md:px-3"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dual"
                  aria-label="Dual"
                  className="hidden h-10 w-full rounded-sm px-2 md:inline-flex md:w-auto md:px-3"
                >
                  <Columns2 className="mr-2 size-4" />
                  Dual
                </ToggleGroupItem>
              </ToggleGroup>
            </SlideUp>
          </div>
        </Container>
      </Section>

      <Section padding="pt-4 md:pt-8">
        <Container padding="px-4 md:px-6 lg:px-8 pb-6" className="max-w-7xl">
          {/* Content area height + internal scrolling */}
          <div className="h-full min-h-0 py-2 md:py-8">
            <NotesEditor
              mode={mode}
              note={draft}
              isNew={isNew}
              isDirty={isDirty}
              onSave={onSave}
              onDelete={onDelete}
              onBack={onBack}
              onTitleChange={(title) => setDraft({ ...draft, title })}
              onContentChange={(content) => setDraft({ ...draft, content })}
            />
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}
