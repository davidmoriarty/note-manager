// server/src/routes/notes.ts
import { authMiddleware } from "../lib/middleware/auth";
import { Hono } from "hono";
import { prisma } from "../lib/prisma";
import type { NoteDto } from "@shared";

function toNoteDto(note: {
  id: number;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}): NoteDto {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    authorId: note.authorId,
    published: note.published,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

const noteSelect = {
  id: true,
  title: true,
  content: true,
  authorId: true,
  published: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const notesRoutes = new Hono()
  // GET all notes for logged-in user
  .get("/", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const sortOrder = c.req.query("order") === "asc" ? "asc" : "desc";

    const notes = await prisma.note.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: sortOrder },
      select: noteSelect,
    });

    return c.json(notes.map(toNoteDto), { status: 200 });
  })

  // GET a single note by ID
  .get("/:id", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const id = Number(c.req.param("id"));

    const note = await prisma.note.findUnique({
      where: { id },
      select: noteSelect,
    });

    if (!note || note.authorId !== userId) {
      return c.json({ error: "Note not found" }, { status: 404 });
    }

    return c.json(toNoteDto(note), { status: 200 });
  })

  // CREATE a new note
  .post("/", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const { title, content } = await c.req.json();

    if (!title || !content) {
      return c.json({ error: "Missing fields" }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        author: { connect: { id: userId } },
      },
      select: noteSelect,
    });

    return c.json(toNoteDto(note), { status: 201 });
  })

  // UPDATE a note
  .put("/:id", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const id = Number(c.req.param("id"));
    const { title, content, published } = await c.req.json();

    const existing = await prisma.note.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existing || existing.authorId !== userId) {
      return c.json(
        { error: "Note not found or update failed" },
        { status: 404 },
      );
    }

    const data: { title?: string; content?: string; published?: boolean } = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (published !== undefined) data.published = published;

    const updated = await prisma.note.update({
      where: { id },
      data,
      select: noteSelect,
    });

    return c.json(toNoteDto(updated), { status: 200 });
  })

  // DELETE a note
  .delete("/:id", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const id = Number(c.req.param("id"));

    const note = await prisma.note.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!note || note.authorId !== userId) {
      return c.json(
        { error: "Note not found or delete failed" },
        { status: 404 },
      );
    }

    await prisma.note.delete({ where: { id } });

    return c.body(null, 204);
  });
