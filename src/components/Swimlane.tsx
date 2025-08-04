import { useState } from 'react';
import { Task, useTaskStore } from '@/store/taskStore';
import TaskCard from './TaskCard';

interface SwimlaneProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onTaskDrop?: (taskId: string, newStatus: Task['status']) => void;
}

export default function Swimlane({ status, tasks, onTaskDrop }: SwimlaneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { filters, clearFilters } = useTaskStore();
  
  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onTaskDrop) {
      onTaskDrop(taskId, status);
    }
  };

  const handleTaskDragStart = () => {
    // Additional logic can be added here if needed
  };

  const handleApplyFilters = () => {
    // Filters are already applied in real-time through the store
    // This can be used for additional actions if needed
    console.log('Filters applied:', filters);
  };

  const handleCancelFilters = () => {
    clearFilters();
  };

  return (
    <div className="w-full">
      <div 
        className={`bg-gray-50 p-3 rounded-lg min-h-[300px] sm:min-h-[400px] transition-all duration-200 ${
          isDragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : 'border-2 border-transparent'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Filter Control Buttons - Show when filters are active */}
        {hasActiveFilters && (
          <div className="mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                <span className="text-xs md:text-sm font-medium text-blue-700">Filters Active</span>
              </div>
              <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 sm:flex-none px-2 md:px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors min-w-0"
                >
                  Apply
                </button>
                <button
                  onClick={handleCancelFilters}
                  className="flex-1 sm:flex-none px-2 md:px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors min-w-0"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            {/* Active Filter Tags - Responsive Layout */}
            <div className="flex flex-wrap gap-1">
              {filters.priority.map(priority => (
                <span key={priority} className="px-1.5 md:px-2 py-0.5 md:py-1 text-xs bg-red-100 text-red-700 rounded-full whitespace-nowrap">
                  <span className="hidden md:inline">Priority: </span>{priority}
                </span>
              ))}
              {filters.status.map(statusFilter => (
                <span key={statusFilter} className="px-1.5 md:px-2 py-0.5 md:py-1 text-xs bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                  <span className="hidden md:inline">Status: </span>{statusFilter}
                </span>
              ))}
              {filters.tags.map(tag => (
                <span key={tag} className="px-1.5 md:px-2 py-0.5 md:py-1 text-xs bg-green-100 text-green-700 rounded-full whitespace-nowrap">
                  <span className="hidden md:inline">Tag: </span>{tag}
                </span>
              ))}
              {filters.assignees.map(assignee => (
                <span key={assignee} className="px-1.5 md:px-2 py-0.5 md:py-1 text-xs bg-purple-100 text-purple-700 rounded-full whitespace-nowrap">
                  <span className="hidden md:inline">Assignee: </span>{assignee}
                </span>
              ))}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <div className="p-4">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-sm">Drop tasks here</p>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDragStart={handleTaskDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
