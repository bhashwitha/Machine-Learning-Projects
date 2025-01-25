import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function Patients() {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search patients..."
              className="px-4 py-2 border rounded-lg w-64"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Add New Patient
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Sample patient data */}
                <tr>
                  <td className="px-6 py-4">John Smith</td>
                  <td className="px-6 py-4">45</td>
                  <td className="px-6 py-4">Male</td>
                  <td className="px-6 py-4">+1 234-567-8900</td>
                  <td className="px-6 py-4">
                    <a 
                      href="/patients/1" 
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      View
                    </a>
                    <button className="text-green-500 hover:text-green-700">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
} 