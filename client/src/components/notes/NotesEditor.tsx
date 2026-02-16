// @/components/notes/NotesEditor.tsx
import { useForm } from "@tanstack/react-form";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";

type NotesEditorProps = {
  note?: { title?: string; content?: string } | null;
  isNew?: boolean;
  onSave: (title: string, content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
  onBack?: () => void;
};

const noteFormSchema = z.object({
  title: z.string().nonempty("Title cannot be empty"),
  content: z.string().nonempty("Content cannot be empty"),
});

export function NotesEditor({
  note,
  isNew = false,
  onSave,
  onDelete,
  onTitleChange,
  onContentChange,
  onBack,
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
        toastMessage("success", isNew ? "Note Created!" : "Note updated!");
      } catch (_err) {
        toastMessage(
          "error",
          isNew ? "Failed to save note" : "Failed to update note",
        );
      }
    },
  });

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
                  className="bg-white dark:bg-gray-300"
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
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Note Content</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      onContentChange?.(e.target.value);
                    }}
                    rows={40}
                    placeholder="Note..."
                    className="bg-white dark:bg-gray-300 min-h-[30ch] border rounded resize-none"
                    aria-invalid={isInvalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.state.value.length}/100 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <FieldGroup className="pt-8">
        <Field orientation="horizontal">
          <Button type="submit" variant="sky" size="md">
            Save
          </Button>

          {!isNew && onDelete && (
            <Button
              type="button"
              variant="destructive"
              size="md"
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

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => onBack?.()}
          >
            Back
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
