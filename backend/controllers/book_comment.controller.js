import prisma from "../utils/db.js";

const createComment = async (req, res) => {
  const { id:bookId } = req.params;
  const { id: userId } = req.user;
  const { content } = req.body;
  try {
    const newComment = await prisma.book_comments.create({
      data: { book_id: parseInt(bookId), user_id: userId, content },
      include: {
        user: true, 
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  const { id:bookId } = req.params; 

  try {
    const comments = await prisma.book_comments.findMany({
      where: {
        book_id: parseInt(bookId), 
      },
      include: {
        user: true, 
      },
      orderBy: {
        created_at: "desc", 
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the comments." });
  }
};

const deleteComment = async (req, res) => {
  const { id: bookId, commentId } = req.params;
try {
  const deletedComment = await prisma.book_comments.delete({
    where: {
      id: parseInt(commentId),
      book_id: parseInt(bookId),
    },
  });

  res.status(200).json(deletedComment);
} catch (error) {
  console.error("Error deleting comment:", error);
  res.status(500).json({ error: "An error occurred while deleting the comment." });
}
};
export { createComment, getComments, deleteComment };
