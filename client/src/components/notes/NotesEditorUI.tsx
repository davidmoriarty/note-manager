// client/src/routes/notes/editor/NotesEditorUI.tsx
import {
  CaseSensitiveIcon,
  Heading1Icon,
  Tally1Icon,
  TextInitialIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Note } from "@/lib/api";
import { toastMessage } from "../ui/toast";

interface NotesEditorUIProps {
  note?: Note | null;
  isNew?: boolean;
  onSave?: (title: string, content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onBack?: () => void;
}

export function NotesEditorUI({
  note,
  isNew = false,
  onSave,
  onDelete,
  onBack,
}: NotesEditorUIProps) {
  const [title, setTitle] = useState(note?.title || "Untitled Note");
  const [content, setContent] = useState(note?.content || "");
  const [outputFormat, setOutputFormat] = useState<"markdown" | "plaintext">(
    "markdown",
  );
  const [isEditing, setIsEditing] = useState(true);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [originalContent, setOriginalContent] = useState(content);

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize from note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setOriginalTitle(note.title);
      setOriginalContent(note.content);
    }
  }, [note]);

  // Helper to strip hidden RTL characters
  const stripRTL = (str: string) =>
    str.replace(/[\u202A-\u202E\u2066-\u2069]/g, "");

  const hasUnsavedChanges =
    title !== originalTitle || content !== originalContent;

  const handleSaveClick = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      if (onSave) await onSave(title, content);
      setOriginalTitle(title);
      setOriginalContent(content);
      setIsEditing(false);
      toastMessage("success", isNew ? "Note created!" : "Note updated!");
    } catch (err) {
      console.error(err);
      toastMessage("error", "Failed to save note.");
    }
  };

  const handleDeleteClick = async () => {
    if (!onDelete) return;
    try {
      await onDelete();
      toastMessage("success", "Note deleted!");
    } catch {
      toastMessage("error", "Failed to delete note.");
    }
  };

  const wordCount = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content],
  );

  return (
    <section className="h-screen w-full flex flex-col items-center justify-center p-4">
      <Card className="min-h-3/4 w-full max-w-5xl mx-auto">
        {/* Header: Title + Format Select */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle>
            <input
              ref={titleInputRef}
              placeholder="Untitled Note"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="outline-none border rounded p-2 w-full min-w-30"
              onFocus={() => {
                if (isNew && title === "Untitled Note") setTitle("");
              }}
            />
          </CardTitle>
          <Select
            value={outputFormat}
            onValueChange={(v) =>
              setOutputFormat(v as "markdown" | "plaintext")
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="plaintext">Plaintext</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        {/* Editor + Preview */}
        <CardContent className="flex flex-col lg:flex-row gap-4">
          <textarea
            value={content}
            onChange={(e) => setContent(stripRTL(e.target.value))}
            onPaste={(e) => {
              // optional: keep default paste; if you still want plain-text-only behavior:
              e.preventDefault();
              const text = e.clipboardData.getData("text/plain");
              const target = e.currentTarget;
              const start = target.selectionStart ?? 0;
              const end = target.selectionEnd ?? 0;
              const next = `${content.slice(0, start)}${text}${content.slice(end)}`;
              setContent(stripRTL(next));
              requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd =
                  start + text.length;
              });
            }}
            placeholder="Note content goes here..."
            className="border rounded p-4 w-full min-h-[60vh] overflow-auto text-sm resize-none"
            disabled={!isEditing}
            aria-label="Note content editor"
          />
          <div className="border rounded p-4 w-full min-h-[60vh] overflow-auto text-sm">
            {outputFormat === "markdown" ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            ) : (
              <pre className="whitespace-pre-wrap font-mono">{content}</pre>
            )}
          </div>
        </CardContent>

        {/* Footer: Buttons + Stats */}
        <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
          <div className="flex gap-2">
            <Button
              onClick={handleSaveClick}
              variant="sky"
              disabled={!hasUnsavedChanges}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>

            {!isNew && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteClick}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onBack?.()}
            >
              Back
            </Button>
          </div>

          <Breadcrumb>
            <BreadcrumbList className="text-sm flex flex-row items-center justify-end">
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <div className="flex items-center justify-center gap-x-2">
                    <Heading1Icon />
                    {title || "Untitled Note"}
                  </div>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Tally1Icon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <div className="flex items-center justify-center gap-x-2">
                    <TextInitialIcon />
                    {outputFormat}
                  </div>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Tally1Icon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <div className="flex items-center justify-center gap-x-2">
                    <CaseSensitiveIcon />
                    {wordCount}
                  </div>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardFooter>
      </Card>
    </section>
  );
}
