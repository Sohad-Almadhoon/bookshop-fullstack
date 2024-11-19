import prisma from "../utils/db.js";

const createComment = async (req, res) => {
  const { bookId } = req.params;
  const { id: userId } = req.user;
  const { content } = req.body;

  try {
    const newComment = await prisma.book_comments.create({
      data: { book_id: Number(bookId), user_id: userId, content },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export { createComment };
