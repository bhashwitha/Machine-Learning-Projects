import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  MdDashboard,
  MdPerson,
  MdCalendarToday,
  MdSettings,
  MdDarkMode,
  MdLightMode,
  MdMic,
  MdSearch,
} from 'react-icons/md';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    // Implement voice command logic here
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Implement search logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Swasth</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients, appointments..."
                  className="w-64 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <MdSearch className="absolute right-3 top-2.5 text-gray-400" />
              </div>

              {/* Voice Command Button */}
              <button
                onClick={handleVoiceCommand}
                className={`p-2 rounded-full ${
                  isListening ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <MdMic className={isListening ? 'text-white' : 'text-gray-600 dark:text-gray-300'} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <MdLightMode className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <MdDarkMode className="text-gray-600 dark:text-gray-300" />
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center">
                <span className="text-gray-700 dark:text-gray-300 mr-4">{session?.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex pt-16">
        <aside className="w-64 fixed h-full bg-white dark:bg-gray-800 shadow-lg">
          <nav className="mt-5 px-2">
            <a
              href="/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MdDashboard className="mr-3" />
              <span>Dashboard</span>
            </a>
            <a
              href="/patients"
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MdPerson className="mr-3" />
              <span>Patients</span>
            </a>
            <a
              href="/appointments"
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MdCalendarToday className="mr-3" />
              <span>Appointments</span>
            </a>
            <a
              href="/settings"
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MdSettings className="mr-3" />
              <span>Settings</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 