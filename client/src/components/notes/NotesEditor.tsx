// client/src/components/notes/NotesEditor.tsx

import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import * as z from "zod";
import { toastMessage } from "@/components/ui/toast";
import { NotesPreview } from "@/components/notes/NotesPreview";
import type { ViewMode } from "@/components/notes/note-editor-types";
import { NoteEditorActions } from "@/components/notes/NoteEditorActions";
import { NoteEditorFields } from "@/components/notes/NoteEditorFields";

type NotesEditorProps = {
  note?: { title?: string; content?: string } | null;
  mode: ViewMode;
  isNew?: boolean;
  onSave: (title: string, content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
  onBack?: () => void;
  isDirty?: boolean;
};

const MAX_CHARS = 2000;

const noteFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required").max(MAX_CHARS),
});

export function NotesEditor({
  note,
  mode,
  isNew = false,
  onSave,
  onDelete,
  onTitleChange,
  onContentChange,
  onBack,
  isDirty = false,
}: NotesEditorProps) {
  const form = useForm({
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
    },
    validators: {
      onSubmit: noteFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await onSave(value.title, value.content);
        form.reset(value);
        toastMessage("success", isNew ? "Note Created!" : "Note updated!");
      } catch (_err) {
        toastMessage(
          "error",
          isNew ? "Failed to save note" : "Failed to update note",
        );
      }
    },
  });

  useEffect(() => {
    form.reset({
      title: note?.title || "",
      content: note?.content || "",
    });
  }, [form, note?.title, note?.content]);

  return (
    <form
      id="note-editor-form"
      className="flex h-full flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="title">
        {(titleField) => (
          <form.Field name="content">
            {(contentField) => {
              const isTitleInvalid =
                !titleField.state.meta.isValid &&
                titleField.state.meta.isTouched;

              const isContentInvalid =
                !contentField.state.meta.isValid &&
                contentField.state.meta.isTouched;

              const fields = (
                <NoteEditorFields
                  title={titleField.state.value}
                  content={contentField.state.value}
                  titleErrors={titleField.state.meta.errors}
                  contentErrors={contentField.state.meta.errors}
                  isTitleInvalid={isTitleInvalid}
                  isContentInvalid={isContentInvalid}
                  isDirty={isDirty}
                  maxChars={MAX_CHARS}
                  onTitleBlur={titleField.handleBlur}
                  onContentBlur={contentField.handleBlur}
                  onTitleChange={(value) => {
                    titleField.handleChange(value);
                    onTitleChange?.(value);
                  }}
                  onContentChange={(value) => {
                    contentField.handleChange(value);
                    onContentChange?.(value);
                  }}
                />
              );

              const preview = (
                <NotesPreview
                  title={titleField.state.value}
                  content={contentField.state.value}
                />
              );

              if (mode === "dual") {
                return (
                  <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
                    <div className="min-h-[50vh]">{fields}</div>
                    <div className="min-h-[50vh]">{preview}</div>
                  </div>
                );
              }

              return (
                <div className="min-h-0 flex-1">
                  {mode === "editor" ? fields : preview}
                </div>
              );
            }}
          </form.Field>
        )}
      </form.Field>

      <NoteEditorActions isNew={isNew} onBack={onBack} onDelete={onDelete} />
    </form>
  );
}
