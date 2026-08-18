import prisma from "../utils/db.js";
import { notifyNewComment } from "../utils/notify.js";
import { publicUserSelect } from "../utils/selects.js";
import { forbidden, notFound, parseId } from "../utils/httpError.js";

const commentSelect = {
  id: true,
  content: true,
  created_at: true,
  book_id: true,
  user_id: true,
  user: { select: publicUserSelect },
};

const createComment = async (req, res) => {
  const bookId = parseId(req.params.id, "book id");
  const { id: userId } = req.user;
  const { content } = req.body;

  const book = await prisma.books.findUnique({
    where: { id: bookId },
    select: { id: true, title: true },
  });
  if (!book) throw notFound("Book not found.");

  const newComment = await prisma.book_comments.create({
    data: { book_id: bookId, user_id: userId, content },
    select: commentSelect,
  });

  notifyNewComment({
    bookId,
    actorId: userId,
    actorName: newComment.user?.name ?? "Someone",
    bookTitle: book.title,
  });

  res.status(201).json(newComment);
};

const getComments = async (req, res) => {
  const bookId = parseId(req.params.id, "book id");

  const comments = await prisma.book_comments.findMany({
    where: { book_id: bookId },
    select: commentSelect,
    orderBy: { created_at: "desc" },
  });

  res.status(200).json(comments);
};

const deleteComment = async (req, res) => {
  const bookId = parseId(req.params.id, "book id");
  const commentId = parseId(req.params.commentId, "comment id");
  const { id: userId } = req.user;

  const comment = await prisma.book_comments.findFirst({
    where: { id: commentId, book_id: bookId },
    select: { id: true, user_id: true },
  });
  if (!comment) throw notFound("Comment not found.");

  // The author may delete their own comment; the book owner may moderate.
  if (comment.user_id !== userId) {
    const isOwner = await prisma.user_books.findFirst({
      where: { user_id: userId, book_id: bookId, type: "ALL" },
      select: { id: true },
    });
    if (!isOwner) throw forbidden("You can only delete your own comments.");
  }

  await prisma.book_comments.delete({ where: { id: commentId } });

  res.status(200).json({ id: commentId, message: "Comment deleted successfully." });
};

export { createComment, getComments, deleteComment };
