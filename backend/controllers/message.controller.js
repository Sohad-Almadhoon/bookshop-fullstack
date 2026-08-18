import prisma from "../utils/db.js";
import { notifyNewMessage } from "../utils/notify.js";
import { emitToConversation } from "../utils/realtime.js";
import { publicUserSelect } from "../utils/selects.js";

const messageSelect = {
  id: true,
  content: true,
  senderId: true,
  conversationId: true,
  createdAt: true,
  sender: { select: publicUserSelect },
};

// Both handlers run behind requireConversationParticipant, so req.conversationId
// is already validated and the caller is known to be a member.
const sendMessage = async (req, res) => {
  const conversationId = req.conversationId;
  const { id: senderId } = req.user;
  const { content } = req.body;

  const message = await prisma.messages.create({
    data: { conversationId, senderId, content },
    select: messageSelect,
  });

  // Keeps conversation ordering meaningful in the inbox.
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // everyone with the thread open sees it immediately
  emitToConversation(conversationId, "message:new", message);

  notifyNewMessage({
    conversationId,
    actorId: senderId,
    actorName: message.sender?.name ?? "Someone",
    bookTitle: req.conversationBookTitle,
  });

  res.status(201).json(message);
};

const getAllMessages = async (req, res) => {
  const messages = await prisma.messages.findMany({
    where: { conversationId: req.conversationId },
    select: messageSelect,
    orderBy: { createdAt: "asc" },
  });

  res.status(200).json(messages);
};

export { sendMessage, getAllMessages };
