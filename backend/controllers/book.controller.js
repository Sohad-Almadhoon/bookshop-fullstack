import prisma from "../utils/db.js";
import { bookSelect } from "../utils/selects.js";
import { notFound, parseId, HttpError } from "../utils/httpError.js";

const createBook = async (req, res) => {
  const { title, author, description, generes, main_cover } = req.body;
  const { id: userId } = req.user;

  // One transaction: a book without its conversation/ownership row would leave
  // the user unable to manage what they just created.
  const result = await prisma.$transaction(async (tx) => {
    const book = await tx.books.create({
      data: { title, author, description, generes, main_cover },
      select: bookSelect,
    });

    const conversation = await tx.conversation.create({
      data: {
        participants: { create: [{ userId }] },
        book: { connect: { id: book.id } },
      },
      select: { id: true, bookId: true, createdAt: true },
    });

    await tx.user_books.create({
      data: { user_id: userId, book_id: book.id, type: "ALL" },
    });

    return { book, conversation };
  });

  res.status(201).json(result);
};

const getBook = async (req, res) => {
  const id = parseId(req.params.id, "book id");

  const book = await prisma.books.findUnique({ where: { id }, select: bookSelect });
  if (!book) throw notFound("Book not found.");

  res.status(200).json(book);
};

const followBook = async (req, res) => {
  const { id: userId } = req.user;
  const bookId = parseId(req.params.id, "book id");

  const book = await prisma.books.findUnique({ where: { id: bookId }, select: { id: true } });
  if (!book) throw notFound("Book not found.");

  const isOwner = await prisma.user_books.findFirst({
    where: { user_id: userId, book_id: bookId, type: "ALL" },
    select: { id: true },
  });
  if (isOwner) {
    return res.status(200).json({ isOwner: true });
  }

  const follow = await prisma.user_books.upsert({
    where: {
      user_id_book_id_type: { user_id: userId, book_id: bookId, type: "FOLLOW" },
    },
    update: {},
    create: { user_id: userId, book_id: bookId, type: "FOLLOW" },
  });

  // Following a book also joins its discussion, when there is one.
  const conversation = await prisma.conversation.findFirst({
    where: { bookId },
    select: { id: true },
  });

  if (conversation) {
    await prisma.participant.upsert({
      where: {
        userId_conversationId: { userId, conversationId: conversation.id },
      },
      update: {},
      create: { userId, conversationId: conversation.id },
    });
  }

  res.status(201).json(follow);
};

const unFollowBook = async (req, res) => {
  const { id: userId } = req.user;
  const bookId = parseId(req.params.id, "book id");

  const unfollow = await prisma.user_books.deleteMany({
    where: { user_id: userId, book_id: bookId, type: "FOLLOW" },
  });

  if (unfollow.count === 0) {
    throw notFound("You are not following this book.");
  }

  const conversation = await prisma.conversation.findFirst({
    where: { bookId },
    select: { id: true },
  });

  if (conversation) {
    await prisma.participant.deleteMany({
      where: { userId, conversationId: conversation.id },
    });
  }

  res.status(200).json({ message: "Unfollowed and removed from conversation successfully." });
};

const likeBook = async (req, res) => {
  const { id: userId } = req.user;
  const bookId = parseId(req.params.id, "book id");

  const book = await prisma.books.findUnique({ where: { id: bookId }, select: { id: true } });
  if (!book) throw notFound("Book not found.");

  const existingLike = await prisma.user_books.findFirst({
    where: { user_id: userId, book_id: bookId, type: "LIKE" },
    select: { id: true },
  });
  if (existingLike) {
    throw new HttpError(409, "Book already liked.");
  }

  const like = await prisma.user_books.create({
    data: { user_id: userId, book_id: bookId, type: "LIKE" },
  });

  res.status(201).json(like);
};

const unLikeBook = async (req, res) => {
  const { id: userId } = req.user;
  const bookId = parseId(req.params.id, "book id");

  const unlike = await prisma.user_books.deleteMany({
    where: { user_id: userId, book_id: bookId, type: "LIKE" },
  });

  if (unlike.count === 0) {
    throw notFound("You have not liked this book.");
  }

  res.status(200).json({ message: "Book unliked successfully." });
};

const getBookStates = async (req, res) => {
  const { id: userId } = req.user;
  const bookId = parseId(req.params.id, "book id");

  const relations = await prisma.user_books.findMany({
    where: { user_id: userId, book_id: bookId },
    select: { type: true },
  });

  const types = new Set(relations.map((relation) => relation.type));

  res.json({
    liked: types.has("LIKE"),
    followed: types.has("FOLLOW"),
    isOwner: types.has("ALL"),
  });
};

const getRandomBooks = async (req, res) => {
  const take = Math.min(Number(req.query.limit) || 3, 20);

  const total = await prisma.books.count();
  if (total === 0) {
    // Always an array: the client maps over this response directly.
    return res.status(200).json([]);
  }

  // Random page in the database instead of loading every book into memory.
  const skip = total > take ? Math.floor(Math.random() * (total - take + 1)) : 0;

  const books = await prisma.books.findMany({
    select: bookSelect,
    take,
    skip,
    orderBy: { id: "asc" },
  });

  res.status(200).json(books);
};

const getBookStats = async (req, res) => {
  const bookId = parseId(req.params.id, "book id");

  const [likes, follows] = await Promise.all([
    prisma.user_books.count({ where: { book_id: bookId, type: "LIKE" } }),
    prisma.user_books.count({ where: { book_id: bookId, type: "FOLLOW" } }),
  ]);

  res.status(200).json({ likes, follows });
};

export {
  createBook,
  getBook,
  followBook,
  unFollowBook,
  likeBook,
  unLikeBook,
  getBookStates,
  getRandomBooks,
  getBookStats,
};
