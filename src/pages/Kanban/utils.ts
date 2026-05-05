import { KanbanData, Task, TaskStatus } from './types';

const STORAGE_KEY = 'kanban_tasks';

export const initialData: KanbanData = {
  tasks: {},
  columns: {
    Todo: {
      id: 'Todo',
      title: 'Cần làm',
      taskIds: [],
    },
    InProgress: {
      id: 'InProgress',
      title: 'Đang làm',
      taskIds: [],
    },
    Done: {
      id: 'Done',
      title: 'Hoàn thành',
      taskIds: [],
    },
  },
  columnOrder: ['Todo', 'InProgress', 'Done'],
};

export const loadData = (): KanbanData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse kanban data', e);
    }
  }
  return initialData;
};

export const saveData = (data: KanbanData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case 'Todo':
      return 'Cần làm';
    case 'InProgress':
      return 'Đang làm';
    case 'Done':
      return 'Hoàn thành';
    default:
      return status;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'orange';
    case 'Low':
      return 'blue';
    default:
      return 'default';
  }
};
