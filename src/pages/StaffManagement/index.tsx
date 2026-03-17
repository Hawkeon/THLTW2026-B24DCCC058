import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Space, Tag, Popconfirm, message, Select, TimePicker, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { bookingStorage, Staff, WorkingDay } from '@/utils/bookingStorage';
import moment from 'moment';

const { Option } = Select;

const DAYS = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const StaffManagement: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        setStaffList(bookingStorage.getStaff());
    }, []);

    const handleSave = (values: any) => {
        const schedule: WorkingDay[] = (values.schedule || []).map((item: any) => ({
            day: item.day,
            startTime: item.timeRange[0].format('HH:mm'),
            endTime: item.timeRange[1].format('HH:mm'),
        }));

        const newStaff: Staff = {
            id: editingStaff ? editingStaff.id : Date.now().toString(),
            fullName: values.fullName,
            phoneNumber: values.phoneNumber,
            email: values.email,
            note: values.note,
            maxCustomersPerDay: values.maxCustomersPerDay,
            schedule,
        };

        const updatedList = editingStaff
            ? staffList.map((s) => (s.id === editingStaff.id ? newStaff : s))
            : [...staffList, newStaff];

        setStaffList(updatedList);
        bookingStorage.saveStaff(updatedList);
        setIsModalVisible(false);
        form.resetFields();
        setEditingStaff(null);
        message.success(editingStaff ? 'Cập nhật nhân viên thành công' : 'Thêm nhân viên thành công');
    };

    const handleDelete = (id: string) => {
        const updatedList = staffList.filter((s) => s.id !== id);
        setStaffList(updatedList);
        bookingStorage.saveStaff(updatedList);
        message.success('Xóa nhân viên thành công');
    };

    const columns = [
        { title: 'Tên nhân viên', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Giới hạn khách/ngày', dataIndex: 'maxCustomersPerDay', key: 'maxCustomersPerDay' },
        {
            title: 'Lịch làm việc',
            key: 'schedule',
            render: (_: any, record: Staff) => (
                <Space direction="vertical" size={1}>
                    {record.schedule.map((s, idx) => (
                        <Tag color="blue" key={idx}>
                            {DAYS[s.day]}: {s.startTime} - {s.endTime}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Staff) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingStaff(record);
                            setIsModalVisible(true);
                            form.setFieldsValue({
                                ...record,
                                schedule: record.schedule.map((s) => ({
                                    day: s.day,
                                    timeRange: [moment(s.startTime, 'HH:mm'), moment(s.endTime, 'HH:mm')],
                                })),
                            });
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm title="Bạn có chắc muốn xóa nhân viên này?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <PageContainer title="Quản lý nhân viên">
            <Card>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingStaff(null);
                        setIsModalVisible(true);
                        form.resetFields();
                    }}
                    style={{ marginBottom: 16 }}
                >
                    Thêm nhân viên
                </Button>
                <Table dataSource={staffList} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />

                <Modal
                    title={editingStaff ? 'Sửa nhân viên' : 'Thêm nhân viên'}
                    visible={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setEditingStaff(null);
                        form.resetFields();
                    }}
                    onOk={() => form.submit()}
                    width={700}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical" onFinish={handleSave}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                                    <Input placeholder="Nguyễn Văn A" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: 'Nhập số điện thoại' }]}>
                                    <Input placeholder="0987654321" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
                                    <Input placeholder="email@example.com" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="maxCustomersPerDay"
                                    label="Số khách tối đa/ngày"
                                    rules={[{ required: true, message: 'Nhập số khách tối đa' }]}
                                    initialValue={10}
                                >
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.List name="schedule">
                            {(fields, { add, remove }) => (
                                <>
                                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Lịch làm việc:</div>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'day']}
                                                rules={[{ required: true, message: 'Chọn ngày' }]}
                                            >
                                                <Select placeholder="Chọn ngày" style={{ width: 120 }}>
                                                    {DAYS.map((day, idx) => (
                                                        <Option key={idx} value={idx}>{day}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'timeRange']}
                                                rules={[{ required: true, message: 'Chọn thời gian' }]}
                                            >
                                                <TimePicker.RangePicker format="HH:mm" />
                                            </Form.Item>
                                            <DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm lịch làm việc
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <Form.Item name="note" label="Ghi chú">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </PageContainer>
    );
};

export default StaffManagement;
