// client/src/routes/notes/editor/$noteId.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { NoteEditorShell } from "@/components/notes/NoteEditorShell";
import { notesApi } from "@/lib/api";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";

function NoteEditorPage() {
  const navigate = useNavigate();
  const { noteId } = Route.useParams();

  // Fetched once by the route loader
  const loadedNote = Route.useLoaderData();

  const DRAFT_KEY = useMemo(
    () => `note-manager:draft:edit-note:${loadedNote.id}`,
    [loadedNote.id],
  );

  type Draft = { title: string; content: string };

  const [draft, setDraft] = useState<Draft>(() => {
    const base: Draft = {
      title: loadedNote.title ?? "",
      content: loadedNote.content ?? "",
    };

    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return base;

    try {
      const saved = JSON.parse(raw) as { title?: string; content?: string };
      return {
        title: saved.title ?? base.title,
        content: saved.content ?? base.content,
      };
    } catch {
      return base;
    }
  });

  // Debounced autosave effect
  useEffect(() => {
    const id = window.setTimeout(() => {
      const reverted =
        draft.title.trim() === (loadedNote.title ?? "").trim() &&
        draft.content.trim() === (loadedNote.content ?? "").trim();

      if (reverted) {
        localStorage.removeItem(DRAFT_KEY);
        return;
      }

      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          title: draft.title,
          content: draft.content,
          savedAt: new Date().toISOString(),
        }),
      );
    }, 300);

    return () => window.clearTimeout(id);
  }, [
    DRAFT_KEY,
    draft.title,
    draft.content,
    loadedNote.title,
    loadedNote.content,
  ]);

  const handleSave = async (title: string, body: string): Promise<void> => {
    const updated = await notesApi.update(Number(noteId), {
      title,
      content: body,
    });

    localStorage.removeItem(DRAFT_KEY);

    setDraft({
      title: updated.title ?? "",
      content: updated.content ?? "",
    });

    navigate({ to: "/notes/viewer/$noteId", params: { noteId } });
  };

  const handleCancel = () => {
    localStorage.removeItem(DRAFT_KEY);
    navigate({ to: "/notes/viewer/$noteId", params: { noteId } });
  };

  const handleDelete = async () => {
    await notesApi.remove(Number(noteId));
    localStorage.removeItem(DRAFT_KEY);
    navigate({ to: "/notes" });
  };

  const isDirty =
    draft.title.trim() !== (loadedNote.title ?? "").trim() ||
    draft.content.trim() !== (loadedNote.content ?? "").trim();

  return (
    <NoteEditorShell
      heading="Edit Note"
      subheading="Make changes to your note. Markdown is supported and autosaved locally."
      draft={draft}
      setDraft={setDraft}
      isDirty={isDirty}
      onSave={handleSave}
      onDelete={handleDelete}
      onBack={handleCancel}
    />
  );
}

export const Route = createFileRoute("/notes/editor/$noteId")({
  beforeLoad: async () => {
    await requireAuth();
  },

  loader: async ({ params }) => {
    const idNum = Number(params.noteId);
    if (Number.isNaN(idNum)) {
      throw new Error("Invalid note id");
    }
    return notesApi.getOne(idNum);
  },

  head: ({ loaderData }) =>
    buildHead({
      title: loaderData?.title ?? "Note",
      description:
        "Edit your note with real-time Markdown preview and secure JWT-based authentication.",
      path: `/notes/editor/${loaderData?.id}`,
    }),

  component: NoteEditorPage,
});
