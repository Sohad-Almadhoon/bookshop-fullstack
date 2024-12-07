import prisma from "../utils/db.js";

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
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
    const userBooks = await prisma.user_books.findMany({
      where: {
        user_id: parseInt(userId),
        type:"ALL"
      },
      include: {
        book: true,
      },
    });


    return res.json(userBooks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
 const getFollowedBooks = async (req, res) => {
  const { userId } = req.params;

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


    return res.json(followedBooks);
  } catch (error) {
    console.error("Error fetching followed books:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export { getUser, getUserBooks, getFollowedBooks };
