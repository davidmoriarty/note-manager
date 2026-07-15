// client/src/components/notes/NoteEditorFields.tsx

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { toastMessage } from "@/components/ui/toast";

type FieldValidationError = {
  message?: string;
};

type NoteEditorFieldsProps = {
  title: string;
  content: string;
  titleErrors: Array<FieldValidationError | undefined>;
  contentErrors: Array<FieldValidationError | undefined>;
  isTitleInvalid: boolean;
  isContentInvalid: boolean;
  isDirty: boolean;
  maxChars: number;
  onTitleBlur: () => void;
  onContentBlur: () => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
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

export function NoteEditorFields({
  title,
  content,
  titleErrors,
  contentErrors,
  isTitleInvalid,
  isContentInvalid,
  isDirty,
  maxChars,
  onTitleBlur,
  onContentBlur,
  onTitleChange,
  onContentChange,
}: NoteEditorFieldsProps) {
  const charCount = content.length;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <FieldGroup className="min-h-0 flex-1">
      <Field data-invalid={isTitleInvalid}>
        <FieldLabel htmlFor="title" className="sr-only">
          Note Title
        </FieldLabel>

        <Input
          id="title"
          name="title"
          value={title}
          onBlur={onTitleBlur}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Note title"
          aria-invalid={isTitleInvalid}
          autoComplete="off"
          className="bg-gray-50 placeholder:text-base placeholder:italic placeholder:text-muted-foreground dark:bg-gray-600"
        />

        {isTitleInvalid && <FieldError errors={titleErrors} />}
      </Field>

      <Field
        data-invalid={isContentInvalid}
        className="flex min-h-[25vh] flex-1 flex-col md:min-h-[40vh]"
      >
        <FieldLabel htmlFor="content" className="sr-only">
          Note Content
        </FieldLabel>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => void handleCopy(content)}
            disabled={!content}
            aria-label="Copy note content to clipboard"
            className="absolute top-2 right-2 z-10"
          >
            <Copy className="size-4" />
          </Button>

          <InputGroup className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-white focus-within:ring-2 focus-within:ring-primary/20 dark:bg-gray-600">
            <InputGroupTextarea
              id="content"
              name="content"
              value={content}
              onBlur={onContentBlur}
              onChange={(event) => onContentChange(event.target.value)}
              className="min-h-0 flex-1 resize-none rounded border bg-gray-50 pr-12 text-base placeholder:text-base placeholder:italic placeholder:text-muted-foreground dark:bg-gray-600"
              placeholder="Write your note..."
              aria-invalid={isContentInvalid}
            />

            <div className="flex w-full flex-wrap items-center justify-between rounded-b-md border border-t-0 bg-gray-200 px-3 py-1.5 font-medium text-[10px] text-muted-foreground uppercase tracking-wider tabular-nums dark:bg-gray-700">
              <div className="flex items-center gap-4">
                <span className="hidden md:inline-block">Markdown Mode</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 animate-pulse rounded-full ${
                      isDirty ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  />

                  {isDirty ? "Unsaved Changes" : "Synced"}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="hidden md:inline">UTF-8</span>
                <span>Words: {wordCount}</span>
                <span>
                  Chars: {charCount} / {maxChars}
                </span>
              </div>
            </div>
          </InputGroup>

          {isContentInvalid && <FieldError errors={contentErrors} />}
        </div>
      </Field>
    </FieldGroup>
  );
}
