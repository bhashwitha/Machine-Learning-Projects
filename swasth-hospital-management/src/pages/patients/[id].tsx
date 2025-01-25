import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TabPanel from '../../components/common/TabPanel';
import PatientInfo from '../../components/patient/PatientInfo';
import MedicalNotes from '../../components/patient/MedicalNotes';
import { usePatient } from '@/hooks/usePatient';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { Tab } from '@headlessui/react';
import { useState } from 'react';

const PatientDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const { patient, loading, error } = usePatient(id as string);
  const [isRecording, setIsRecording] = useState(false);

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedLayout>
    );
  }

  if (error) {
    return (
      <ProtectedLayout>
        <div className="text-center text-red-500">
          Error loading patient data: {error}
        </div>
      </ProtectedLayout>
    );
  }

  if (!patient) {
    return (
      <ProtectedLayout>
        <div className="text-center">Patient not found</div>
      </ProtectedLayout>
    );
  }

  const tabs = [
    {
      key: 'general',
      label: 'General Information',
      content: <PatientInfo patient={patient} />
    },
    {
      key: 'notes',
      label: 'Doctor\'s Notes',
      content: <MedicalNotes patientId={patient.id} />
    },
    {
      key: 'treatments',
      label: 'Treatments',
      content: <div>Treatments content</div>
    },
    {
      key: 'tests',
      label: 'Test Reports',
      content: <div>Test reports content</div>
    },
    {
      key: 'prescriptions',
      label: 'Prescriptions',
      content: <div>Prescriptions content</div>
    }
  ];

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <TabPanel tabs={tabs} className="mt-6" />

        {/* Patient Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{patient.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Group</p>
                  <p className="font-medium">{patient.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{patient.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  <p className="font-medium">{patient.emergencyContact.name} - {patient.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Edit Details
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                New Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }>
              Medical History
            </Tab>
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }>
              Current Treatment
            </Tab>
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
            }>
              Doctor's Notes
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            {/* Medical History Panel */}
            <Tab.Panel className="bg-white rounded-xl p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Previous Diagnoses</h3>
                  <div className="space-y-4">
                    {/* Sample diagnosis */}
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium">{patient.diagnoses[0].condition}</p>
                      <p className="text-sm text-gray-500">Diagnosed on: {patient.diagnoses[0].date}</p>
                      <p className="text-sm">{patient.diagnoses[0].notes}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Test Reports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sample report */}
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">{patient.reports[0].type}</p>
                      <p className="text-sm text-gray-500">Date: {patient.reports[0].date}</p>
                      <button className="text-blue-500 text-sm mt-2">View Report</button>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Current Treatment Panel */}
            <Tab.Panel className="bg-white rounded-xl p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Symptoms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">Primary Symptoms</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                        {patient.currentSymptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Ongoing Treatments</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">Medication</p>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">{patient.treatments[0].medication}:</span> {patient.treatments[0].dosage}
                        </p>
                        <p className="text-sm text-gray-500">Started: {patient.treatments[0].startDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Doctor's Notes Panel */}
            <Tab.Panel className="bg-white rounded-xl p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Consultation Notes</h3>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`px-4 py-2 rounded-lg ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Notes sections */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Latest Consultation</p>
                      <span className="text-sm text-gray-500">2024-02-20</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Patient reports improved symptoms after starting new medication.
                      Blood pressure readings show positive trend.
                    </p>
                  </div>

                  {/* AI Summary */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <p className="font-medium mb-2">AI-Generated Summary</p>
                    <p className="text-sm text-gray-600">
                      Treatment showing positive results. Blood pressure trending towards normal range.
                      Patient adhering to medication schedule. Recommend continued monitoring.
                    </p>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </ProtectedLayout>
  );
};

export default PatientDashboard; 