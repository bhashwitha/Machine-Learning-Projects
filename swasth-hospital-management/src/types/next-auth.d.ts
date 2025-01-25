import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      department?: string;
    } & DefaultSession['user']
  }
  
  interface User {
    id: string;
    role?: string;
    department?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    department?: string;
  }
} 