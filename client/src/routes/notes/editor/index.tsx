// client/src/routes/notes/editor/index.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NoteEditorShell } from "@/components/notes/NoteEditorShell";
import { notesApi } from "@/lib/api";
import { buildHead } from "@/lib/meta";
import { requireAuth } from "@/lib/route-guard";

function NewNotePage() {
  const navigate = useNavigate();

  const DRAFT_KEY = "note-manager:draft:new-note";

  const [title, setTitle] = useState(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return "";
    try {
      const saved = JSON.parse(raw) as { title?: string };
      return saved.title ?? "";
    } catch {
      return "";
    }
  });

  const [content, setContent] = useState(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return "";
    try {
      const saved = JSON.parse(raw) as { content?: string };
      return saved.content ?? "";
    } catch {
      return "";
    }
  });

  const isDirty = title.trim().length > 0 || content.trim().length > 0;

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!title.trim() && !content.trim()) {
        localStorage.removeItem(DRAFT_KEY);
        return;
      }

      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, content, savedAt: new Date().toISOString() }),
      );
    }, 300);

    return () => window.clearTimeout(id);
  }, [title, content]);

  const handleSave = async (title: string, content: string) => {
    await notesApi.create({ title, content });
    localStorage.removeItem(DRAFT_KEY);
    navigate({ to: "/notes" });
  };

  return (
    <NoteEditorShell
      heading="Create Note"
      subheading="Draft your thoughts. Markdown is supported and autosaved locally."
      isNew
      draft={{ title, content }}
      setDraft={({ title, content }) => {
        setTitle(title);
        setContent(content);
      }}
      isDirty={isDirty}
      onSave={handleSave}
      onBack={() => navigate({ to: "/notes" })}
    />
  );
}

export const Route = createFileRoute("/notes/editor/")({
  beforeLoad: async () => {
    requireAuth();
  },

  head: () =>
    buildHead({
      title: "New Note",
      description:
        "Edit your note with real-time Markdown preview and secure token-based authentication.",
      path: "/notes/editor",
    }),

  component: NewNotePage,
});
