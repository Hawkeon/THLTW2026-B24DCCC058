import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Button, Modal, Form, Input, DatePicker, InputNumber, Table, Typography, Tag, Progress, Popconfirm, message, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

interface Topic {
    id: string;
    name: string;
    color: string;
}

interface StudyLog {
    id: string;
    topicId: string;
    date: string;
    timeInMinutes: number;
    whatILearned: string;
    extraNotes?: string;
}

interface MonthTarget {
    monthAndYear: string;
    hoursWanted: number;
}

const SAVE_NAMES = {
    TOPICS: 'study_tracker_topics',
    LOGS: 'study_tracker_logs',
    TARGETS: 'study_tracker_targets'
};

const StudyTracker: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
    const [monthTargets, setMonthTargets] = useState<MonthTarget[]>([]);

    const [isOpenTopicBox, setIsOpenTopicBox] = useState(false);
    const [isOpenLogBox, setIsOpenLogBox] = useState(false);

    const [topicForm] = Form.useForm();
    const [logForm] = Form.useForm();

    useEffect(() => {
        const savedTopics = localStorage.getItem(SAVE_NAMES.TOPICS);
        const savedLogs = localStorage.getItem(SAVE_NAMES.LOGS);
        const savedTargets = localStorage.getItem(SAVE_NAMES.TARGETS);

        if (savedTopics) setTopics(JSON.parse(savedTopics));
        if (savedLogs) setStudyLogs(JSON.parse(savedLogs));
        if (savedTargets) setMonthTargets(JSON.parse(savedTargets));
    }, []);

    useEffect(() => {
        localStorage.setItem(SAVE_NAMES.TOPICS, JSON.stringify(topics));
    }, [topics]);

    useEffect(() => {
        localStorage.setItem(SAVE_NAMES.LOGS, JSON.stringify(studyLogs));
    }, [studyLogs]);

    useEffect(() => {
        localStorage.setItem(SAVE_NAMES.TARGETS, JSON.stringify(monthTargets));
    }, [monthTargets]);

    const addTopic = (values: any) => {
        const newTopic: Topic = {
            id: Date.now().toString(),
            name: values.name,
            color: values.color || '#1890ff',
        };
        setTopics([...topics, newTopic]);
        setIsOpenTopicBox(false);
        topicForm.resetFields();
        message.success('Đã thêm môn học thành công');
    };

    const deleteTopic = (id: string) => {
        setTopics(topics.filter(t => t.id !== id));
        setStudyLogs(studyLogs.filter(l => l.topicId !== id));
        message.success('Đã xóa môn học');
    };

    const addStudyLog = (values: any) => {
        const newLog: StudyLog = {
            id: Date.now().toString(),
            topicId: values.topicId,
            date: values.date.format('YYYY-MM-DD'),
            timeInMinutes: values.timeInMinutes,
            whatILearned: values.whatILearned,
            extraNotes: values.extraNotes,
        };
        setStudyLogs([...studyLogs, newLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setIsOpenLogBox(false);
        logForm.resetFields();
        message.success('Đã ghi nhận phiên học');
    };

    const deleteStudyLog = (id: string) => {
        setStudyLogs(studyLogs.filter(l => l.id !== id));
        message.success('Đã xóa phiên học');
    };

    const thisMonth = moment().format('YYYY-MM');
    const logsThisMonth = studyLogs.filter(l => l.date.startsWith(thisMonth));
    const totalMinutes = logsThisMonth.reduce((sum, l) => sum + l.timeInMinutes, 0);
    const totalHours = +(totalMinutes / 60).toFixed(1);

    const targetThisMonth = monthTargets.find(t => t.monthAndYear === thisMonth)?.hoursWanted || 50;

    const changeTarget = (val: number | null) => {
        if (!val) return;
        const newTargets = [...monthTargets.filter(t => t.monthAndYear !== thisMonth), { monthAndYear: thisMonth, hoursWanted: val }];
        setMonthTargets(newTargets);
    };

    const topicTableColumns = [
        {
            title: 'Môn Học',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Topic) => (
                <Tag color={record.color}>{text}</Tag>
            )
        },
        {
            title: 'Tổng Thời Gian (Giờ)',
            key: 'totalTime',
            render: (_: any, record: Topic) => {
                const totalMins = studyLogs.filter(l => l.topicId === record.id).reduce((sum, l) => sum + l.timeInMinutes, 0);
                return (totalMins / 60).toFixed(1);
            }
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_: any, record: Topic) => (
                <Popconfirm
                    title="Xóa môn học sẽ xóa toàn bộ phiên học liên quan. Bạn chắc chứ?"
                    onConfirm={() => deleteTopic(record.id)}
                >
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            )
        }
    ];

    const logTableColumns = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            render: (text: string) => moment(text).format('DD/MM/YYYY')
        },
        {
            title: 'Môn Học',
            dataIndex: 'topicId',
            key: 'topicId',
            render: (id: string) => {
                const topicItem = topics.find(t => t.id === id);
                return topicItem ? <Tag color={topicItem.color}>{topicItem.name}</Tag> : <Tag>Đã xóa</Tag>;
            }
        },
        {
            title: 'Thời Gian (phút)',
            dataIndex: 'timeInMinutes',
            key: 'timeInMinutes',
        },
        {
            title: 'Nội Dung',
            dataIndex: 'whatILearned',
            key: 'whatILearned',
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_: any, record: StudyLog) => (
                <Popconfirm title="Xóa phiên học này?" onConfirm={() => deleteStudyLog(record.id)}>
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            )
        }
    ];

    return (
        <PageContainer title="Study Tracker">
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card title="Tiến Độ Tháng Này">
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Progress
                                type="dashboard"
                                percent={Math.min(100, Math.round((totalHours / targetThisMonth) * 100))}
                                format={() => `${totalHours}h / ${targetThisMonth}h`}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>Mục tiêu tháng (Giờ):</Text>
                            <InputNumber
                                min={1}
                                value={targetThisMonth}
                                onChange={changeTarget}
                                size="small"
                            />
                        </div>
                    </Card>

                    <Card title="Quản Lý Môn Học" style={{ marginTop: 16 }} extra={<Button type="link" onClick={() => setIsOpenTopicBox(true)}><PlusOutlined /> Thêm</Button>}>
                        <Table
                            dataSource={topics}
                            columns={topicTableColumns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card
                        title="Lịch Sử Học Tập"
                        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsOpenLogBox(true)}>Ghi Nhận Phiên Học</Button>}
                    >
                        <Table
                            dataSource={studyLogs}
                            columns={logTableColumns}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Thêm Môn Học Mới"
                visible={isOpenTopicBox}
                onCancel={() => setIsOpenTopicBox(false)}
                onOk={() => topicForm.submit()}
                destroyOnClose
            >
                <Form form={topicForm} layout="vertical" onFinish={addTopic}>
                    <Form.Item name="name" label="Tên Môn Học" rules={[{ required: true, message: 'Nhập tên môn học' }]}>
                        <Input placeholder="Ví dụ: Toán Cao Cấp" />
                    </Form.Item>
                    <Form.Item name="color" label="Màu Nhãn (Hex Code)" initialValue="#1890ff">
                        <Input type="color" style={{ width: 100, padding: 0 }} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Ghi Nhận Học Tập"
                visible={isOpenLogBox}
                onCancel={() => setIsOpenLogBox(false)}
                onOk={() => logForm.submit()}
                destroyOnClose
            >
                <Form form={logForm} layout="vertical" onFinish={addStudyLog} initialValues={{ date: moment() }}>
                    <Form.Item name="topicId" label="Môn Học" rules={[{ required: true, message: 'Chọn môn học' }]}>
                        <Select placeholder="-- Chọn Môn Học --" style={{ width: '100%' }}>
                            {topics.map(t => <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item name="timeInMinutes" label="Thời Gian (Phút)" rules={[{ required: true, message: 'Nhập thời gian học' }]}>
                        <InputNumber min={5} step={5} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="whatILearned" label="Nội Dung Đã Học" rules={[{ required: true, message: 'Nhập nội dung' }]}>
                        <Input.TextArea placeholder="Ví dụ: Đọc chương 1, làm bài tập 1-5" />
                    </Form.Item>
                    <Form.Item name="extraNotes" label="Ghi Chú Thêm (Tùy Chọn)">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </PageContainer>
    );
};

export default StudyTracker;
