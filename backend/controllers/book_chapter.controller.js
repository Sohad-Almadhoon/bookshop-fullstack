import prisma from "../utils/db.js";

// Create a chapter
const createChapter = async (req, res) => {
  const { id:bookId } = req.params;
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
  const { id:bookId } = req.params; 
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
          }
        }
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

const createChapterContent = async (req,res) => {
  const { chapterId } = req.params; 
  const {text , audio} = req.body;
  try {
    await prisma.chapter_content.createMany({
      data: {
        type: text ? "TEXT" : "AUDIO",
        content: text || audio,
        chapter_id: parseInt(chapterId),
        
      },
     
    });
    res.status(201).json({ message: "Content created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
}
export { createChapter, getBookChapters,getChapterContent , createChapterContent};
