import { io } from "socket.io-client";

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const envUrl = import.meta.env.VITE_API_URL;
const SOCKET_URL = isDev
  ? (envUrl || 'http://localhost:5000')
  : (envUrl && !envUrl.includes('localhost') ? envUrl : 'https://monthrob.onrender.com');

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export default socket;
