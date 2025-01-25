import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const transcribeAudio = async (audioBlob: Blob) => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

export const generateSummary = async (text: string) => {
  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    return await response.json();
  } catch (error) {
    console.error('Summary generation error:', error);
    throw error;
  }
}; 