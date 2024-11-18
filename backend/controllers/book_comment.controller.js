import prisma from "../utils/db.js";

const createComment = async (req, res) => {
  const { book_id, user_id, content } = req.body;
  try {
    const newComment = await prisma.book_comments.create({
      data: { book_id, user_id, content },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export { createComment };
