import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "./db.js";
import env, { isAllowedOrigin } from "./env.js";

let io = null;

/**
 * Live updates over the same HTTP server. The chat used to only refresh when
 * you sent something yourself, so a reply arrived when you happened to reload.
 *
 * Two kinds of room:
 *   conversation:<id> - the people reading one thread
 *   user:<id>         - one person's own tab(s), for the notification bell
 */
export const initRealtime = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) =>
        isAllowedOrigin(origin)
          ? callback(null, true)
          : callback(new Error("Origin not allowed")),
      credentials: true,
    },
  });

  // Same token as the REST API: an unauthenticated socket gets nothing.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));
    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);

    // Membership is re-checked here: a socket cannot listen to a thread just by
    // asking for its id.
    socket.on("conversation:join", async (conversationId) => {
      const id = Number(conversationId);
      if (!Number.isInteger(id)) return;

      const participant = await prisma.participant.findFirst({
        where: { conversationId: id, userId: socket.userId },
        select: { id: true },
      });
      if (participant) socket.join(`conversation:${id}`);
    });

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${Number(conversationId)}`);
    });
  });

  console.log("Realtime ready");
  return io;
};

/** No-ops when realtime is not running, e.g. in tests. */
export const emitToConversation = (conversationId, event, payload) => {
  io?.to(`conversation:${conversationId}`).emit(event, payload);
};

export const emitToUsers = (userIds, event, payload) => {
  userIds.forEach((id) => io?.to(`user:${id}`).emit(event, payload));
};

export default { initRealtime, emitToConversation, emitToUsers };
