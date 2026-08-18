import { io, Socket } from "socket.io-client";
import { getStoredToken } from "./session";

const baseURL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://bookshop-hanx.onrender.com"
    : "http://localhost:5000");

let socket: Socket | null = null;

/**
 * One shared connection for the whole app. It carries the same JWT as the REST
 * calls, so the server can decide what this user is allowed to hear.
 */
export const getSocket = (): Socket | null => {
  const token = getStoredToken();
  if (!token) return null;

  if (!socket) {
    socket = io(baseURL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
    });
  }
  return socket;
};

export const closeSocket = () => {
  socket?.close();
  socket = null;
};

export default getSocket;
