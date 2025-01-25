import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const patients = await prisma.patient.findMany({
          include: {
            appointments: true,
            prescriptions: true,
            testResults: true,
          },
        });
        return res.status(200).json(patients);

      case 'POST':
        const newPatient = await prisma.patient.create({
          data: req.body,
        });
        return res.status(201).json(newPatient);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Request error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
} 