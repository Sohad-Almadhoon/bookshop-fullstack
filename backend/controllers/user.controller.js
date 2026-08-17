import prisma from "../utils/db.js";
import { bookSelect, publicUserSelect, selfUserSelect } from "../utils/selects.js";
import { notFound, parseId } from "../utils/httpError.js";

/** Fresh copy of the logged-in account: the client uses it to refresh has_paid. */
const getMe = async (req, res) => {
  const user = await prisma.users.findUnique({
    where: { id: req.user.id },
    select: selfUserSelect,
  });
  if (!user) throw notFound("User not found.");
  res.status(200).json(user);
};

const getUser = async (req, res) => {
  const id = parseId(req.params.id, "user id");

  const user = await prisma.users.findUnique({
    where: { id },
    // Never the password hash, and the email only for your own profile.
    select: id === req.user.id ? selfUserSelect : publicUserSelect,
  });

  if (!user) throw notFound("User not found.");

  res.status(200).json(user);
};

const getUserBooks = async (req, res) => {
  const userId = parseId(req.params.userId, "user id");

  const userBooks = await prisma.user_books.findMany({
    where: { user_id: userId, type: "ALL" },
    select: { id: true, created_at: true, book: { select: bookSelect } },
    orderBy: { created_at: "desc" },
  });

  res.json(userBooks);
};

const getFollowedBooks = async (req, res) => {
  const userId = parseId(req.params.userId, "user id");

  const followedBooks = await prisma.user_books.findMany({
    where: { user_id: userId, type: "FOLLOW" },
    select: { id: true, created_at: true, book: { select: bookSelect } },
    orderBy: { created_at: "desc" },
  });

  res.json(followedBooks);
};

export { getMe, getUser, getUserBooks, getFollowedBooks };
