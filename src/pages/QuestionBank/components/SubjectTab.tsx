import React, { useState } from 'react';
import { Table, Button, Form, Input, Modal, Space, Popconfirm, InputNumber } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const SubjectTab: React.FC = () => {
    const { subjects, addSubject, updateSubject, deleteSubject } = useModel('questionBank');
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCode, setEditingCode] = useState<string | null>(null);

    const handleEdit = (record: any) => {
        setEditingCode(record.subjectCode);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            if (editingCode) updateSubject(editingCode, values);
            else addSubject(values);
            setIsModalVisible(false);
            form.resetFields();
            setEditingCode(null);
        });
    };

    const columns: ColumnsType<any> = [
        { title: 'Mã môn học', dataIndex: 'subjectCode', key: 'subjectCode' },
        { title: 'Tên môn học', dataIndex: 'subjectName', key: 'subjectName' },
        { title: 'Số tín chỉ', dataIndex: 'credits', key: 'credits' },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => deleteSubject(record.subjectCode)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCode(null); form.resetFields(); setIsModalVisible(true); }}>
                    Thêm môn học
                </Button>
            </div>
            <Table columns={columns} dataSource={subjects} rowKey="subjectCode" pagination={{ pageSize: 5 }} />

            <Modal title={editingCode ? "Sửa môn học" : "Thêm môn học"} visible={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} destroyOnClose>
                <Form form={form} layout="vertical">
                    <Form.Item name="subjectCode" label="Mã môn học" rules={[{ required: true }]}>
                        <Input disabled={!!editingCode} />
                    </Form.Item>
                    <Form.Item name="subjectName" label="Tên môn học" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="credits" label="Số tín chỉ" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SubjectTab;
