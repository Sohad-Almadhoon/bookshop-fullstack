import prisma from "../utils/db.js";

const followUser = async (req, res) => {
  const { userIdToFollow } = req.body; // The ID of the user to follow
  const { id: userId } = req.user; // Assuming you have the current logged-in user's ID from auth middleware
  if (userId === userIdToFollow) {
    return res.status(400).json({ error: "You cannot follow yourself." });
  }

  try {
    // Check if the user is already following the other user
    const isAlreadyFollowing = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        following_users: {
          where: {
            id: userIdToFollow,
          },
        },
      },
    });

    if (isAlreadyFollowing.following_users.length > 0) {
      return res
        .status(400)
        .json({ error: "You are already following this user." });
    }

    // Proceed to follow the user by updating both `following_users` and `followers`
    await prisma.users.update({
      where: { id: userId },
      data: {
        following_users: {
          connect: { id: userIdToFollow },
        },
      },
    });

    await prisma.users.update({
      where: { id: userIdToFollow },
      data: {
        followers: {
          connect: { id: userId },
        },
      },
    });

    return res.status(200).json({ message: "User followed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error following user." });
  }
};

const connectUserWithBook = async (req, res) => {
  const { userId } = req.params;
  const { bookId, type } = req.body;

  try {
    // Check if the user-book relation already exists
    const existingRelation = await prisma.user_books.findFirst({
      where: {
        user_id: parseInt(userId),
        book_id: parseInt(bookId),
      },
    });

    if (existingRelation) {
      return res
        .status(400)
        .json({ error: "User is already connected to this book." });
    }

    // Create a new connection
    const connection = await prisma.user_books.create({
      data: {
        user_id: parseInt(userId),
        book_id: parseInt(bookId),
        type: type || "ALL",
      },
    });

    res.status(201).json({
      message: "User connected to book successfully.",
      connection,
    });
  } catch (error) {
    console.error("Error connecting user with book:", error);
    res.status(500).json({
      error: "An error occurred while connecting the user with the book.",
    });
  }
};
const getUser = async (req, res) => {
  const { id } = req.user;
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

const getBookUsers = async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    const users = await prisma.user_books.findMany({
      where: { book_id: bookId },
      include: {
        user: true,
      },
    });

    if (!users.length) {
      return res.status(404).json({ message: "No users found for this book" });
    }

    return res.json(users.map((userBook) => userBook.user)); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { followUser, connectUserWithBook, getUser, getBookUsers };
