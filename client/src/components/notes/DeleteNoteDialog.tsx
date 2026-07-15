// client/src/components/notes/DeleteNoteDialog.tsx
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteNoteDialogProps {
  noteId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: number) => void;
  iconOnly?: boolean;
}

export function DeleteNoteDialog({
  noteId,
  open,
  onOpenChange,
  onDelete,
  iconOnly = false,
}: DeleteNoteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onOpenChange(true)}
          aria-label="Delete note"
        >
          {iconOnly ? <Trash2 className="size-4" /> : "Delete"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            note.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onDelete(noteId)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
