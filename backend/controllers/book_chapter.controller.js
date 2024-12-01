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
    if (audio) {
      const existingContent = await prisma.chapter_content.findFirst({
        where: { chapter_id: parseInt(chapterId) },
      });

      if (existingContent && existingContent.audio) {
        return res
          .status(400)
          .json({ error: "Audio has already been posted for this chapter" });
      }
      const newContent = await prisma.chapter_content.create({
        data: {
          chapter_id: parseInt(chapterId),
          audio,
        },
      });

      return res.status(201).json(newContent);
    }

    if (text) {
      
      const existingContent = await prisma.chapter_content.findFirst({
        where: { chapter_id: parseInt(chapterId) },
      });

      if (existingContent) {
        const updatedContent = await prisma.chapter_content.update({
          where: { id: existingContent.id },
          data: {
            text: {
              push: text, 
            },
          },
        });

        return res.status(200).json(updatedContent);
      } else {
        const newContent = await prisma.chapter_content.create({
          data: {
            chapter_id: parseInt(chapterId),
            text: [text],
          },
        });

        return res.status(201).json(newContent);
      }
    }
  } catch (error) {
    console.error("Error posting chapter content:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getBookChapter = async (req, res) => {
  const { id, chapterId } = req.params; 

  try {

    const book = await prisma.user_books.findUnique({
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
