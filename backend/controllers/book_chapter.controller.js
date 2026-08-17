import prisma from "../utils/db.js";
import { notFound, parseId } from "../utils/httpError.js";

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
  book: { select: { id: true, title: true, author: true } },
};

const createChapter = async (req, res) => {
  // req.bookId is set by requireContributor, which already validated it.
  const bookId = req.bookId ?? parseId(req.params.id, "book id");
  const { title, cover_image } = req.body;

  const newChapter = await prisma.chapters.create({
    data: { title, cover_image, book: { connect: { id: bookId } } },
    select: chapterSelect,
  });

  res.status(201).json(newChapter);
};

const getBookChapters = async (req, res) => {
  const bookId = parseId(req.params.id, "book id");

  const chapters = await prisma.chapters.findMany({
    where: { book_id: bookId },
    select: chapterListSelect,
    orderBy: { created_at: "asc" },
  });

  res.status(200).json(chapters);
};

/** Single chapter looked up by its own id - no book id needed by the client. */
const getChapter = async (req, res) => {
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

export {
  createChapter,
  getBookChapters,
  getChapter,
  getBookChapter,
  getChapterContent,
  createChapterContent,
};
