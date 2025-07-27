import { create } from 'zustand';

export type Task = {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'approved' | 'rejected';
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  assignees: string[];
  comments: number;
  attachments: number;
  dueDate?: string;
};

type TaskStore = {
  tasks: Task[];
  filteredTasks: Task[];
  searchQuery: string;
  filters: {
    priority: string[];
    tags: string[];
    assignees: string[];
    status: string[];
  };
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  loadTasksFromStorage: () => Task[];
  saveTasksToStorage: (tasks: Task[]) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<TaskStore['filters']>) => void;
  clearFilters: () => void;
  filterTasks: () => void;
};

const STORAGE_KEY = 'swimlane-tasks';

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  searchQuery: '',
  filters: {
    priority: [],
    tags: [],
    assignees: [],
    status: [],
  },
  
  setTasks: (tasks: Task[]) => {
    set({ tasks, filteredTasks: tasks });
    get().saveTasksToStorage(tasks);
  },
  
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    set({ tasks: updatedTasks });
    get().saveTasksToStorage(updatedTasks);
    get().filterTasks();
  },
  
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().filterTasks();
  },
  
  setFilters: (newFilters: Partial<TaskStore['filters']>) => {
    const currentFilters = get().filters;
    set({ filters: { ...currentFilters, ...newFilters } });
    get().filterTasks();
  },
  
  clearFilters: () => {
    set({ 
      filters: {
        priority: [],
        tags: [],
        assignees: [],
        status: [],
      },
      searchQuery: ''
    });
    get().filterTasks();
  },
  
  filterTasks: () => {
    const { tasks, searchQuery, filters } = get();
    let filtered = [...tasks];
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        task.assignees.some(assignee => assignee.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }
    
    // Apply tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(task => 
        task.tags.some(tag => filters.tags.includes(tag))
      );
    }
    
    // Apply assignees filter
    if (filters.assignees.length > 0) {
      filtered = filtered.filter(task => 
        task.assignees.some(assignee => filters.assignees.includes(assignee))
      );
    }
    
    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }
    
    set({ filteredTasks: filtered });
  },
  
  loadTasksFromStorage: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedTasks = JSON.parse(stored);
          set({ tasks: parsedTasks, filteredTasks: parsedTasks });
          return parsedTasks;
        } catch (error) {
          console.error('Error parsing stored tasks:', error);
        }
      }
    }
    return [];
  },
  
  saveTasksToStorage: (tasks: Task[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  },
}));
