import prisma from "../utils/db.js";
import { publicUserSelect } from "../utils/selects.js";
import { notFound } from "../utils/httpError.js";

const conversationSelect = {
  id: true,
  bookId: true,
  createdAt: true,
  updatedAt: true,
  participants: {
    select: { id: true, userId: true, user: { select: publicUserSelect } },
  },
  book: { select: { id: true, title: true, author: true, main_cover: true } },
};

const getUserConversations = async (req, res) => {
  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId: req.user.id } } },
    select: {
      ...conversationSelect,
      messages: {
        select: { id: true, content: true, createdAt: true, senderId: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  res.status(200).json(conversations);
};

/** Used by the chat screen so it works on a hard refresh / direct link. */
const getConversation = async (req, res) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: req.conversationId },
    select: conversationSelect,
  });
  if (!conversation) throw notFound("Conversation not found.");

  res.status(200).json(conversation);
};

export { getUserConversations, getConversation };
