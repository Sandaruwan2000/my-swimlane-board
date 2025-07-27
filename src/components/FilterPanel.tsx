'use client';

import { useState, useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const { tasks, filters, setFilters, clearFilters } = useTaskStore();
  const [localFilters, setLocalFilters] = useState(filters);

  // Extract unique values from tasks
  const [uniqueValues, setUniqueValues] = useState({
    priorities: [] as string[],
    tags: [] as string[],
    assignees: [] as string[],
    statuses: [] as string[],
  });

  useEffect(() => {
    const priorities = [...new Set(tasks.map(task => task.priority))];
    const tags = [...new Set(tasks.flatMap(task => task.tags))];
    const assignees = [...new Set(tasks.flatMap(task => task.assignees))];
    const statuses = [...new Set(tasks.map(task => task.status))];

    setUniqueValues({
      priorities,
      tags,
      assignees,
      statuses,
    });
  }, [tasks]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (filterType: keyof typeof filters, value: string, checked: boolean) => {
    const updatedFilters = { ...localFilters };
    
    if (checked) {
      updatedFilters[filterType] = [...updatedFilters[filterType], value];
    } else {
      updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value);
    }
    
    setLocalFilters(updatedFilters);
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const resetFilters = () => {
    const emptyFilters = {
      priority: [],
      tags: [],
      assignees: [],
      status: [],
    };
    setLocalFilters(emptyFilters);
    clearFilters();
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).reduce((count, filterArray) => count + filterArray.length, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end">
      <div className="bg-white h-full w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filter Tasks</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-full pb-32">
          {/* Priority Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Priority</h3>
            <div className="space-y-2">
              {uniqueValues.priorities.map((priority) => (
                <label key={priority} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.priority.includes(priority)}
                    onChange={(e) => handleFilterChange('priority', priority, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{priority}</span>
                  <span className={`ml-auto px-2 py-1 rounded-full text-xs ${
                    priority === 'high' ? 'bg-red-100 text-red-600' :
                    priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {tasks.filter(task => task.priority === priority).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Status</h3>
            <div className="space-y-2">
              {uniqueValues.statuses.map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.status.includes(status)}
                    onChange={(e) => handleFilterChange('status', status, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {status.replace('-', ' ')}
                  </span>
                  <span className="ml-auto px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    {tasks.filter(task => task.status === status).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uniqueValues.tags.map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.tags.includes(tag)}
                    onChange={(e) => handleFilterChange('tags', tag, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{tag}</span>
                  <span className="ml-auto px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                    {tasks.filter(task => task.tags.includes(tag)).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Assignees Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Assignees</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uniqueValues.assignees.map((assignee) => (
                <label key={assignee} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.assignees.includes(assignee)}
                    onChange={(e) => handleFilterChange('assignees', assignee, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-2 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-xs font-medium text-green-600 mr-2">
                      {assignee.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{assignee}</span>
                  </div>
                  <span className="ml-auto px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                    {tasks.filter(task => task.assignees.includes(assignee)).length}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
            </span>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
