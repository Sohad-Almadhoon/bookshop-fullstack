import prisma from "../utils/db.js";
import { notifyNewChapter } from "../utils/notify.js";
import { badRequest, notFound, parseId } from "../utils/httpError.js";

const chapterContentSelect = {
  id: true,
  chapter_id: true,
  text: true,
  audio: true,
  created_at: true,
};

const chapterSelect = {
  id: true,
  title: true,
  cover_image: true,
  book_id: true,
  created_at: true,
  position: true,
  published: true,
  book: { select: { id: true, title: true, author: true } },
  chapter_content: { select: chapterContentSelect },
};

// The public chapter list only needs covers and titles. It used to embed the
// full text and audio of every chapter, handing the paid content to anyone.
const chapterListSelect = {
  id: true,
  title: true,
  cover_image: true,
  book_id: true,
  created_at: true,
  position: true,
  published: true,
  book: { select: { id: true, title: true, author: true } },
};

const createChapter = async (req, res) => {
  // req.bookId is set by requireContributor, which already validated it.
  const bookId = req.bookId ?? parseId(req.params.id, "book id");
  const { title, cover_image } = req.body;

  // Append to the end of the book rather than landing at position 0.
  const last = await prisma.chapters.findFirst({
    where: { book_id: bookId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const newChapter = await prisma.chapters.create({
    data: {
      title,
      cover_image,
      position: (last?.position ?? 0) + 1,
      book: { connect: { id: bookId } },
    },
    select: chapterSelect,
  });

  // fire and forget: the chapter is already saved
  notifyNewChapter({
    bookId,
    chapterId: newChapter.id,
    actorId: req.user.id,
    bookTitle: newChapter.book?.title ?? "a book",
    chapterTitle: newChapter.title,
  });

  res.status(201).json(newChapter);
};

const getBookChapters = async (req, res) => {
  const bookId = parseId(req.params.id, "book id");

  // Drafts stay with the book owner until they publish them.
  const isOwner = await prisma.user_books.findFirst({
    where: { user_id: req.user.id, book_id: bookId, type: "ALL" },
    select: { id: true },
  });

  const chapters = await prisma.chapters.findMany({
    where: { book_id: bookId, ...(isOwner ? {} : { published: true }) },
    select: chapterListSelect,
    orderBy: [{ position: "asc" }, { created_at: "asc" }],
  });

  res.status(200).json(chapters);
};

/** Single chapter looked up by its own id - no book id needed by the client. */
const getChapter = async (req, res) => {
  // requireChapterAccess already loaded the whole chapter to decide access,
  // so this is a hand-off rather than a second identical query.
  if (req.chapter) return res.status(200).json(req.chapter);

  const chapterId = parseId(req.params.chapterId, "chapter id");
  const chapter = await prisma.chapters.findUnique({
    where: { id: chapterId },
    select: chapterSelect,
  });
  if (!chapter) throw notFound("Chapter not found.");

  res.status(200).json(chapter);
};

const getBookChapter = async (req, res) => {
  const bookId = parseId(req.params.id, "book id");
  const chapterId = parseId(req.params.chapterId, "chapter id");

  const chapter = await prisma.chapters.findFirst({
    where: { id: chapterId, book_id: bookId },
    select: chapterSelect,
  });
  if (!chapter) throw notFound("Chapter not found.");

  res.status(200).json(chapter);
};

const getChapterContent = async (req, res) => {
  const chapterId = parseId(req.params.chapterId, "chapter id");

  const chapterContent = await prisma.chapter_content.findUnique({
    where: { chapter_id: chapterId },
    select: chapterContentSelect,
  });
  if (!chapterContent) throw notFound("Chapter content not found.");

  res.status(200).json(chapterContent);
};

const createChapterContent = async (req, res) => {
  const chapterId = req.chapterId ?? parseId(req.params.chapterId, "chapter id");
  const { text, audio } = req.body;

  const updatedContent = await prisma.chapter_content.upsert({
    where: { chapter_id: chapterId },
    update: {
      ...(text ? { text: { push: text } } : {}),
      ...(audio ? { audio } : {}),
    },
    create: {
      chapter_id: chapterId,
      text: text ? [text] : [],
      audio: audio || null,
      user_id: req.user.id,
    },
    select: chapterContentSelect,
  });

  res.status(200).json(updatedContent);
};

/** Owner-only: rename, re-cover, or move between draft and published. */
const updateChapter = async (req, res) => {
  const chapter = await prisma.chapters.update({
    where: { id: req.chapterId },
    data: req.body,
    select: chapterSelect,
  });

  res.status(200).json(chapter);
};

/**
 * Owner-only. Takes the chapter ids in their new order and writes the
 * positions in one transaction, so the book is never half-reordered.
 */
const reorderChapters = async (req, res) => {
  const bookId = req.bookId;
  const { order } = req.body;

  const chapters = await prisma.chapters.findMany({
    where: { book_id: bookId },
    select: { id: true },
  });
  const known = new Set(chapters.map((chapter) => chapter.id));

  if (order.length !== known.size || order.some((id) => !known.has(id))) {
    throw badRequest("The order must list every chapter of this book exactly once.");
  }

  await prisma.$transaction(
    order.map((id, index) =>
      prisma.chapters.update({ where: { id }, data: { position: index + 1 } })
    )
  );

  const updated = await prisma.chapters.findMany({
    where: { book_id: bookId },
    select: chapterListSelect,
    orderBy: { position: "asc" },
  });

  res.status(200).json(updated);
};

/** Owner-only. Takes the chapter's content with it. */
const deleteChapter = async (req, res) => {
  const chapterId = req.chapterId; // validated by requireChapterOwner

  await prisma.$transaction(async (tx) => {
    await tx.chapter_content.deleteMany({ where: { chapter_id: chapterId } });
    await tx.chapters.delete({ where: { id: chapterId } });
  });

  res.status(200).json({ id: chapterId, message: "Chapter deleted successfully." });
};

/**
 * Text is stored as a plain String[], so a single paragraph is addressed by its
 * position. Read, splice, write - guarded by the row's current length so an
 * index from a stale page cannot overwrite the wrong paragraph.
 */
const readTextBlocks = async (chapterId, index) => {
  const content = await prisma.chapter_content.findUnique({
    where: { chapter_id: chapterId },
    select: { text: true },
  });
  if (!content) throw notFound("Chapter content not found.");
  if (index < 0 || index >= content.text.length) {
    throw badRequest("That paragraph no longer exists. Refresh the page and try again.");
  }
  return content.text;
};

const updateTextBlock = async (req, res) => {
  const chapterId = req.chapterId;
  const index = Number(req.params.index);
  const { text } = req.body;

  const blocks = await readTextBlocks(chapterId, index);
  blocks[index] = text;

  const updated = await prisma.chapter_content.update({
    where: { chapter_id: chapterId },
    data: { text: blocks },
    select: chapterContentSelect,
  });

  res.status(200).json(updated);
};

const deleteTextBlock = async (req, res) => {
  const chapterId = req.chapterId;
  const index = Number(req.params.index);

  const blocks = await readTextBlocks(chapterId, index);
  blocks.splice(index, 1);

  const updated = await prisma.chapter_content.update({
    where: { chapter_id: chapterId },
    data: { text: blocks },
    select: chapterContentSelect,
  });

  res.status(200).json(updated);
};

const deleteChapterAudio = async (req, res) => {
  const chapterId = req.chapterId;

  const content = await prisma.chapter_content.findUnique({
    where: { chapter_id: chapterId },
    select: { audio: true },
  });
  if (!content?.audio) throw notFound("This chapter has no audio.");

  const updated = await prisma.chapter_content.update({
    where: { chapter_id: chapterId },
    data: { audio: null },
    select: chapterContentSelect,
  });

  res.status(200).json(updated);
};

export {
  createChapter,
  updateChapter,
  reorderChapters,
  deleteChapter,
  getBookChapters,
  getChapter,
  getBookChapter,
  getChapterContent,
  createChapterContent,
  updateTextBlock,
  deleteTextBlock,
  deleteChapterAudio,
};
