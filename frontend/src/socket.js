import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://monthrob.onrender.com";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export default socket;
