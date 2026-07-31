// client/src/components/notes/NoteEditorActions.tsx

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";

type NoteEditorActionsProps = {
  isNew: boolean;
  onBack?: () => void;
  onDelete?: () => Promise<void>;
};

export function NoteEditorActions({
  isNew,
  onBack,
  onDelete,
}: NoteEditorActionsProps) {
  return (
    <FieldGroup className="shrink-0 pt-6">
      <Field orientation="horizontal">
        <Button type="submit" variant="primary" size="sm">
          {isNew ? "Create Note" : "Save Changes"}
        </Button>

        <Button type="button" variant="secondary" size="sm" onClick={onBack}>
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
                toast.success("Note deleted");
              } catch {
                toast.error("Failed to delete note.");
              }
            }}
          >
            Delete
          </Button>
        )}
      </Field>
    </FieldGroup>
  );
}
