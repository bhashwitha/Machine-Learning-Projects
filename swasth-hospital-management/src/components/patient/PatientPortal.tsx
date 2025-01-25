import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tab } from '@headlessui/react';
import AppointmentScheduler from '../appointments/AppointmentScheduler';
import MedicalRecords from '../medical/MedicalRecords';

const PatientPortal: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { data: patientData } = useQuery({
    queryKey: ['patientData'],
    queryFn: () => fetch('/api/patient/profile').then(res => res.json())
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetch('/api/patient/notifications').then(res => res.json())
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{patientData?.name}</h1>
            <p className="text-gray-600">Patient ID: {patientData?.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Next Appointment</p>
            <p className="font-medium">{patientData?.nextAppointment?.date}</p>
          </div>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          {['Appointments', 'Medical Records', 'Prescriptions', 'Test Results'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <AppointmentScheduler />
          </Tab.Panel>
          <Tab.Panel>
            <MedicalRecords patientId={patientData?.id} />
          </Tab.Panel>
          <Tab.Panel>
            {/* Prescriptions Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Current Prescriptions</h2>
              {patientData?.prescriptions?.map((prescription: any) => (
                <div key={prescription.id} className="border-b py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{prescription.medication}</p>
                      <p className="text-sm text-gray-600">{prescription.dosage}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Prescribed: {new Date(prescription.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            {/* Test Results Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Test Results</h2>
              {patientData?.testResults?.map((result: any) => (
                <div key={result.id} className="border-b py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{result.testName}</p>
                      <p className="text-sm text-gray-600">{result.result}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default PatientPortal; 