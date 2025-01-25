import { NextApiRequest, NextApiResponse } from 'next';
import { Medication } from '@/types/medical';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return handleGetPrescriptions(req, res);
    case 'POST':
      return handleCreatePrescription(req, res);
    case 'PUT':
      return handleUpdatePrescription(req, res);
    case 'DELETE':
      return handleDeletePrescription(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGetPrescriptions(req: NextApiRequest, res: NextApiResponse) {
  const { patientId } = req.query;

  try {
    // Here you would typically fetch from your database
    // For now, returning mock data
    const medications: Medication[] = [
      {
        id: '1',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '7 days',
        specialInstructions: 'Take with food',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];

    res.status(200).json(medications);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Error fetching prescriptions' });
  }
}

async function handleCreatePrescription(req: NextApiRequest, res: NextApiResponse) {
  const { patientId } = req.query;
  const medicationData = req.body;

  try {
    // Here you would typically save to your database
    // For now, returning mock response
    const newMedication: Medication = {
      id: Date.now().toString(),
      ...medicationData,
      startDate: new Date(),
    };

    res.status(201).json(newMedication);
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ error: 'Error creating prescription' });
  }
}

async function handleUpdatePrescription(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updateData = req.body;

  try {
    // Here you would typically update your database
    // For now, returning mock response
    res.status(200).json({ id, ...updateData });
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Error updating prescription' });
  }
}

async function handleDeletePrescription(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    // Here you would typically delete from your database
    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ error: 'Error deleting prescription' });
  }
} 