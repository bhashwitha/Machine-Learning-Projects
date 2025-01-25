import React from 'react';
import { Tab } from '@headlessui/react';
import { classNames } from '../../utils/helpers';

interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabPanelProps {
  tabs: TabItem[];
  className?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ tabs, className }) => {
  return (
    <div className={className}>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {tab.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab) => (
            <Tab.Panel
              key={tab.key}
              className="rounded-xl bg-white p-3 dark:bg-gray-800"
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default TabPanel; 