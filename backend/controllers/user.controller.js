import prisma from "../utils/db.js";

const followUser = async (req, res) => {
  const { userIdToFollow } = req.body; // The ID of the user to follow
  const { id :userId } = req.user; // Assuming you have the current logged-in user's ID from auth middleware
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

export default followUser;
