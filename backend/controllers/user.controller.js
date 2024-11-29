import prisma from "../utils/db.js";

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        books: {
          include: {
            book: true, // Include the book details for books related to the user
          },
        },
        followers: true, // Include the users who follow this user
        following_users: true, // Include the users this user is following
        comments: {
          include: {
            book: true, // Include the book details for the comments made by this user
          },
        },
        conversations: {
          include: {
            conversation: true, // Include the conversations the user is part of
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user." });
  }
};

const getUserBooks = async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetching all books associated with the user
    const userBooks = await prisma.user_books.findMany({
      where: {
        user_id: parseInt(userId),
      },
      include: {
        book: true,
      },
    });
    if (!userBooks.length) {
      return res.status(404).json({ message: "No books found for this user" });
    }

    // Returning the list of books related to the user
    return res.json(userBooks.map((userBook) => userBook.book));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export {
  getUser,
  getUserBooks,
};
