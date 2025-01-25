import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import { getServerSession } from 'next-auth';
import authOptions from './auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const audioFile = (files.audio as formidable.File[])[0];
      const audioStream = fs.createReadStream(audioFile.filepath);

      const transcription = await openai.audio.transcriptions.create({
        file: audioStream,
        model: 'whisper-1',
      });

      const summary = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a medical professional. Summarize the following consultation:',
          },
          {
            role: 'user',
            content: transcription.text,
          },
        ],
      });

      res.status(200).json({
        transcription: transcription.text,
        summary: summary.choices[0].message?.content,
      });
    });
  } catch (error) {
    console.error('Error in transcription:', error);
    res.status(500).json({ error: 'Error processing transcription' });
  }
} 