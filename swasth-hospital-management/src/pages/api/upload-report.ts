import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const file = (files.file as formidable.File[])[0];
      const patientId = (fields.patientId as string[])[0];

      const testReport = {
        id: Date.now().toString(),
        patientId,
        testName: path.basename(file.originalFilename || ''),
        testDate: new Date(),
        reportUrl: `/uploads/${path.basename(file.filepath)}`,
        status: 'Completed',
      };

      res.status(200).json(testReport);
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
} 