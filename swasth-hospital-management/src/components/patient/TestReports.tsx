import React, { useState } from 'react';
import { TestReport } from '@/types/medical';

interface TestReportsProps {
  patientId: string;
}

const TestReports: React.FC<TestReportsProps> = ({ patientId }) => {
  const [reports, setReports] = useState<TestReport[]>([]);
  const [isAddingTest, setIsAddingTest] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);

    try {
      const response = await fetch('/api/upload-report', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setReports((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const TestReportForm = () => (
    <form className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Test Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md dark:bg-gray-700"
            placeholder="Enter test name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Upload Report</label>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full p-2 border rounded-md dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Test Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            className="w-full p-2 border rounded-md dark:bg-gray-700"
            rows={3}
            placeholder="Enter additional notes"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsAddingTest(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Save Report
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Test Reports</h2>
        <button
          onClick={() => setIsAddingTest(true)}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Add Test Report
        </button>
      </div>

      {isAddingTest && <TestReportForm />}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Test Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap">{report.testName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(report.testDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => window.open(report.reportUrl, '_blank')}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestReports; 