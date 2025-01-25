import React, { useState } from 'react';
import { Medication } from '@/types/medical';

interface PrescriptionsProps {
  patientId: string;
}

const Prescriptions: React.FC<PrescriptionsProps> = ({ patientId }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isAddingMedication, setIsAddingMedication] = useState(false);

  const MedicationForm = () => (
    <form className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Medication Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md dark:bg-gray-700"
              placeholder="Enter medication name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dosage</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md dark:bg-gray-700"
              placeholder="e.g., 500mg"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <select className="w-full p-2 border rounded-md dark:bg-gray-700">
              <option value="once">Once daily</option>
              <option value="twice">Twice daily</option>
              <option value="thrice">Thrice daily</option>
              <option value="four">Four times daily</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <div className="flex space-x-2">
              <input
                type="number"
                className="w-20 p-2 border rounded-md dark:bg-gray-700"
                placeholder="Days"
              />
              <select className="w-full p-2 border rounded-md dark:bg-gray-700">
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Special Instructions</label>
          <textarea
            className="w-full p-2 border rounded-md dark:bg-gray-700"
            rows={3}
            placeholder="Enter special instructions (e.g., take with food)"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsAddingMedication(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Save Medication
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Prescriptions</h2>
        <button
          onClick={() => setIsAddingMedication(true)}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Add Medication
        </button>
      </div>

      {isAddingMedication && <MedicationForm />}

      <div className="grid gap-4">
        {medications.map((medication) => (
          <div
            key={medication.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{medication.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {medication.dosage} - {medication.frequency}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-500 hover:text-blue-600">Edit</button>
                <button className="text-red-500 hover:text-red-600">Stop</button>
              </div>
            </div>
            {medication.specialInstructions && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {medication.specialInstructions}
              </p>
            )}
            <div className="mt-2 text-sm text-gray-500">
              {new Date(medication.startDate).toLocaleDateString()} -{' '}
              {medication.endDate
                ? new Date(medication.endDate).toLocaleDateString()
                : 'Ongoing'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prescriptions; 