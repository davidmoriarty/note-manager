// server/src/routes/notes.ts
import { authMiddleware } from "../lib/middleware/auth";
import { Hono } from "hono";
import { prisma } from "../lib/prisma";

export const notesRoutes = new Hono()

  // GET all notes for logged-in user
  .get("/notes", authMiddleware, async (c) => {
    const userId = c.get("userId");
    console.time("fetch-notes");
    const notes = await prisma.note.findMany({
      where: { authorId: userId },
      include: { author: true },
    });

    console.timeEnd("fetch-notes");
    return c.json(notes, { status: 200 });
  })

  // GET a single note by ID
  .get("/notes/:id", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const id = Number(c.req.param("id"));

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.authorId !== userId) {
      return c.json({ error: "Note not found" }, { status: 404 });
    }

    return c.json(note, { status: 200 });
  })

  // CREATE a new note
  .post("/notes", authMiddleware, async (c) => {
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
    });

    return c.json(note, { status: 201 });
  })

  // UPDATE a note
  .put("/notes/:id", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const id = Number(c.req.param("id"));
    const { title, content, published } = await c.req.json();

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.authorId !== userId) {
      return c.json(
        { error: "Note not found or update failed" },
        { status: 404 },
      );
    }

    const data: { title?: string; content?: string; published?: boolean } = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (published !== undefined) data.published = published;

    const updated = await prisma.note.update({ where: { id }, data });
    return c.json(updated, { status: 200 });
  })

  // DELETE a note
  .delete("/notes/:id", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const id = Number(c.req.param("id"));

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.authorId !== userId) {
      return c.json(
        { error: "Note not found or delete failed" },
        { status: 404 },
      );
    }

    await prisma.note.delete({ where: { id } });
    return c.json({ success: true }, { status: 200 });
  });
