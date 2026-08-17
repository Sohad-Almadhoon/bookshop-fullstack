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
 * Chapter content is the paid feature: owners always reach their own books,
 * everybody else needs an active subscription. Used for both reading and
 * writing, replacing the paywall that used to live only in localStorage.
 */
const requireBookAccess = asyncHandler(async (req, res, next) => {
  const bookId = parseId(req.params.id, "book id");
  const book = await prisma.books.findUnique({ where: { id: bookId }, select: { id: true } });
  if (!book) throw notFound("Book not found.");

  if (await isBookOwner(req.user.id, bookId)) {
    req.bookId = bookId;
    return next();
  }

  const user = await prisma.users.findUnique({
    where: { id: req.user.id },
    select: { has_paid: true },
  });
  if (!user?.has_paid) {
    throw forbidden(subscriptionMessage(req));
  }

  req.bookId = bookId;
  next();
});

/** Same rule as above, but the route is keyed by :chapterId. */
const requireChapterAccess = asyncHandler(async (req, res, next) => {
  const chapterId = parseId(req.params.chapterId, "chapter id");
  const chapter = await prisma.chapters.findUnique({
    where: { id: chapterId },
    select: { id: true, book_id: true },
  });
  if (!chapter) throw notFound("Chapter not found.");

  if (!(await isBookOwner(req.user.id, chapter.book_id))) {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: { has_paid: true },
    });
    if (!user?.has_paid) {
      throw forbidden(subscriptionMessage(req));
    }
  }

  req.chapterId = chapterId;
  req.bookId = chapter.book_id;
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
  requireBookAccess,
  requireChapterAccess,
  requireConversationParticipant,
};
