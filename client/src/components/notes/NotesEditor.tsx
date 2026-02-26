// @/components/notes/NotesEditor.tsx
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toastMessage } from "@/components/ui/toast";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";

type NotesEditorProps = {
  note?: { title?: string; content?: string } | null;
  isNew?: boolean;
  onSave: (title: string, content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
  onBack?: () => void;
  isDirty?: boolean;
};

const handleCopy = async (text: string) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    toastMessage("success", "Copied to clipboard!");
  } catch {
    toastMessage("error", "Failed to copy to clipboard!");
  }
};

const MAX_CHARS = 2000;

const noteFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required").max(MAX_CHARS),
});

export function NotesEditor({
  note,
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
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="title">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid && field.state.meta.isTouched;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Note Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    onTitleChange?.(e.target.value);
                  }}
                  placeholder="Untitled Note"
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  className="bg-gray-50 dark:bg-gray-600 placeholder:text-muted-foreground placeholder:text-base placeholder:italic"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="content">
          {(field) => {
            const isInvalid =
              !field.state.meta.isValid && field.state.meta.isTouched;
            const charCount = field.state.value.length;
            const wordCount = field.state.value
              .trim()
              .split(/\s+/)
              .filter(Boolean).length;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center justify-between"
                >
                  <span>Note Content</span>
                  {/* COPY BUTTON */}
                  <button
                    type="button"
                    onClick={() => void handleCopy(field.state.value)}
                    disabled={!field.state.value}
                    aria-label="Copy note content to clipboard"
                    className="flex items-center gap-1 hover:text-primary transition-colors uppercase disabled:opacity-50 disabled:hover:text-inherit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    Copy
                  </button>
                </FieldLabel>
                <InputGroup className="h-full flex flex-col border rounded-md overflow-hidden bg-white dark:bg-gray-600 focus-within:ring-2 focus-within:ring-primary/20">
                  <InputGroupTextarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      onContentChange?.(e.target.value);
                    }}
                    className="flex-1 bg-gray-50 dark:bg-gray-600 text-base border rounded resize-none placeholder:text-muted-foreground placeholder:text-base placeholder:italic"
                    placeholder="Untitled note content"
                    aria-invalid={isInvalid}
                  />

                  {/* THE INFO PANEL / STATUS BAR */}
                  <div className="w-full flex flex-wrap items-center justify-between px-3 py-1.5 bg-gray-200 dark:bg-gray-700 border border-t-0 rounded-b-md text-[10px] uppercase tracking-wider font-medium text-muted-foreground tabular-nums">
                    <div className="flex gap-4 items-center">
                      <span className="hidden md:inline-block">
                        Markdown Mode
                      </span>
                      {/* STATUS INDICATOR */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full animate-pulse ${isDirty ? "bg-amber-500" : "bg-emerald-500"}`}
                        />
                        {isDirty ? "Unsaved Changes" : "Synced"}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden md:inline">UTF-8</span>
                      <span>Words: {wordCount}</span>
                      <span>
                        Chars: {charCount} / {MAX_CHARS}
                      </span>
                    </div>
                  </div>
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <FieldGroup className="pt-8">
        <Field orientation="horizontal">
          <Button type="submit" variant="primary" size="sm">
            {isNew ? "Create Note" : "Save Changes"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onBack?.()}
          >
            Cancel
          </Button>

          {!isNew && onDelete && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={async () => {
                try {
                  await onDelete();
                  toastMessage("success", "Note deleted!");
                } catch {
                  toastMessage("error", "Failed to delete note.");
                }
              }}
            >
              Delete
            </Button>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
