// client/src/components/notes/NoteCard.tsx
import type { NoteDto } from "@shared";
import { useNavigate } from "@tanstack/react-router";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
    <Card className="flex h-full flex-col justify-between pt-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold leading-snug line-clamp-2">
          {note.title || "Untitled Note"}
        </CardTitle>
        {note.createdAt && (
          <CardDescription className="text-sm text-muted-foreground">
            {formatDate(note.createdAt)}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground min-h-27.5">
        <p className="line-clamp-6 whitespace-pre-wrap wrap-break-word font-mono text-xs leading-relaxed">
          {preview}
        </p>
      </CardContent>

      <CardFooter>
        <CardAction>
          <ButtonGroup>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                navigate({
                  to: "/notes/viewer/$noteId",
                  params: { noteId: String(note.id) },
                })
              }
            >
              View
            </Button>

            <ButtonGroupSeparator />

            <DeleteNoteDialog
              noteId={note.id}
              open={noteToDelete === note.id}
              onOpenChange={(open) => setNoteToDelete(open ? note.id : null)}
              onDelete={onDelete}
            />
          </ButtonGroup>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
