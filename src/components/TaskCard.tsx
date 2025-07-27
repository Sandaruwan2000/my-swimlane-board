import { Task } from '@/store/taskStore';

interface TaskCardProps {
  task: Task;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}

export default function TaskCard({ task, onDragStart }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image for better UX
    const target = e.target as HTMLElement;
    const dragImage = target.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    dragImage.style.backgroundColor = '#f3f4f6';
    
    // Add visual feedback
    target.style.opacity = '0.5';
    target.style.transform = 'scale(0.95)';
    
    if (onDragStart) {
      onDragStart(e, task);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset visual feedback
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    target.style.transform = 'scale(1)';
  };

  return (
    <div 
      className="relative bg-white shadow-sm p-3 sm:p-4 lg:p-5 rounded-lg border border-gray-100 cursor-move hover:shadow-lg transition-all duration-200 group hover:border-blue-200 hover:-translate-y-1"
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Priority and Tag - Responsive Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
        <div className="flex flex-wrap gap-1">
          {task.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="capitalize text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="text-gray-500 bg-gray-50 px-2 py-1 rounded text-xs">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      {/* Task Title - Responsive Typography */}
      <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
        {task.title}
      </h3>
      
      {/* Task Meta Info - Responsive Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-400">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">{task.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">{task.attachments}</span>
          </div>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1 text-orange-500 mt-1 sm:mt-0">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs whitespace-nowrap">{task.dueDate}</span>
          </div>
        )}
      </div>
      
      {/* Assignees - Enhanced Responsive Design */}
      {task.assignees && task.assignees.length > 0 && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {task.assignees.slice(0, 3).map((assignee, index) => (
                <div 
                  key={index}
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white flex items-center justify-center text-xs sm:text-sm font-medium text-blue-700 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  title={assignee}
                >
                  {assignee.charAt(0).toUpperCase()}
                </div>
              ))}
              {task.assignees.length > 3 && (
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600 shadow-sm">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 hidden sm:block">
              {task.assignees.length} assigned
            </span>
          </div>
          
          {/* Drag Handle - Responsive Visibility */}
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Status Indicator - New Responsive Element */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
}
