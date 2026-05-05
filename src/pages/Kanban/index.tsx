import { PlusOutlined } from '@ant-design/icons';
import { Button, message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { TabViewPage } from '@/components/TabViewPage';
import Board from './Board';
import Dashboard from './Dashboard';
import TaskForm from './TaskForm';
import TaskTable from './TaskTable';
import { KanbanData, Task, TaskStatus } from './types';
import { loadData, saveData } from './utils';

const KanbanPage: React.FC = () => {
  const [data, setData] = useState<KanbanData>(loadData());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('Todo');

  useEffect(() => {
    saveData(data);
  }, [data]);

  const tasksArray = Object.values(data.tasks);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = data.columns[source.droppableId as TaskStatus];
    const finishColumn = data.columns[destination.droppableId as TaskStatus];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    // Moving from one column to another
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    // Update task status
    const updatedTask = {
      ...data.tasks[draggableId],
      status: destination.droppableId as TaskStatus,
    };

    const newState = {
      ...data,
      tasks: {
        ...data.tasks,
        [draggableId]: updatedTask,
      },
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);
    message.success(`Đã cập nhật trạng thái công việc: ${updatedTask.title}`);
  };

  const handleAddTask = (status: TaskStatus = 'Todo') => {
    setEditingTask(undefined);
    setDefaultStatus(status);
    setIsModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const task = data.tasks[taskId];
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    const column = data.columns[task.status];
    const newTaskIds = column.taskIds.filter((id) => id !== taskId);
    const newColumn = { ...column, taskIds: newTaskIds };

    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [column.id]: newColumn,
      },
    });
    message.success('Đã xóa công việc');
  };

  const handleFormSubmit = (values: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      const updatedTask: Task = {
        ...editingTask,
        ...values,
      } as Task;

      // Check if status changed
      if (values.status && values.status !== editingTask.status) {
        // Status changed via form (if I add status field to form)
        // For now status is handled via drag or default
      }

      setData({
        ...data,
        tasks: {
          ...data.tasks,
          [updatedTask.id]: updatedTask,
        },
      });
      message.success('Đã cập nhật công việc');
    } else {
      // Create new task
      const newTaskId = `task-${Date.now()}`;
      const newTask: Task = {
        id: newTaskId,
        title: values.title!,
        description: values.description,
        deadline: values.deadline!,
        priority: values.priority!,
        tags: values.tags || [],
        status: defaultStatus,
        createdAt: new Date().toISOString(),
      };

      const column = data.columns[defaultStatus];
      const newTaskIds = [...column.taskIds, newTaskId];

      setData({
        ...data,
        tasks: {
          ...data.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...data.columns,
          [column.id]: {
            ...column,
            taskIds: newTaskIds,
          },
        },
      });
      message.success('Đã thêm công việc mới');
    }
    setIsModalVisible(false);
  };

  const menu = [
    {
      title: 'Bảng điều khiển',
      menuKey: 'dashboard',
      content: <Dashboard tasks={tasksArray} />,
    },
    {
      title: 'Bảng Kanban',
      menuKey: 'board',
      content: (
        <Board
          data={data}
          onDragEnd={handleDragEnd}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onAddTask={handleAddTask}
        />
      ),
    },
    {
      title: 'Danh sách công việc',
      menuKey: 'list',
      content: (
        <TaskTable
          tasks={tasksArray}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      ),
    },
  ];

  return (
    <>
      <TabViewPage
        menu={menu}
        cardTitle="Quản lý công việc (Kanban)"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddTask()}>
            Thêm công việc
          </Button>
        }
      />
      <TaskForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleFormSubmit}
        initialValues={editingTask}
      />
    </>
  );
};

export default KanbanPage;
