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
        comments: {
          include: {
            book: true, 
          },
        },
        conversations: {
          include: {
            conversation: true, 
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
 const getFollowedBooks = async (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const followedBooks = await prisma.user_books.findMany({
      where: {
        user_id: parseInt(userId),
        type: "FOLLOW", 
      },
      include: {
        book: true,
      },
    });


    if (!followedBooks.length) {
      return res.status(404).json({ message: "No followed books found for this user" });
    }

    return res.json(followedBooks.map((relation) => relation.book));
  } catch (error) {
    console.error("Error fetching followed books:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export { getUser, getUserBooks, getFollowedBooks };
