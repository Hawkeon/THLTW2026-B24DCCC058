export type Priority = 'High' | 'Medium' | 'Low';

export type TaskStatus = 'Todo' | 'InProgress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  priority: Priority;
  tags: string[];
  status: TaskStatus;
  createdAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  taskIds: string[];
}

export interface KanbanData {
  tasks: Record<string, Task>;
  columns: Record<TaskStatus, Column>;
  columnOrder: TaskStatus[];
}
