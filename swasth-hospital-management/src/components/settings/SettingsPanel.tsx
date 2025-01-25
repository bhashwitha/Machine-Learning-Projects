import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Settings {
  notifications: {
    email: boolean;
    sms: boolean;
    browser: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  timeZone: string;
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    contrast: 'normal' | 'high';
  };
}

const SettingsPanel: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<Settings>();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => fetch('/api/settings').then(res => res.json())
  });

  const updateSettings = useMutation({
    mutationFn: (newSettings: Partial<Settings>) =>
      fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const onSubmit = (data: Settings) => {
    updateSettings.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="flex border-b">
          {['general', 'notifications', 'accessibility', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {activeTab === 'general' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Theme
                </label>
                <select
                  {...register('theme')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  {...register('language')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </span>
                  <input
                    type="checkbox"
                    {...register('notifications.email')}
                    className="rounded text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    SMS Notifications
                  </span>
                  <input
                    type="checkbox"
                    {...register('notifications.sms')}
                    className="rounded text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Browser Notifications
                  </span>
                  <input
                    type="checkbox"
                    {...register('notifications.browser')}
                    className="rounded text-blue-600"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => reset(settings)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel; 