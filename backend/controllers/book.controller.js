import prisma from "../utils/db.js";

const createBook = async (req, res) => {
  const { title, author, description, generes, main_cover } = req.body;
  const { id: userId } = req.user; // Ensure the user is authenticated and the user ID is available
  console.log("Request body:", req.body); // Log incoming data

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
    console.log(newBook);
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            {
              userId: userId,
            },
          ],
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
      include: {
        comments: {
          include: {
            user: true,
          },
        },
        chapters: {
          include: {
            chapter_content: true,
          },
        },
        users: {
          include: {
            user: true,
          },
        },
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
// Function to follow a book
const followBook = async () => {
  const { bookId } = req.body;
  const { id: userId } = req.user;
  try {
    // Check if the user is already following this book
    const existingFollow = await prisma.user_books.findFirst({
      where: {
        user_id: parseInt(userId),
        book_id: parseInt(bookId),
        type: "FOLLOW",
      },
    });

    if (existingFollow) {
      throw new Error("You are already following this book.");
    }

    // Create a new follow record
    await prisma.user_books.create({
      data: {
        user_id: userId,
        book_id: bookId,
        type: "FOLLOW",
      },
    });

    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: {
            userId: userId, // ensure user is part of the conversation
          },
        },
      },
    });

    // If no conversation exists for the book, create one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId }],
          },
        },
      });
    }

    // Add the user as a participant in the conversation
    await prisma.participant.create({
      data: {
        userId,
        conversationId: conversation.id,
      },
    });

    return {
      success: true,
      message: "You are now following the book and part of the conversation.",
    };
  } catch (error) {
    console.error("Error following book:", error);
    return { success: false, message: error.message };
  }
};

export { createBook, getBook , followBook};
