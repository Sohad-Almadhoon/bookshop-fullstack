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
const getBookChapters = async (req, res) => {
  const { id:bookId } = req.params; 
  try {
    const chapters = await prisma.chapters.findMany({
      where: {
        book_id: parseInt(bookId), 
      },
      include: {
        chapter_content: true,
      },
    });

    if (chapters.length === 0) {
      return res
        .status(404)
        .json({ error: "No chapters found for the specified book." });
    }

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
    const chapterContent = await prisma.chapter_content.findMany({
      where: {
        chapter_id: parseInt(chapterId), 
      },
      include: {
        author: {
          // Include the author details for each content block
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        chapter: {
          // Include the chapter details for context
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (chapterContent.length === 0) {
      return res
        .status(404)
        .json({ error: "No content found for the specified chapter." });
    }

    res.status(200).json(chapterContent);
  } catch (error) {
    console.error("Error fetching chapter content:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the chapter content." });
  }
};



export { createChapter, createChapterContent, getBookChapters,getChapterContent };
