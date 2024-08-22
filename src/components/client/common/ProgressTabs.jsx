import React, { useState } from 'react';

export default function Tabs({ tabs, children, onSubmit }) {
  const [activeTab, setActiveTab] = useState(0);

  const nextTab = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab((prev) => prev + 1);
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`py-2 px-4 text-sm font-medium bg-white p-4 shadow-md rounded-md w-full ${
              activeTab === index
                ? 'border-b-2 border-goldlight text-goldlight'
                : 'border-b-2 border-transparent text-black hover:text-goldlight hover:border-goldlight'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {React.Children.map(children, (child, index) => {
          if (index === activeTab) {
            return <div>{child}</div>;
          }
          return null;
        })}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={prevTab}
          disabled={activeTab === 0}
          className="bg-gray-300 text-goldlight py-2 px-4 rounded-md shadow-md"
        >
          Previous
        </button>
        {activeTab < tabs.length - 1 && (
          <button
            onClick={nextTab}
            className="btn-design-1"
          >
            <span className="btn-background"></span>
            <span className="relative">Next</span>
          </button>
        )}
      </div>
    </div>
  );
}
