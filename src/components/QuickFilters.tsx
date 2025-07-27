'use client';

import { useTaskStore } from '@/store/taskStore';
import { useState } from 'react';

export default function QuickFilters() {
  const { filters, setFilters } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);

  const quickFilters = [
    {
      label: 'High Priority',
      key: 'priority',
      value: 'high',
      color: 'bg-red-100 text-red-700 border-red-200',
      activeColor: 'bg-red-200 text-red-800 border-red-300'
    },
    {
      label: 'In Progress',
      key: 'status', 
      value: 'in-progress',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      activeColor: 'bg-blue-200 text-blue-800 border-blue-300'
    },
    {
      label: 'Medium Priority',
      key: 'priority',
      value: 'medium', 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      activeColor: 'bg-yellow-200 text-yellow-800 border-yellow-300'
    },
    {
      label: 'To Do',
      key: 'status',
      value: 'todo',
      color: 'bg-gray-100 text-gray-700 border-gray-200', 
      activeColor: 'bg-gray-200 text-gray-800 border-gray-300'
    }
  ];

  const toggleQuickFilter = (filterKey: string, value: string) => {
    const currentFilters = { ...filters };
    const filterArray = currentFilters[filterKey as keyof typeof filters];
    
    if (filterArray.includes(value)) {
      // Remove filter
      currentFilters[filterKey as keyof typeof filters] = filterArray.filter(item => item !== value);
    } else {
      // Add filter
      currentFilters[filterKey as keyof typeof filters] = [...filterArray, value];
    }
    
    setFilters(currentFilters);
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).reduce((total, filterArray) => total + filterArray.length, 0);

  return (
    <div className="relative">
      {/* Desktop View - Show all filters inline */}
      <div className="hidden lg:flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-gray-600 flex items-center mr-2">Quick filters:</span>
        {quickFilters.map((filter) => {
          const isActive = filters[filter.key as keyof typeof filters].includes(filter.value);
          
          return (
            <button
              key={`${filter.key}-${filter.value}`}
              onClick={() => toggleQuickFilter(filter.key, filter.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                isActive ? filter.activeColor : filter.color
              } hover:opacity-80`}
            >
              {filter.label}
              {isActive && (
                <span className="ml-1 font-bold">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile/Tablet View - Dropdown */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-50 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          style={{ width: '50px' }}
        >
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-blue-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-64 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg left-0">
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter) => {
                  const isActive = filters[filter.key as keyof typeof filters].includes(filter.value);
                  
                  return (
                    <button
                      key={`${filter.key}-${filter.value}`}
                      onClick={() => {
                        toggleQuickFilter(filter.key, filter.value);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isActive ? filter.activeColor : filter.color
                      } hover:opacity-80`}
                    >
                      {filter.label}
                      {isActive && (
                        <span className="ml-1 font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Clear All Button */}
              {activeFilterCount > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setFilters({ priority: [], tags: [], assignees: [], status: [] });
                      setIsOpen(false);
                    }}
                    className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 lg:hidden bg-transparent" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
