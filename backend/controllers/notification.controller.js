import prisma from "../utils/db.js";
import { parseId } from "../utils/httpError.js";

const notificationSelect = {
  id: true,
  type: true,
  message: true,
  book_id: true,
  chapter_id: true,
  read: true,
  created_at: true,
  actor: { select: { id: true, name: true, role: true } },
};

/** The bell: recent notifications plus the unread count, in one request. */
const getNotifications = async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);

  const [items, unread] = await Promise.all([
    prisma.notifications.findMany({
      where: { user_id: req.user.id },
      select: notificationSelect,
      orderBy: { created_at: "desc" },
      take: limit,
    }),
    prisma.notifications.count({ where: { user_id: req.user.id, read: false } }),
  ]);

  res.status(200).json({ items, unread });
};

const markAsRead = async (req, res) => {
  const id = parseId(req.params.id, "notification id");

  // scoped by user_id so one account cannot touch another's row
  const result = await prisma.notifications.updateMany({
    where: { id, user_id: req.user.id },
    data: { read: true },
  });

  res.status(200).json({ updated: result.count });
};

const markAllAsRead = async (req, res) => {
  const result = await prisma.notifications.updateMany({
    where: { user_id: req.user.id, read: false },
    data: { read: true },
  });

  res.status(200).json({ updated: result.count });
};

export { getNotifications, markAsRead, markAllAsRead };
