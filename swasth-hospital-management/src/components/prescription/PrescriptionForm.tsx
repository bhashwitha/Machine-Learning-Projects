import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: number;
  notes?: string;
}

interface PrescriptionFormProps {
  patientId: string;
  onSubmit: (data: any) => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ patientId, onSubmit }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const { register, handleSubmit, reset } = useForm<Medication>();

  const addMedication: SubmitHandler<Medication> = (data) => {
    setMedications([...medications, data]);
    reset();
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({
      patientId,
      medications,
      startDate: new Date(),
      status: 'active',
      ...data,
    });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold">New Prescription</h2>

      {/* Medications List */}
      <div className="space-y-4">
        {medications.map((med, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{med.name}</p>
              <p className="text-sm text-gray-600">
                {med.dosage} - {med.frequency} for {med.duration} days
              </p>
              {med.notes && <p className="text-sm text-gray-500">{med.notes}</p>}
            </div>
            <button
              onClick={() => setMedications(medications.filter((_, i) => i !== index))}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add Medication Form */}
      <form onSubmit={handleSubmit(addMedication)} className="grid grid-cols-2 gap-4">
        <input
          {...register('name')}
          placeholder="Medication name"
          className="p-2 border rounded"
        />
        <input
          {...register('dosage')}
          placeholder="Dosage"
          className="p-2 border rounded"
        />
        <input
          {...register('frequency')}
          placeholder="Frequency"
          className="p-2 border rounded"
        />
        <input
          {...register('duration')}
          type="number"
          placeholder="Duration (days)"
          className="p-2 border rounded"
        />
        <textarea
          {...register('notes')}
          placeholder="Notes"
          className="col-span-2 p-2 border rounded"
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Medication
        </button>
      </form>

      {/* Submit Prescription */}
      <button
        onClick={handleSubmit(handleFormSubmit)}
        className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
      >
        Create Prescription
      </button>
    </div>
  );
};

export default PrescriptionForm; 