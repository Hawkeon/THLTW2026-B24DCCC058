import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Space, Tag, Popconfirm, message, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { bookingStorage, Service } from '@/utils/bookingStorage';

const { Option } = Select;

const ServiceManagement: React.FC = () => {
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        setServiceList(bookingStorage.getServices());
    }, []);

    const handleSave = (values: any) => {
        const newService: Service = {
            id: editingService ? editingService.id : Date.now().toString(),
            name: values.name,
            price: values.price,
            durationMinutes: values.durationMinutes,
            description: values.description,
            status: values.status,
        };

        const updatedList = editingService
            ? serviceList.map((s) => (s.id === editingService.id ? newService : s))
            : [...serviceList, newService];

        setServiceList(updatedList);
        bookingStorage.saveServices(updatedList);
        setIsModalVisible(false);
        form.resetFields();
        setEditingService(null);
        message.success(editingService ? 'Cập nhật dịch vụ thành công' : 'Thêm dịch vụ thành công');
    };

    const handleDelete = (id: string) => {
        const updatedList = serviceList.filter((s) => s.id !== id);
        setServiceList(updatedList);
        bookingStorage.saveServices(updatedList);
        message.success('Xóa dịch vụ thành công');
    };

    const columns = [
        { title: 'Tên dịch vụ', dataIndex: 'name', key: 'name' },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            render: (val: number) => val.toLocaleString('vi-VN') + ' đ'
        },
        { title: 'Thời lượng (phút)', dataIndex: 'durationMinutes', key: 'durationMinutes' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Service) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingService(record);
                            setIsModalVisible(true);
                            form.setFieldsValue(record);
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm title="Bạn có chắc muốn xóa dịch vụ này?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <PageContainer title="Quản lý dịch vụ">
            <Card>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingService(null);
                        setIsModalVisible(true);
                        form.resetFields();
                    }}
                    style={{ marginBottom: 16 }}
                >
                    Thêm dịch vụ
                </Button>
                <Table dataSource={serviceList} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />

                <Modal
                    title={editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
                    visible={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setEditingService(null);
                        form.resetFields();
                    }}
                    onOk={() => form.submit()}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical" onFinish={handleSave}>
                        <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true, message: 'Nhập tên dịch vụ' }]}>
                            <Input placeholder="Cắt tóc nam, Gội đầu, ..." />
                        </Form.Item>
                        <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Nhập giá' }]}>
                            <InputNumber 
                                min={0} 
                                style={{ width: '100%' }} 
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                                parser={value => (value?.replace(/\$\s?|(,*)/g, '') as any)} 
                            />
                        </Form.Item>
                        <Form.Item name="durationMinutes" label="Thời lượng (phút)" rules={[{ required: true, message: 'Nhập thời lượng' }]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái" initialValue="active">
                            <Select>
                                <Option value="active">Đang hoạt động</Option>
                                <Option value="inactive">Tạm ngưng</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả">
                            <Input.TextArea rows={3} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </PageContainer>
    );
};

export default ServiceManagement;
