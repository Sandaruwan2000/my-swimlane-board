'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useTaskStore } from '@/store/taskStore';
import Swimlane from '@/components/Swimlane';
import FilterPanel from '@/components/FilterPanel';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const { filteredTasks, setTasks, updateTaskStatus, loadTasksFromStorage } = useTaskStore();

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

  const statuses = [
    { label: 'To Do', value: 'todo' as const },
    { label: 'In Progress', value: 'in-progress' as const },
    { label: 'Approved', value: 'approved' as const },
    { label: 'Reject', value: 'rejected' as const }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {!sidebarOpen && (
                <button
                  onClick={toggleSidebar}
                  className="mr-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Open sidebar"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  </svg>
                </button>
              )}
              <h1 className="text-2xl font-bold text-gray-800">Sport XI Project</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
                Back to Home
              </Link>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Add New Task
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Swimlane Board */}
            <div className="flex gap-4 overflow-x-auto">
              {statuses.map((status) => (
                <Swimlane
                  key={status.value}
                  title={status.label}
                  status={status.value}
                  tasks={filteredTasks.filter((task) => task.status === status.value)}
                  onTaskDrop={handleTaskDrop}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Filter Panel */}
      <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
