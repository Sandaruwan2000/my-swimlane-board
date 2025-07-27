'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useTaskStore } from '@/store/taskStore';
import Swimlane from '@/components/Swimlane';
import FilterPanel from '@/components/FilterPanel';
import QuickFilters from '@/components/QuickFilters';

export default function TaskPage() {
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

                <button 
                  onClick={() => setFilterOpen(true)}
                  className={`hidden sm:flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm relative ${
                    getActiveFilterCount() > 0 ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
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
                {hasActiveFilters && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      clearFilters();
                    }}
                    className="text-blue-600 hover:text-blue-700 underline text-sm"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
              
              {/* Active Filters Display */}
              {getActiveFilterCount() > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {filters.priority.map(priority => (
                    <span key={`priority-${priority}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      Priority: {priority}
                      <button 
                        onClick={() => {
                          const updatedFilters = { ...filters };
                          updatedFilters.priority = updatedFilters.priority.filter(p => p !== priority);
                          setFilters(updatedFilters);
                        }}
                        className="ml-1 hover:text-red-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.status.map(status => (
                    <span key={`status-${status}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      Status: {status.replace('-', ' ')}
                      <button 
                        onClick={() => {
                          const updatedFilters = { ...filters };
                          updatedFilters.status = updatedFilters.status.filter(s => s !== status);
                          setFilters(updatedFilters);
                        }}
                        className="ml-1 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.tags.map(tag => (
                    <span key={`tag-${tag}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      Tag: {tag}
                      <button 
                        onClick={() => {
                          const updatedFilters = { ...filters };
                          updatedFilters.tags = updatedFilters.tags.filter(t => t !== tag);
                          setFilters(updatedFilters);
                        }}
                        className="ml-1 hover:text-green-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.assignees.map(assignee => (
                    <span key={`assignee-${assignee}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                      Assignee: {assignee}
                      <button 
                        onClick={() => {
                          const updatedFilters = { ...filters };
                          updatedFilters.assignees = updatedFilters.assignees.filter(a => a !== assignee);
                          setFilters(updatedFilters);
                        }}
                        className="ml-1 hover:text-purple-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 space-y-6">
          <div className="max-w-7xl mx-auto">
            {/* Quick Filters */}
            <QuickFilters />
            
            {/* Quick Stats Overview - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{totalTasks}</p>
                    <p className="text-xs text-green-600 mt-1">
                      <span className="inline-flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        +12%
                      </span>
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">To Do</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{todoTasks}</p>
                    <p className="text-xs text-gray-500 mt-1">Pending</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{inProgressTasks}</p>
                    <p className="text-xs text-blue-600 mt-1">Active</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{approvedTasks + rejectedTasks}</p>
                    <p className="text-xs text-green-600 mt-1">
                      <span className="inline-flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        +8%
                      </span>
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanban Board - Responsive */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Project Kanban Board</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Drag and drop tasks between different stages</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden sm:inline">This Week</span>
                    </button>
                    <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                {/* Mobile: Stack swimlanes vertically, Desktop: Horizontal scroll */}
                <div className="flex flex-col sm:flex-row sm:gap-6 sm:overflow-x-auto sm:pb-4 space-y-6 sm:space-y-0">
                  {statuses.map((status) => (
                    <div key={status.value} className="sm:min-w-80 sm:flex-shrink-0">
                      <div className={`rounded-lg border-2 border-dashed ${status.color} p-4`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-semibold ${status.textColor}`}>{status.label}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${status.color} ${status.textColor}`}>
                              {filteredTasks.filter((task) => task.status === status.value).length}
                            </span>
                          </div>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                        
                        <Swimlane
                          title={status.label}
                          status={status.value as any}
                          tasks={filteredTasks.filter((task) => task.status === status.value)}
                          onTaskDrop={handleTaskDrop}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Activity Footer */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Recent Activity</h4>
                  <p className="text-sm text-gray-500">Latest updates from your team</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Activity
                </button>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">John Doe</span> created a new task "User Authentication"
                    </p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Sarah Wilson</span> completed "Database Design"
                    </p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Filter Panel */}
      <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
