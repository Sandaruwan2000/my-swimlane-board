'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useTaskStore } from '@/store/taskStore';
import Swimlane from '@/components/Swimlane';
import FilterPanel from '@/components/FilterPanel';
import QuickFilters from '@/components/QuickFilters';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const { 
    tasks, 
    filteredTasks, 
    searchQuery, 
    filters,
    setTasks, 
    updateTaskStatus, 
    loadTasksFromStorage, 
    setSearchQuery,
    setFilters,
    clearFilters
  } = useTaskStore();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        // First try to load from localStorage
        const storedTasks = loadTasksFromStorage();
        
        if (storedTasks.length === 0) {
          // If no stored tasks, load from API
          const res = await fetch('/tasks.json');
          const data = await res.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    
    loadTasks();
  }, [setTasks, loadTasksFromStorage]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTaskDrop = (taskId: string, newStatus: 'todo' | 'in-progress' | 'approved' | 'rejected') => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  };

  const hasActiveFilters = getActiveFilterCount() > 0 || searchQuery.trim() !== '';

  const statuses = [
    { label: 'To Do', value: 'todo', color: 'bg-slate-100 border-slate-200', textColor: 'text-slate-700' },
    { label: 'In Progress', value: 'in-progress', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
    { label: 'Review', value: 'approved', color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-700' },
    { label: 'Done', value: 'rejected', color: 'bg-green-50 border-green-200', textColor: 'text-green-700' }
  ];

  // Calculate task statistics using filtered tasks
  const totalTasks = filteredTasks.length;
  const todoTasks = filteredTasks.filter(task => task.status === 'todo').length;
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress').length;
  const approvedTasks = filteredTasks.filter(task => task.status === 'approved').length;
  const rejectedTasks = filteredTasks.filter(task => task.status === 'rejected').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Modern Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-4">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Open sidebar"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Task Board</h1>
                <p className="text-xs sm:text-sm text-gray-500">Manage your team's workflow efficiently</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setFilterOpen(true)}
                  className={`sm:hidden flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm relative ${
                    getActiveFilterCount() > 0 ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {getActiveFilterCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </button>
                
                <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Add Task</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Search Results Info */}
          {hasActiveFilters && (
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found {totalTasks} task{totalTasks !== 1 ? 's' : ''} 
                  {searchQuery && ` matching "${searchQuery}"`}
                  {getActiveFilterCount() > 0 && ` with ${getActiveFilterCount()} filter${getActiveFilterCount() !== 1 ? 's' : ''} applied`}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    clearFilters();
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Filters */}
        <div className="px-4 sm:px-6 py-4">
          <QuickFilters />
        </div>

        {/* Task Statistics */}
        <div className="px-4 sm:px-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">To Do</p>
                  <p className="text-2xl font-bold text-slate-700">{todoTasks}</p>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-700">{inProgressTasks}</p>
                </div>
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Review</p>
                  <p className="text-2xl font-bold text-yellow-700">{approvedTasks}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Done</p>
                  <p className="text-2xl font-bold text-green-700">{rejectedTasks}</p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swimlanes */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {statuses.map((status) => (
              <Swimlane
                key={status.value}
                title={status.label}
                status={status.value as 'todo' | 'in-progress' | 'approved' | 'rejected'}
                tasks={filteredTasks.filter(task => task.status === status.value)}
                onTaskDrop={handleTaskDrop}
              />
            ))}
          </div>
        </div>

        {/* Filter Panel (Mobile) */}
        <FilterPanel 
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />
      </div>
    </div>
  );
}
