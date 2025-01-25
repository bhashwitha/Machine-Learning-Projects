import React from 'react';
import { Patient } from '../../types/medical';

interface PatientInfoProps {
  patient: Patient;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
          <p className="mt-1 text-lg font-semibold">{patient.name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</h3>
          <p className="mt-1 text-lg font-semibold">{patient.age} years</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Type</h3>
          <p className="mt-1 text-lg font-semibold">{patient.bloodType}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient Type</h3>
          <p className="mt-1 text-lg font-semibold">{patient.patientType}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</h3>
          <p className="mt-1">{patient.contactDetails.phone}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Emergency Contact</h3>
          <p className="mt-1">{patient.emergencyContact.name} ({patient.emergencyContact.phone})</p>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo; 