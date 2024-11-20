import prisma from "../utils/db.js";

const createBook = async (req, res) => {
    const { title, author, description, generes, main_cover } = req.body;
    try {
      const newBook = await prisma.books.create({
        data: { title, author, description, generes, main_cover },
      });
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
const getBook = async (req, res) => {
  const { id } = req.params; 

  try {
    const book = await prisma.books.findUnique({
      where: {
        id: parseInt(id), 
      },
      include: {
        comments: {
          include: {
            user: true,
          },
        },
        chapters: {
          include: {
            chapter_content: true, 
          },
        },
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the book." });
  }
};

export { createBook, getBook};
