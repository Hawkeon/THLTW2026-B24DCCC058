import React, { useState } from 'react';
import { Table, Button, Form, Input, Modal, Space, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const CategoryTab: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useModel('questionBank');
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleEdit = (record: any) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            if (editingId) updateCategory(editingId, values);
            else addCategory(values);
            setIsModalVisible(false);
            form.resetFields();
            setEditingId(null);
        });
    };

    const columns: ColumnsType<any> = [
        { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => deleteCategory(record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setIsModalVisible(true); }}>
                    Thêm danh mục
                </Button>
            </div>
            <Table columns={columns} dataSource={categories} rowKey="id" pagination={{ pageSize: 5 }} />

            <Modal title={editingId ? "Sửa danh mục" : "Thêm danh mục"} visible={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} destroyOnClose>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryTab;
