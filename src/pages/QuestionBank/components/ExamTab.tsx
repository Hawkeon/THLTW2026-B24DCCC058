import React, { useState } from 'react';
import { Table, Button, Form, Input, Modal, Space, Popconfirm, Select, InputNumber, Row, Col, message, Card, Typography, Divider } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined, DeleteOutlined, SettingOutlined, EyeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { DifficultyLevel, ExamTemplateRequirement } from '@/models/questionBank';
import moment from 'moment';

const { Option } = Select;
const { Text } = Typography;

const difficulties: DifficultyLevel[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const ExamTab: React.FC = () => {
    const { templates, addTemplate, deleteTemplate, exams, generateExam, deleteExam, subjects, categories } = useModel('questionBank');
    const [form] = Form.useForm();

    const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
    const [isGenerateModalVisible, setIsGenerateModalVisible] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

    const [viewExam, setViewExam] = useState<any | null>(null);

    const handleTemplateOk = () => {
        form.validateFields().then((values) => {
            // Validate requirements
            if (!values.requirements || values.requirements.length === 0) {
                message.error('Vui lòng thêm ít nhất 1 cấu trúc câu hỏi!');
                return;
            }
            addTemplate(values);
            setIsTemplateModalVisible(false);
            form.resetFields();
        });
    };

    const handleGenerate = (values: { examName: string }) => {
        if (!selectedTemplateId) return;
        const result = generateExam(selectedTemplateId, values.examName);
        if (result.success) {
            message.success('Tạo đề thi thành công!');
            setIsGenerateModalVisible(false);
            form.resetFields();
        } else {
            message.error(result.error);
        }
    };

    const templateColumns: ColumnsType<any> = [
        { title: 'Tên cấu trúc (Template)', dataIndex: 'name', key: 'name' },
        {
            title: 'Môn học',
            key: 'subject',
            render: (_, r) => subjects.find(s => s.subjectCode === r.subjectCode)?.subjectName
        },
        {
            title: 'Cấu hình',
            key: 'reqs',
            render: (_, r) => (
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {r.requirements.map((req: ExamTemplateRequirement, i: number) => (
                        <li key={i}>{req.count} câu [{req.difficulty}] - {categories.find(c => c.id === req.categoryId)?.name}</li>
                    ))}
                </ul>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        ghost
                        icon={<PlayCircleOutlined />}
                        onClick={() => { setSelectedTemplateId(record.id); form.resetFields(); setIsGenerateModalVisible(true); }}
                    >Sinh đề</Button>
                    <Popconfirm title="Xóa cấu trúc này?" onConfirm={() => deleteTemplate(record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const examColumns: ColumnsType<any> = [
        { title: 'Tên đề thi', dataIndex: 'name', key: 'name' },
        {
            title: 'Môn học',
            key: 'subject',
            render: (_, r) => {
                const tpl = templates.find(t => t.id === r.templateId);
                return tpl ? subjects.find(s => s.subjectCode === tpl.subjectCode)?.subjectName : 'N/A';
            }
        },
        { title: 'Tổng số câu', key: 'total', render: (_, r) => r.questions.length },
        { title: 'Ngày tạo', key: 'date', render: (_, r) => moment(r.generatedAt).format('HH:mm DD/MM/YYYY') },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => setViewExam(record)}>Xem</Button>
                    <Popconfirm title="Xóa đề này?" onConfirm={() => deleteExam(record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={24}>
                <Col span={24}>
                    <Card
                        title="Cấu trúc đề thi (Templates)"
                        type="inner"
                        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setIsTemplateModalVisible(true); }}>Tạo cấu trúc mới</Button>}
                    >
                        <Table columns={templateColumns} dataSource={templates} rowKey="id" pagination={false} />
                    </Card>
                </Col>

                <Col span={24} style={{ marginTop: 24 }}>
                    <Card title="Danh sách đề đã tạo" type="inner">
                        <Table columns={examColumns} dataSource={exams} rowKey="id" />
                    </Card>
                </Col>
            </Row>

            {/* Template Modal */}
            <Modal title="Tạo cấu trúc đề thi" visible={isTemplateModalVisible} onOk={handleTemplateOk} onCancel={() => setIsTemplateModalVisible(false)} width={700} destroyOnClose>
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Tên cấu trúc" rules={[{ required: true }]}>
                                <Input placeholder="VD: Đề thi Giữa kỳ CSDL" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="subjectCode" label="Môn học" rules={[{ required: true }]}>
                                <Select>
                                    {subjects.map(s => <Option key={s.subjectCode} value={s.subjectCode}>{s.subjectName}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Thiết lập câu hỏi <SettingOutlined /></Divider>

                    <Form.List name="requirements">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'categoryId']}
                                            rules={[{ required: true, message: 'Chọn DM' }]}
                                        >
                                            <Select placeholder="Chọn danh mục" style={{ width: 200 }}>
                                                {categories.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'difficulty']}
                                            rules={[{ required: true, message: 'Chọn độ khó' }]}
                                        >
                                            <Select placeholder="Độ khó" style={{ width: 120 }}>
                                                {difficulties.map(d => <Option key={d} value={d}>{d}</Option>)}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'count']}
                                            rules={[{ required: true, message: 'Nhập số lượng' }]}
                                        >
                                            <InputNumber min={1} placeholder="Số lượng" />
                                        </Form.Item>
                                        <Button type="link" danger onClick={() => remove(name)} icon={<DeleteOutlined />} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm cấu hình câu hỏi</Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>

            {/* Generate Exam Modal */}
            <Modal title="Sinh đề thi tự động" visible={isGenerateModalVisible} onOk={() => form.submit()} onCancel={() => setIsGenerateModalVisible(false)} destroyOnClose>
                <Form form={form} layout="vertical" onFinish={handleGenerate}>
                    <Form.Item name="examName" label="Tên đề thi" rules={[{ required: true }]}>
                        <Input placeholder="VD: Đề số 1" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Exam Modal */}
            <Modal title={viewExam?.name} visible={!!viewExam} onCancel={() => setViewExam(null)} footer={[<Button onClick={() => setViewExam(null)}>Đóng</Button>]} width={800}>
                {viewExam && (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Ngày tạo: </Text> <Text>{moment(viewExam.generatedAt).format('HH:mm DD/MM/YYYY')}</Text>
                        </div>
                        {viewExam.questions.map((q: any, idx: number) => (
                            <Card size="small" style={{ marginBottom: 12 }} key={q.questionId}>
                                <Text strong>Câu {idx + 1}: </Text> <Text>{q.questionContent}</Text>
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Danh mục: {categories.find(c => c.id === q.knowledgeCategory)?.name} | Độ khó: {q.difficultyLevel}
                                    </Text>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ExamTab;
