import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyzeTestResults } from '@/services/aiService';

interface MedicalRecordsProps {
  patientId: string;
}

const MedicalRecords: React.FC<MedicalRecordsProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState('history');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: medicalHistory, isLoading } = useQuery({
    queryKey: ['medicalHistory', patientId],
    queryFn: () => fetch(`/api/patients/${patientId}/medical-history`).then(res => res.json())
  });

  const { data: testResults } = useQuery({
    queryKey: ['testResults', patientId],
    queryFn: () => fetch(`/api/patients/${patientId}/test-results`).then(res => res.json())
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', patientId);

      try {
        const response = await fetch('/api/upload-test-result', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        const analysis = await analyzeTestResults(result);
        // Handle the analysis result
      } catch (error) {
        console.error('Error uploading test result:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading medical records...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['history', 'tests', 'allergies', 'immunizations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Panels */}
      <div className="mt-6">
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Medical Conditions</h3>
              <div className="space-y-4">
                {medicalHistory?.conditions?.map((condition: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium">{condition.name}</p>
                    <p className="text-sm text-gray-500">
                      Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm">{condition.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Test Results</h3>
              <div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="test-result-upload"
                />
                <label
                  htmlFor="test-result-upload"
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                >
                  Upload New Result
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testResults?.map((result: any) => (
                <div key={result.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{result.type}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(result.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-blue-500 hover:text-blue-700">
                      View Details
                    </button>
                  </div>
                  {result.analysis && (
                    <div className="mt-4 p-4 bg-blue-50 rounded">
                      <p className="text-sm font-medium text-blue-800">AI Analysis</p>
                      <p className="text-sm text-blue-600">{result.analysis}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords; 