import { Card, Col, Row, Statistic } from 'antd';
import moment from 'moment';
import React from 'react';
import { Task } from './types';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const overdueTasks = tasks.filter((t) => {
    const isOverdue = moment(t.deadline).isBefore(moment(), 'day');
    return isOverdue && t.status !== 'Done';
  }).length;

  return (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={16}>
        <Col span={8} xs={24} sm={8}>
          <Card shadow="sm">
            <Statistic
              title="Tổng số công việc"
              value={totalTasks}
              valueStyle={{ color: '#3f51b5' }}
            />
          </Card>
        </Col>
        <Col span={8} xs={24} sm={8}>
          <Card shadow="sm">
            <Statistic
              title="Công việc đã hoàn thành"
              value={completedTasks}
              valueStyle={{ color: '#3fcf8e' }}
            />
          </Card>
        </Col>
        <Col span={8} xs={24} sm={8}>
          <Card shadow="sm">
            <Statistic
              title="Công việc quá hạn"
              value={overdueTasks}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
