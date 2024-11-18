import prisma from "../utils/db.js";

// Create a chapter
const createChapter = async (req, res) => {
  const { bookId } = req.params;
  const { title } = req.body;
  try {
    const newChapter = await prisma.chapters.create({
      data: {
        title,
        book: {
          connect: {
            id: Number(bookId),
          },
        },
      },
    });
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createChapterContent = async (req, res) => {
  const author_id = req.user.id;
  const { chapterId } = req.params;
  const { content, type, transaction_id } = req.body;

  try {
    // Check if the chapter exists
    const chapterIdNum = parseInt(chapterId, 10);
    const chapter = await prisma.chapters.findUnique({
      where: { id: chapterIdNum },
    });

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    // Create the new chapter content
    const newContent = await prisma.chapter_content.create({
      data: {
        chapter_id: chapterIdNum,
        author_id, // Using the author_id (from req.user.id)
        content,
        type,
        transaction_id,
      },
    });

    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createChapter, createChapterContent };
