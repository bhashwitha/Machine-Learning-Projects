import React, { useState } from 'react';
import VoiceRecorder from '../VoiceRecorder';

interface Note {
  id: string;
  date: string;
  content: string;
  summary: string;
  doctorId: string;
}

interface PatientNotesProps {
  patientId: string;
}

const PatientNotes: React.FC<PatientNotesProps> = ({ patientId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const handleTranscriptionComplete = async (transcription: string, summary: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: transcription,
      summary,
      doctorId: 'current-doctor-id', // Replace with actual doctor ID
    };

    try {
      // Save note to database
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          note: newNote,
        }),
      });

      if (response.ok) {
        setNotes([newNote, ...notes]);
        setActiveNote(newNote);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Patient Notes</h2>
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notes List */}
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={`p-4 rounded-lg border cursor-pointer ${
                activeNote?.id === note.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">
                  {new Date(note.date).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{note.summary}</p>
            </div>
          ))}
        </div>

        {/* Active Note Detail */}
        {activeNote && (
          <div className="border rounded-lg p-6">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Full Transcription</h3>
              <p className="text-gray-600">{activeNote.content}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">AI Summary</h3>
              <p className="text-gray-600">{activeNote.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientNotes; 