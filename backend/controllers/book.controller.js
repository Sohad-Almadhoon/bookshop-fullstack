import prisma from "../utils/db.js";

const createBook = async (req, res) => {
  const { title, author, description, generes, main_cover } = req.body;
  const { id: userId } = req.user; // Ensure the user is authenticated and the user ID is available

  // Validate required fields
  if (!title || !author || !description || !generes || !main_cover) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    // Create the book
    const newBook = await prisma.books.create({
      data: {
        title,
        author,
        description,
        generes,
        main_cover,
      },
    });
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            {
              userId: userId,
            },
          ],
        },

        book: {
          connect: { id: newBook.id }, // Connect the created book with the conversation
        },
      },
    });

    await prisma.user_books.create({
      data: {
        user_id: userId,
        book_id: newBook.id,
        type: "ALL",
      },
    });

    // Return the created book and conversation
    res.status(201).json({
      book: newBook,
      conversation: conversation,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({
      error: "An error occurred while creating the book and conversation.",
    });
  }
};

const getBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await prisma.books.findUnique({
      where: {
        id: parseInt(id),
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

const followBook = async (req, res) => {
  const { id: userId } = req.user; // Extract userId from the authenticated user
  const { id: bookId } = req.params; // Extract bookId from the route parameters

  if (!userId || !bookId) {
    return res.status(400).json({ error: "Missing userId or bookId" });
  }

  try {
    // Check if the user is the creator of the book
    const creatorFollow = await prisma.user_books.findFirst({
      where: {
        user_id: userId,
        book_id: parseInt(bookId),
        type: "ALL", // Check if this user is the creator of the book
      },
    });

    if (creatorFollow) {
      return res.status(200).json({ isOwner: true });
    }

    // Use upsert to avoid duplication if the user is already following
    const follow = await prisma.user_books.upsert({
      where: {
        user_id_book_id: {
          user_id: userId,
          book_id: parseInt(bookId),
        },
      },
      update: {
        type: "FOLLOW", // Ensure the follow type is set correctly
      },
      create: {
        user_id: userId,
        book_id: parseInt(bookId),
        type: "FOLLOW", // Create the follow record if it doesn't exist
      },
    });

    // Check if there's a conversation related to the book
    const conversation = await prisma.conversation.findFirst({
      where: {
        bookId: parseInt(bookId),
      },
    });

    if (conversation) {
      // If a conversation exists, add the user as a participant
      await prisma.participant.create({
        data: {
          user_id: userId,
          conversation_id: conversation.id,
        },
      });
    }

    res.status(201).json(follow); // Return the follow record
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};


const unFollowBook = async (req, res) => {
  const { id: userId } = req.user;
  const { id: bookId } = req.params;

  if (!userId || !bookId) {
    return res.status(400).json({ error: "Missing userId or bookId." });
  }

  try {
    const unfollow = await prisma.user_books.deleteMany({
      where: {
        user_id: userId,
        book_id: parseInt(bookId),
        type: "FOLLOW",
      },
    });

    if (unfollow.count === 0) {
      return res
        .status(404)
        .json({ message: "You are not following this book." });
    }

    res.status(200).json({ message: "Unfollowed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const likeBook = async (req, res) => {
  const { id: bookId } = req.params;
  const { id: userId } = req.user;

  try {
    // Check if the user has already liked the book
    const existingLike = await prisma.user_books.findFirst({
      where: {
        user_id: userId,
        book_id: parseInt(bookId),
        type: "LIKE",
      },
    });

    // If already liked, return a message
    if (existingLike) {
      return res.status(400).json({ message: "Book already liked." });
    }

    // Add the like relation
    const like = await prisma.user_books.create({
      data: {
        user_id: userId,
        book_id: parseInt(bookId),
        type: "LIKE", // Ensure type is LIKE when creating
      },
    });

    res.status(201).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const deleteLike = async (req, res) => {
  const { id: bookId } = req.params;
  const { id: userId } = req.user;

  if (!userId || !bookId) {
    return res.status(400).json({ error: "Missing userId or bookId." });
  }

  try {
    // Remove like relation
    const unlike = await prisma.user_books.deleteMany({
      where: {
        user_id: userId,
        book_id: parseInt(bookId),
        type: "LIKE",
      },
    });

    if (unlike.count === 0) {
      return res.status(404).json({ message: "Book was not liked." });
    }

    res.status(200).json({ message: "Book unliked successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};
const getBookStates = async (req, res) => {
  const { id: userId } = req.user;
  const { id: bookId } = req.params;

  if (!userId || !bookId) {
    return res.status(400).json({ error: "Missing userId or bookId" });
  }

  try {
    // Fetch the "liked" state
    const liked = await prisma.user_books.findFirst({
      where: {
        user_id: userId,
        book_id: parseInt(bookId),
        type: "LIKE",
      },
    });

    const followed = await prisma.user_books.findFirst({
      where: {
        user_id: userId,
        book_id: parseInt(bookId),
        type: "FOLLOW",
      },
    });
    const isOwner = await prisma.user_books.findFirst({
      where: {
        user_id: userId,
        book_id: parseInt(bookId),
        type: "ALL",
      },
    });

    res.json({
      liked: !!liked,
      followed: !!followed,
      isOwner: !!isOwner,
    });
  } catch (error) {
    console.error("Error fetching user states:", error);
    res.status(500).json({ error: "Failed to fetch user states" });
  }
};
const getRandomBooks = async (_, res) => {
  try {
    // Fetch all books
    const allBooks = await prisma.books.findMany();

    if (allBooks.length < 3) {
      return res.status(200).json({
        message: "Not enough books to fetch 3 random entries.",
        books: [],
      });
    }

    // Shuffle the books
    const shuffledBooks = allBooks.sort(() => Math.random() - 0.5);

    // Select the first 3 books
    const randomBooks = shuffledBooks.slice(0, 3);

    // Respond with the random books
    return res.status(200).json(randomBooks);
  } catch (error) {
    console.error("Error fetching random books:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching random books." });
  }
};
const unLikeBook = async (req, res) => {
  const { id: bookId } = req.params;
  const { id: userId } = req.user;
  console.log(bookId);
  if (!userId || !bookId) {
    return res.status(400).json({ error: "Missing userId or bookId." });
  }

  try {
    // Check if the like exists
    const existingLike = await prisma.user_books.findFirst({
      where: {
        user_id: userId,
        book_id: parseInt(bookId),
        type: "LIKE",
      },
    });
    if (!existingLike) {
      return res.status(400).json({ message: "You have not liked this book." });
    }

    // Remove the like relation
    await prisma.user_books.delete({
      where: {
        id: existingLike.id, // Assuming there is a unique ID field for each record
      },
    });

    res.status(200).json({ message: "Book unliked successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export {
  createBook,
  getBook,
  followBook,
  unFollowBook,
  likeBook,
  deleteLike,
  getBookStates,
  getRandomBooks,
  unLikeBook,
};
