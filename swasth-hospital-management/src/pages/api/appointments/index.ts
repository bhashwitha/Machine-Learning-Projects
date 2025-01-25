import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import authOptions from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions) as Session | null;

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  try {
    switch (req.method) {
      case 'GET':
        const appointments = await prisma.appointment.findMany({
          include: {
            patient: true,
            doctor: true,
          },
          where: {
            doctorId: userId,
          },
        });
        return res.status(200).json(appointments);

      case 'POST':
        const newAppointment = await prisma.appointment.create({
          data: {
            ...req.body,
            doctorId: userId,
          },
        });
        return res.status(201).json(newAppointment);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Request error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
} 