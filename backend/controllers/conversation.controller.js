import prisma from "../utils/db.js";

const createConversation = async (req, res) => {
  try {
    const { participants } = req.body;
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: participants.map((userId) => ({
            userId,
          })),
        },
      },
    });
    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
// Get all conversations for a user
const getUserConversations = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: parseInt(userId),
          },
        },
      },
      include: {
        participants: true,
      },
    });
    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
// Get all participants in a conversation
const getConversationParticipants = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const participants = await prisma.participant.findMany({
      where: { conversationId: parseInt(conversationId) },
      include: {
        user: true,
      },
    });
    res.status(200).json(participants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
export {
  createConversation,
  getUserConversations,
  getConversationParticipants,
};
