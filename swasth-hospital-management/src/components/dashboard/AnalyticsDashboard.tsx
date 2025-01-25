import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Stats {
  totalPatients: number;
  newPatients: number;
  todayAppointments: number;
  pendingAppointments: number;
  testResults: number;
  pendingResults: number;
  prescriptions: number;
  activePrescriptions: number;
  demographics: Array<{
    age: string;
    male: number;
    female: number;
  }>;
  recentActivity: Array<{
    type: 'appointment' | 'test';
    description: string;
    time: string;
  }>;
}

interface AppointmentStats {
  date: string;
  scheduled: number;
  completed: number;
}

const AnalyticsDashboard: React.FC = () => {
  const { data: stats } = useQuery<Stats>({
    queryKey: ['analytics'],
    queryFn: () => fetch('/api/analytics').then(res => res.json())
  });

  const { data: appointments } = useQuery<AppointmentStats[]>({
    queryKey: ['appointmentStats'],
    queryFn: () => fetch('/api/analytics/appointments').then(res => res.json())
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Patients</h3>
          <p className="text-2xl font-bold">{stats?.totalPatients}</p>
          <p className="text-green-500 text-sm">+{stats?.newPatients} this month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Appointments Today</h3>
          <p className="text-2xl font-bold">{stats?.todayAppointments}</p>
          <p className="text-blue-500 text-sm">{stats?.pendingAppointments} pending</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Test Results</h3>
          <p className="text-2xl font-bold">{stats?.testResults}</p>
          <p className="text-orange-500 text-sm">{stats?.pendingResults} pending</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Prescriptions</h3>
          <p className="text-2xl font-bold">{stats?.prescriptions}</p>
          <p className="text-purple-500 text-sm">{stats?.activePrescriptions} active</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Appointments Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="scheduled" stroke="#3B82F6" />
              <Line type="monotone" dataKey="completed" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Patient Demographics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.demographics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" fill="#3B82F6" />
              <Bar dataKey="female" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-2 h-2 rounded-full ${activity.type === 'appointment' ? 'bg-blue-500' : 'bg-green-500'}`} />
              <p className="flex-1">{activity.description}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;