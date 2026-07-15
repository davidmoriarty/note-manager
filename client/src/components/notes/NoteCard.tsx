// client/src/components/notes/NoteCard.tsx
import { Eye } from "lucide-react";
import type { NoteDto } from "@shared";
import { useNavigate } from "@tanstack/react-router";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { notePreviewText } from "@/lib/note-preview";

type NoteCardProps = {
  note: NoteDto;
  noteToDelete: number | null;
  setNoteToDelete: (id: number | null) => void;
  onDelete: (id: number) => Promise<void>;
};

const formatDate = (ts: string | Date) =>
  new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function NoteCard({
  note,
  noteToDelete,
  setNoteToDelete,
  onDelete,
}: NoteCardProps) {
  const navigate = useNavigate();

  const preview = notePreviewText(note.content || "", {
    maxChars: 220,
    codeLines: 3,
  });

  return (
    <Card className="flex flex-col pt-4">
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg font-semibold leading-snug">
          {note.title || "Untitled Note"}
        </CardTitle>

        {note.createdAt && (
          <CardDescription className="text-sm text-muted-foreground">
            Created {formatDate(note.createdAt)}
          </CardDescription>
        )}

        <CardAction>
          <ButtonGroup>
            <Button
              variant="primary"
              size="icon-sm"
              aria-label={`View ${note.title || "note"}`}
              onClick={() =>
                navigate({
                  to: "/notes/viewer/$noteId",
                  params: { noteId: String(note.id) },
                })
              }
            >
              <Eye className="size-4" />
            </Button>

            <ButtonGroupSeparator />

            <DeleteNoteDialog
              noteId={note.id}
              open={noteToDelete === note.id}
              onOpenChange={(open) => setNoteToDelete(open ? note.id : null)}
              onDelete={onDelete}
              iconOnly
            />
          </ButtonGroup>
        </CardAction>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground">
        <p className="line-clamp-4 whitespace-pre-wrap wrap-break-word font-mono text-xs leading-relaxed sm:line-clamp-5 lg:line-clamp-6">
          {preview}
        </p>
      </CardContent>
    </Card>
  );
}
