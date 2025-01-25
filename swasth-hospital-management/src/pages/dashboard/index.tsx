import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Doctor Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{session?.user?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{session?.user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Role</p>
              <p className="font-medium">{(session?.user as any)?.role}</p>
            </div>
            <div>
              <p className="text-gray-600">Department</p>
              <p className="font-medium">{(session?.user as any)?.department}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {['overview', 'patients', 'appointments', 'records'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800">Today's Appointments</h3>
                  <p className="text-3xl font-bold text-blue-600">8</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800">Total Patients</h3>
                  <p className="text-3xl font-bold text-green-600">145</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-800">Pending Reports</h3>
                  <p className="text-3xl font-bold text-purple-600">3</p>
                </div>
              </div>
            )}
            {activeTab === 'patients' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Recent Patients</h3>
                {/* Add patient list here */}
              </div>
            )}
            {activeTab === 'appointments' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
                {/* Add appointments list here */}
              </div>
            )}
            {activeTab === 'records' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Medical Records</h3>
                {/* Add records list here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
} 