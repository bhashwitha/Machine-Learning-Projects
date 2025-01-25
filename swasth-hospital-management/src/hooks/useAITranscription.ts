import { useState, useCallback } from 'react';

export const useAITranscription = () => {
  const [transcription, setTranscription] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [audioChunks]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }, [mediaRecorder]);

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Create form data for the API request
      const formData = new FormData();
      formData.append('audio', audioBlob);

      // Send to your backend API endpoint that handles OpenAI Whisper transcription
      const transcriptionResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      const transcriptionData = await transcriptionResponse.json();
      setTranscription(transcriptionData.text);

      // Generate AI summary using the transcription
      const summaryResponse = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcriptionData.text }),
      });
      const summaryData = await summaryResponse.json();
      setSummary(summaryData.summary);
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };

  return {
    startRecording,
    stopRecording,
    transcription,
    summary,
  };
}; 