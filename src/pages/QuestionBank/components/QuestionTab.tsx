import React, { useState, useMemo } from 'react';
import { Table, Button, Form, Input, Modal, Space, Popconfirm, Select, Row, Col, Tag } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { DifficultyLevel } from '@/models/questionBank';

const { Option } = Select;

const difficulties: DifficultyLevel[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const QuestionTab: React.FC = () => {
    const { questions, addQuestion, updateQuestion, deleteQuestion, subjects, categories } = useModel('questionBank');
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Filters
    const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    const filteredQuestions = useMemo(() => {
        return questions.filter((q: any) => {
            if (subjectFilter && q.subject !== subjectFilter) return false;
            if (difficultyFilter && q.difficultyLevel !== difficultyFilter) return false;
            if (categoryFilter && q.knowledgeCategory !== categoryFilter) return false;
            return true;
        });
    }, [questions, subjectFilter, difficultyFilter, categoryFilter]);

    const handleEdit = (record: any) => {
        setEditingId(record.questionId);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            if (editingId) updateQuestion(editingId, values);
            else addQuestion(values);
            setIsModalVisible(false);
            form.resetFields();
            setEditingId(null);
        });
    };

    const getDifficultyColor = (level: DifficultyLevel) => {
        switch (level) {
            case 'Dễ': return 'green';
            case 'Trung bình': return 'blue';
            case 'Khó': return 'orange';
            case 'Rất khó': return 'red';
            default: return 'default';
        }
    };

    const columns: ColumnsType<any> = [
        { title: 'Nội dung', dataIndex: 'questionContent', key: 'questionContent', width: '40%' },
        {
            title: 'Môn học',
            key: 'subject',
            render: (_, record: any) => subjects.find((s: any) => s.subjectCode === record.subject)?.subjectName || record.subject
        },
        {
            title: 'Danh mục',
            key: 'knowledgeCategory',
            render: (_, record: any) => categories.find((c: any) => c.id === record.knowledgeCategory)?.name || record.knowledgeCategory
        },
        {
            title: 'Độ khó',
            key: 'difficultyLevel',
            render: (_, record) => <Tag color={getDifficultyColor(record.difficultyLevel)}>{record.difficultyLevel}</Tag>
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => deleteQuestion(record.questionId)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <Select placeholder="Lọc theo môn" allowClear style={{ width: '100%' }} onChange={setSubjectFilter}>
                        {subjects.map((s: any) => <Option key={s.subjectCode} value={s.subjectCode}>{s.subjectName}</Option>)}
                    </Select>
                </Col>
                <Col span={6}>
                    <Select placeholder="Lọc theo danh mục" allowClear style={{ width: '100%' }} onChange={setCategoryFilter}>
                        {categories.map((c: any) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                    </Select>
                </Col>
                <Col span={6}>
                    <Select placeholder="Lọc theo độ khó" allowClear style={{ width: '100%' }} onChange={setDifficultyFilter}>
                        {difficulties.map((d: any) => <Option key={d} value={d}>{d}</Option>)}
                    </Select>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setIsModalVisible(true); }}>
                        Thêm câu hỏi
                    </Button>
                </Col>
            </Row>

            <Table columns={columns} dataSource={filteredQuestions} rowKey="questionId" pagination={{ pageSize: 5 }} />

            <Modal title={editingId ? "Sửa câu hỏi" : "Thêm câu hỏi"} visible={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} destroyOnClose>
                <Form form={form} layout="vertical">
                    <Form.Item name="questionContent" label="Nội dung câu hỏi" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="subject" label="Môn học" rules={[{ required: true }]}>
                        <Select>
                            {subjects.map((s: any) => <Option key={s.subjectCode} value={s.subjectCode}>{s.subjectName}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="knowledgeCategory" label="Danh mục kiến thức" rules={[{ required: true }]}>
                        <Select>
                            {categories.map((c: any) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="difficultyLevel" label="Độ khó" rules={[{ required: true }]}>
                        <Select>
                            {difficulties.map((d: any) => <Option key={d} value={d}>{d}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuestionTab;
