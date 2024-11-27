import prisma from "../utils/db.js";

const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { id: senderId } = req.user;
    const { content } = req.body;
    console.log(content)
    const message = await prisma.messages.create({
      data: {
        conversationId: parseInt(conversationId),
        senderId,
        content,
      },
    });
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
const getAllMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await prisma.messages.findMany({
      where: { conversationId: parseInt(conversationId) },
      include: {
        sender: true,
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
export { sendMessage , getAllMessages};
