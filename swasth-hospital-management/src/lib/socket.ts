import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initializeSocket = () => {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
    path: '/api/socketio',
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
}; 