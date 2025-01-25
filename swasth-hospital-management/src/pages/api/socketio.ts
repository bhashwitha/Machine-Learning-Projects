import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import authOptions from './auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket?.server.io) {
    if (!res.socket) return res.status(500).end();
    
    const httpServer: HTTPServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socketio',
    });

    io.use(async (socket, next) => {
      try {
        const session = await getServerSession(req, res, authOptions);
        if (session) {
          (socket as any).session = session;
          next();
        } else {
          next(new Error('Unauthorized'));
        }
      } catch (error) {
        next(error as Error);
      }
    });

    io.on('connection', (socket) => {
      console.log('New client connected');

      socket.on('join-patient-room', (patientId: string) => {
        socket.join(`patient-${patientId}`);
      });

      socket.on('leave-patient-room', (patientId: string) => {
        socket.leave(`patient-${patientId}`);
      });

      socket.on('update-patient', (data) => {
        io.to(`patient-${data.patientId}`).emit('patient-updated', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  }
  res.status(200).end();
};

export default ioHandler;