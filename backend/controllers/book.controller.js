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
export { createBook };
