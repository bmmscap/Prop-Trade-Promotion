import React from 'react';

interface TabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabClick: (tab: T) => void;
  className?: string;
}

const Tabs = <T extends string>({ tabs, activeTab, onTabClick, className = '' }: TabsProps<T>) => {
  return (
    <div className={`border-b border-gray-700 ${className}`}>
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            className={`${
              activeTab === tab
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            aria-current={activeTab === tab ? 'page' : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
