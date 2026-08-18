import prisma from "./db.js";
import { emitToUsers } from "./realtime.js";

/**
 * Notifications are a side effect: a failed insert must never break the action
 * that triggered it, so everything here swallows its own errors and logs.
 */
const create = async (rows) => {
  if (!rows.length) return;
  try {
    await prisma.notifications.createMany({ data: rows, skipDuplicates: true });
    // nudge the bell without waiting for the next poll
    emitToUsers([...new Set(rows.map((row) => row.user_id))], "notification:new", {
      count: rows.length,
    });
  } catch (error) {
    console.error("Failed to write notifications:", error.message);
  }
};

/** Everyone following a book, minus whoever caused the event. */
const followersOf = async (bookId, exceptUserId) => {
  const rows = await prisma.user_books.findMany({
    where: {
      book_id: bookId,
      type: { in: ["FOLLOW", "ALL"] },
      user_id: { not: exceptUserId },
    },
    select: { user_id: true },
    distinct: ["user_id"],
  });
  return rows.map((row) => row.user_id);
};

export const notifyNewChapter = async ({ bookId, chapterId, actorId, bookTitle, chapterTitle }) => {
  const recipients = await followersOf(bookId, actorId);
  await create(
    recipients.map((user_id) => ({
      user_id,
      actor_id: actorId,
      type: "NEW_CHAPTER",
      message: `New chapter "${chapterTitle}" in ${bookTitle}`,
      book_id: bookId,
      chapter_id: chapterId,
    }))
  );
};

/** Only the owner is told about comments: followers would drown. */
export const notifyNewComment = async ({ bookId, actorId, actorName, bookTitle }) => {
  const owner = await prisma.user_books.findFirst({
    where: { book_id: bookId, type: "ALL" },
    select: { user_id: true },
  });
  if (!owner || owner.user_id === actorId) return;

  await create([
    {
      user_id: owner.user_id,
      actor_id: actorId,
      type: "NEW_COMMENT",
      message: `${actorName} commented on ${bookTitle}`,
      book_id: bookId,
    },
  ]);
};

export const notifyNewMessage = async ({ conversationId, actorId, actorName, bookTitle }) => {
  const participants = await prisma.participant.findMany({
    where: { conversationId, userId: { not: actorId } },
    select: { userId: true },
  });

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { bookId: true },
  });

  await create(
    participants.map(({ userId }) => ({
      user_id: userId,
      actor_id: actorId,
      type: "NEW_MESSAGE",
      message: `${actorName} wrote in ${bookTitle ?? "a conversation"}`,
      book_id: conversation?.bookId ?? null,
    }))
  );
};

export const notifyNewFollower = async ({ bookId, actorId, actorName, bookTitle }) => {
  const owner = await prisma.user_books.findFirst({
    where: { book_id: bookId, type: "ALL" },
    select: { user_id: true },
  });
  if (!owner || owner.user_id === actorId) return;

  await create([
    {
      user_id: owner.user_id,
      actor_id: actorId,
      type: "NEW_FOLLOWER",
      message: `${actorName} started following ${bookTitle}`,
      book_id: bookId,
    },
  ]);
};
