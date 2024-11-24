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
const getFollowingUserBooks = async (req, res) => {
  const { id: userId } = req.user;
  try {
    // Fetch books from users the current user is following
    const followingBooks = await prisma.user_books.findMany({
      where: {
        user: {
          followers: {
            some: { id: userId }, // Find books from users that the current user follows
          },
        },
      },
      include: {
        book: true, // Include book details
        user: { select: { name: true, id: true } }, // Include user details if needed
      },
    });

    if (!followingBooks.length) {
      return res
        .status(404)
        .json({ message: "No books found from followed users." });
    }

    res.status(200).json("followingBooks");
  } catch (error) {
    console.error("Error fetching following user books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  followUser,
  getUser,
  getBookUsers,
  getUserBooks,
  getFollowingUserBooks,
};
