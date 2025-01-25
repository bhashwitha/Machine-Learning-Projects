import { Server as NetServer, Socket as NetSocket } from 'net';
import { Server as SocketIOServer } from 'socket.io';

declare module 'next' {
  interface NextApiResponse {
    json: (data: any) => void;
    status: (code: number) => NextApiResponse;
    end: (data?: string) => void;
    setHeader: (name: string, value: string | string[]) => NextApiResponse;
    socket: NetSocket & {
      server: NetServer & {
        io?: SocketIOServer;
      };
    };
  }
} 