import express from "express";
import prisma from "../utils/db.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { bookSelect, bookOwnerSelect } from "../utils/selects.js";
import { notFound, parseId } from "../utils/httpError.js";

const router = express.Router();

/**
 * A shareable shop window: enough to know what a book is and who made it, but
 * never the chapter text or audio - that stays behind the paywall. Everything
 * here is deliberately unauthenticated.
 */
router.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id, "book id");

    const book = await prisma.books.findUnique({
      where: { id },
      select: { ...bookSelect, users: bookOwnerSelect },
    });
    if (!book) throw notFound("Book not found.");

    const [chapters, likes, follows] = await Promise.all([
      prisma.chapters.findMany({
        // drafts are not part of the public face of a book
        where: { book_id: id, published: true },
        // titles and covers only: no chapter_content anywhere in this select
        select: { id: true, title: true, cover_image: true, position: true },
        orderBy: [{ position: "asc" }, { created_at: "asc" }],
      }),
      prisma.user_books.count({ where: { book_id: id, type: "LIKE" } }),
      prisma.user_books.count({ where: { book_id: id, type: "FOLLOW" } }),
    ]);

    const { users, ...rest } = book;

    res.status(200).json({
      ...rest,
      owner: users[0]?.user ?? null,
      chapters,
      likes,
      follows,
    });
  })
);

export default router;
