import React, { useState, useRef } from 'react';
import { transcribeAudio, generateSummary } from '@/services/transcriptionService';

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcription: string, summary: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setProcessing(true);
        
        try {
          const { transcription } = await transcribeAudio(audioBlob);
          const { summary } = await generateSummary(transcription);
          onTranscriptionComplete(transcription, summary);
        } catch (error) {
          console.error('Processing error:', error);
        } finally {
          setProcessing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={processing}
        className={`px-4 py-2 rounded-lg ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white disabled:opacity-50`}
      >
        {processing ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {processing && (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
      )}
    </div>
  );
};

export default VoiceRecorder; 