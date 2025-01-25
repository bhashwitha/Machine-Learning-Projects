import React, { useState } from 'react';
import { Treatment } from '@/types/medical';

interface TreatmentsProps {
  patientId: string;
}

const Treatments: React.FC<TreatmentsProps> = ({ patientId }) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isAddingTreatment, setIsAddingTreatment] = useState(false);

  const TreatmentForm = () => (
    <form className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Treatment Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md dark:bg-gray-700"
            placeholder="Enter treatment name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded-md dark:bg-gray-700"
            rows={3}
            placeholder="Enter treatment description"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md dark:bg-gray-700"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsAddingTreatment(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Save Treatment
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Treatments</h2>
        <button
          onClick={() => setIsAddingTreatment(true)}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Add Treatment
        </button>
      </div>

      {isAddingTreatment && <TreatmentForm />}

      <div className="grid gap-4">
        {treatments.map((treatment) => (
          <div
            key={treatment.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <h3 className="text-lg font-medium">{treatment.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {treatment.description}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(treatment.startDate).toLocaleDateString()} -{' '}
              {treatment.endDate
                ? new Date(treatment.endDate).toLocaleDateString()
                : 'Ongoing'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Treatments; 