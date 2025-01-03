import prisma from "../utils/db.js";

// Create a chapter
const createChapter = async (req, res) => {
  const { id: bookId } = req.params;
  const { title, cover_image } = req.body;
  try {
    const newChapter = await prisma.chapters.create({
      data: {
        title,
        cover_image,
        book: {
          connect: {
            id: parseInt(bookId),
          },
        },
      },
    });
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookChapters = async (req, res) => {
  const { id: bookId } = req.params;
  try {
    const chapters = await prisma.chapters.findMany({
      where: {
        book_id: parseInt(bookId),
      },
      include: {
        chapter_content: true,
        book: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    });

    res.status(200).json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the chapters." });
  }
};

const getChapterContent = async (req, res) => {
  const { chapterId } = req.params;

  try {
    const chapterContent = await prisma.chapter_content.findFirst({
      where: { chapter_id: parseInt(chapterId) },
    });

    if (!chapterContent) {
      return res.status(404).json({ error: "Chapter content not found" });
    }

    return res.status(200).json(chapterContent);
  } catch (error) {
    console.error("Error fetching chapter content:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const createChapterContent = async (req, res) => {
  const { chapterId } = req.params;
  const { text, audio } = req.body;

  if (!text && !audio) {
    return res
      .status(400)
      .json({ error: "Either text or audio must be provided" });
  }

  try {
    const chapterIdInt = parseInt(chapterId);

    const updatedContent = await prisma.chapter_content.upsert({
      where: { chapter_id: chapterIdInt },
      update: {
        text: text ? { push: text } : undefined,
        audio: audio || undefined,
      },
      create: {
        chapter_id: chapterIdInt,
        text: text ? [text] : [],
        audio: audio || null,
      },
    });

    return res.status(200).json(updatedContent);
  } catch (error) {
    console.error("Error posting chapter content:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getBookChapter = async (req, res) => {
  const { id, chapterId } = req.params; 

  try {

    const book = await prisma.books.findUnique({
      where: { id: parseInt(id) },
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

  
    const chapter = await prisma.chapters.findUnique({
      where: { id: parseInt(chapterId), book_id: parseInt(id) },
      include: { chapter_content: true }
    });
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // Return the chapter details as the response
    res.status(200).json(chapter);
  } catch (error) {
    console.error("Error fetching chapter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export {
  createChapter,
  getBookChapters,
  getChapterContent,
  createChapterContent,
  getBookChapter,
};
