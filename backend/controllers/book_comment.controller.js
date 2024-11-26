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

const getComments = async (req, res) => {
  const { id:bookId } = req.params; 

  try {
    // Fetch all comments for the book using Prisma
    const comments = await prisma.book_comments.findMany({
      where: {
        book_id: parseInt(bookId), 
      },
      include: {
        user: true, 
      },
      orderBy: {
        created_at: "desc", // Sort comments by creation date (most recent first)
      },
    });

    if (!comments.length) {
      return res
        .status(404)
        .json({ message: "No comments found for this book." });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the comments." });
  }
};


export { createComment, getComments };
