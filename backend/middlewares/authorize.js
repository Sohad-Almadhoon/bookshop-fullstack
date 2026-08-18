import prisma from "../utils/db.js";
import asyncHandler from "./asyncHandler.js";
import { forbidden, notFound, parseId } from "../utils/httpError.js";

/** Wording depends on what the caller was trying to do. */
const subscriptionMessage = (req) =>
  req.method === "GET"
    ? "A subscription is required to read this content."
    : "A subscription is required to contribute to this content.";

/** True when the user holds the "ALL" relation, i.e. created the book. */
const isBookOwner = async (userId, bookId) => {
  const owner = await prisma.user_books.findFirst({
    where: { user_id: userId, book_id: bookId, type: "ALL" },
    select: { id: true },
  });
  return Boolean(owner);
};

/**
 * Destructive actions are owner-only. Contributions are shared, but removing
 * something permanently stays with whoever created the book.
 */
const requireBookOwner = asyncHandler(async (req, res, next) => {
  const bookId = parseId(req.params.id, "book id");
  const book = await prisma.books.findUnique({ where: { id: bookId }, select: { id: true } });
  if (!book) throw notFound("Book not found.");

  if (!(await isBookOwner(req.user.id, bookId))) {
    throw forbidden("Only the owner of this book can do that.");
  }

  req.bookId = bookId;
  next();
});

/** Same rule, for routes keyed by :chapterId. */
const requireChapterOwner = asyncHandler(async (req, res, next) => {
  const chapterId = parseId(req.params.chapterId, "chapter id");
  const chapter = await prisma.chapters.findUnique({
    where: { id: chapterId },
    select: { id: true, book_id: true },
  });
  if (!chapter) throw notFound("Chapter not found.");

  if (!(await isBookOwner(req.user.id, chapter.book_id))) {
    throw forbidden("Only the owner of this book can do that.");
  }

  req.chapterId = chapterId;
  req.bookId = chapter.book_id;
  next();
});

/**
 * Chapter content is the paid feature: owners always reach their own books,
 * everybody else needs an active subscription. Used for both reading and
 * writing, replacing the paywall that used to live only in localStorage.
 */
const requireBookAccess = asyncHandler(async (req, res, next) => {
  const bookId = parseId(req.params.id, "book id");

  // One round trip instead of three. Against a hosted database every extra
  // sequential query cost ~160ms before the controller even started.
  const [book, user] = await Promise.all([
    prisma.books.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        users: {
          where: { user_id: req.user.id, type: "ALL" },
          select: { id: true },
          take: 1,
        },
      },
    }),
    prisma.users.findUnique({
      where: { id: req.user.id },
      select: { has_paid: true },
    }),
  ]);

  if (!book) throw notFound("Book not found.");

  const isOwner = book.users.length > 0;
  if (!isOwner && !user?.has_paid) {
    throw forbidden(subscriptionMessage(req));
  }

  req.bookId = bookId;
  req.isBookOwner = isOwner;
  next();
});

/** Same rule as above, but the route is keyed by :chapterId. */
const requireChapterAccess = asyncHandler(async (req, res, next) => {
  const chapterId = parseId(req.params.chapterId, "chapter id");

  // Five independent queries in one wave. Nesting them inside a single
  // findUnique reads better but Prisma resolves nested relations one after the
  // other, which on a hosted database meant ~800ms for one chapter page.
  // Ownership and the book are reached through a subquery on the chapter id, so
  // neither has to wait for the chapter to come back first.
  const [chapter, content, book, ownership, user] = await Promise.all([
    prisma.chapters.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        title: true,
        cover_image: true,
        book_id: true,
        created_at: true,
      },
    }),
    prisma.chapter_content.findUnique({
      where: { chapter_id: chapterId },
      select: {
        id: true,
        chapter_id: true,
        text: true,
        audio: true,
        created_at: true,
      },
    }),
    prisma.books.findFirst({
      where: { chapters: { some: { id: chapterId } } },
      select: { id: true, title: true, author: true },
    }),
    prisma.user_books.findFirst({
      where: {
        user_id: req.user.id,
        type: "ALL",
        book: { chapters: { some: { id: chapterId } } },
      },
      select: { id: true },
    }),
    prisma.users.findUnique({
      where: { id: req.user.id },
      select: { has_paid: true },
    }),
  ]);

  if (!chapter) throw notFound("Chapter not found.");

  const isOwner = Boolean(ownership);
  if (!isOwner && !user?.has_paid) {
    throw forbidden(subscriptionMessage(req));
  }

  req.chapterId = chapterId;
  req.bookId = chapter.book_id;
  req.isBookOwner = isOwner;
  req.chapter = { ...chapter, book, chapter_content: content };
  next();
});

/** Blocks reading/writing conversations the user is not part of. */
const requireConversationParticipant = asyncHandler(async (req, res, next) => {
  const conversationId = parseId(
    req.params.conversationId ?? req.params.id,
    "conversation id"
  );
  const participant = await prisma.participant.findFirst({
    where: { conversationId, userId: req.user.id },
    select: { id: true },
  });
  if (!participant) {
    throw forbidden("You are not a participant of this conversation.");
  }
  req.conversationId = conversationId;
  next();
});

export {
  isBookOwner,
  requireBookOwner,
  requireChapterOwner,
  requireBookAccess,
  requireChapterAccess,
  requireConversationParticipant,
};
