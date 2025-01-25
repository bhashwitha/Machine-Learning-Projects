import React, { useState } from 'react';
import { useAITranscription } from '@/hooks/useAITranscription';

interface MedicalNotesProps {
  patientId: string;
}

const MedicalNotes: React.FC<MedicalNotesProps> = ({ patientId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const { startRecording, stopRecording, transcription, summary } = useAITranscription();

  const handleRecordToggle = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Medical Notes</h2>
        <button
          onClick={handleRecordToggle}
          className={`px-4 py-2 rounded-lg ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      {transcription && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Transcription</h3>
          <p className="text-gray-700 dark:text-gray-300">{transcription}</p>
        </div>
      )}

      {summary && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">AI Summary</h3>
          <p className="text-gray-700 dark:text-gray-300">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default MedicalNotes; 