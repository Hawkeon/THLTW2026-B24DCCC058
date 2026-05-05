import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { KanbanData, Task, TaskStatus } from './types';
import { getPriorityColor } from './utils';

const { Text } = Typography;

interface BoardProps {
  data: KanbanData;
  onDragEnd: (result: any) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

const Board: React.FC<BoardProps> = ({ data, onDragEnd, onEdit, onDelete, onAddTask }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '16px', padding: '24px 0', overflowX: 'auto', minHeight: '600px' }}>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

          return (
            <div
              key={column.id}
              style={{
                background: '#f0f2f5',
                borderRadius: '8px',
                width: '350px',
                minWidth: '300px',
                display: 'flex',
                flexDirection: 'column',
                padding: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {column.title} ({tasks.length})
                </Typography.Title>
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={() => onAddTask(column.id)}
                />
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      flexGrow: 1,
                      minHeight: '100px',
                      background: snapshot.isDraggingOver ? '#e6f7ff' : 'transparent',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            size="small"
                            style={{
                              marginBottom: '12px',
                              boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                              ...provided.draggableProps.style,
                            }}
                            actions={[
                              <EditOutlined key="edit" onClick={() => onEdit(task)} />,
                              <Popconfirm
                                key="delete"
                                title="Bạn có chắc chắn muốn xóa?"
                                onConfirm={() => onDelete(task.id)}
                              >
                                <DeleteOutlined style={{ color: '#ff4d4f' }} />
                              </Popconfirm>,
                            ]}
                          >
                            <div style={{ marginBottom: '8px' }}>
                              <Text strong>{task.title}</Text>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {task.description && task.description.length > 50
                                  ? `${task.description.substring(0, 50)}...`
                                  : task.description}
                              </Text>
                            </div>
                            <Space direction="vertical" size={4} style={{ width: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                  {moment(task.deadline).format('DD/MM/YYYY')}
                                </Text>
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {task.tags.map((tag) => (
                                  <Tag key={tag} style={{ fontSize: '10px' }}>{tag}</Tag>
                                ))}
                              </div>
                            </Space>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default Board;
