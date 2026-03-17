import React, { useState, useEffect, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Modal, Form, Input, DatePicker, Select, Space, Tag, Popconfirm, message, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { bookingStorage, Staff, Service, Appointment } from '@/utils/bookingStorage';
import moment from 'moment';

const { Option } = Select;

const STATUS_COLORS: Record<string, string> = {
    'Chờ duyệt': 'orange',
    'Xác nhận': 'blue',
    'Hoàn thành': 'green',
    'Hủy': 'red',
};

const AppointmentManagement: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    
    // Filters
    const [filterDate, setFilterDate] = useState<string | null>(null);
    const [filterStaff, setFilterStaff] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    useEffect(() => {
        setAppointments(bookingStorage.getAppointments());
        setStaffList(bookingStorage.getStaff());
        setServices(bookingStorage.getServices());
    }, []);

    const filteredAppointments = useMemo(() => {
        return appointments.filter(app => {
            const matchesDate = filterDate ? app.date === filterDate : true;
            const matchesStaff = filterStaff ? app.staffId === filterStaff : true;
            const matchesStatus = filterStatus ? app.status === filterStatus : true;
            return matchesDate && matchesStaff && matchesStatus;
        });
    }, [appointments, filterDate, filterStaff, filterStatus]);

    const handleCreate = (values: any) => {
        const dateStr = values.date.format('YYYY-MM-DD');
        const timeStr = values.time;
        const selectedStaff = staffList.find(s => s.id === values.staffId);
        const selectedService = services.find(s => s.id === values.serviceId);

        if (!selectedStaff || !selectedService) return;

        // 1. Check Staff Working Schedule
        const dayOfWeek = values.date.day();
        const staffDaySchedule = selectedStaff.schedule.find(s => s.day === dayOfWeek);
        
        if (!staffDaySchedule) {
            message.error('Nhân viên không làm việc vào ngày này');
            return;
        }

        const bookingTime = moment(timeStr, 'HH:mm');
        const startTime = moment(staffDaySchedule.startTime, 'HH:mm');
        const endTime = moment(staffDaySchedule.endTime, 'HH:mm');

        if (bookingTime.isBefore(startTime) || bookingTime.isAfter(endTime)) {
            message.error(`Ngoài giờ làm việc của nhân viên (${staffDaySchedule.startTime} - ${staffDaySchedule.endTime})`);
            return;
        }

        // 2. Check Daily Limit
        const apptsOnDay = appointments.filter(a => a.date === dateStr && a.staffId === values.staffId && a.status !== 'Hủy');
        if (apptsOnDay.length >= selectedStaff.maxCustomersPerDay) {
            message.error('Nhân viên đã đạt giới hạn khách tối đa trong ngày');
            return;
        }

        // 3. Check Conflict/Overlap
        const bookingEnd = moment(timeStr, 'HH:mm').add(selectedService.durationMinutes, 'minutes');
        const conflict = appointments.some(a => {
            if (a.date !== dateStr || a.staffId !== values.staffId || a.status === 'Hủy') return false;
            
            const existingStart = moment(a.time, 'HH:mm');
            const existingService = services.find(s => s.id === a.serviceId);
            const existingEnd = moment(a.time, 'HH:mm').add(existingService?.durationMinutes || 30, 'minutes');
            
            return (bookingTime.isBefore(existingEnd) && bookingEnd.isAfter(existingStart));
        });

        if (conflict) {
            message.error('Trùng lịch! Nhân viên đang có hẹn khác vào thời gian này');
            return;
        }

        const newAppointment: Appointment = {
            id: Date.now().toString(),
            customerName: values.customerName,
            customerPhone: values.customerPhone,
            customerEmail: values.customerEmail,
            serviceId: values.serviceId,
            date: dateStr,
            time: timeStr,
            staffId: values.staffId,
            status: 'Chờ duyệt',
            note: values.note,
            createdAt: moment().toISOString(),
        };

        const updatedList = [newAppointment, ...appointments];
        setAppointments(updatedList);
        bookingStorage.saveAppointments(updatedList);
        setIsModalVisible(false);
        form.resetFields();
        message.success('Đặt lịch thành công');
    };

    const updateStatus = (id: string, status: any) => {
        const updatedList = appointments.map(a => a.id === id ? { ...a, status } : a);
        setAppointments(updatedList);
        bookingStorage.saveAppointments(updatedList);
        message.success('Cập nhật trạng thái thành công');
    };

    const columns = [
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_: any, record: Appointment) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{record.customerName}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{record.customerPhone}</div>
                </div>
            )
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'serviceId',
            key: 'service',
            render: (id: string) => services.find(s => s.id === id)?.name || 'N/A'
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_: any, record: Appointment) => (
                <div>
                    <div>{moment(record.date).format('DD/MM/YYYY')}</div>
                    <Tag color="purple">{record.time}</Tag>
                </div>
            )
        },
        {
            title: 'Nhân viên',
            dataIndex: 'staffId',
            key: 'staff',
            render: (id: string) => staffList.find(s => s.id === id)?.fullName || 'N/A'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color={STATUS_COLORS[status]}>{status}</Tag>
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Appointment) => (
                <Space>
                    {record.status === 'Chờ duyệt' && (
                        <Button type="link" size="small" onClick={() => updateStatus(record.id, 'Xác nhận')}>Xác nhận</Button>
                    )}
                    {record.status === 'Xác nhận' && (
                        <Button type="link" size="small" onClick={() => updateStatus(record.id, 'Hoàn thành')}>Hoàn thành</Button>
                    )}
                    {(record.status === 'Chờ duyệt' || record.status === 'Xác nhận') && (
                        <Popconfirm title="Huỷ cuộc hẹn này?" onConfirm={() => updateStatus(record.id, 'Hủy')}>
                            <Button type="link" danger size="small">Hủy</Button>
                        </Popconfirm>
                    )}
                </Space>
            )
        }
    ];

    return (
        <PageContainer title="Quản lý lịch hẹn">
            <Card>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} block>
                            Đặt lịch mới
                        </Button>
                    </Col>
                    <Col span={18}>
                        <Space>
                            <DatePicker placeholder="Lọc theo ngày" onChange={(d, s) => setFilterDate(s)} />
                            <Select placeholder="Lọc nhân viên" style={{ width: 150 }} allowClear onChange={setFilterStaff}>
                                {staffList.map(s => <Option key={s.id} value={s.id}>{s.fullName}</Option>)}
                            </Select>
                            <Select placeholder="Trạng thái" style={{ width: 120 }} allowClear onChange={setFilterStatus}>
                                {Object.keys(STATUS_COLORS).map(s => <Option key={s} value={s}>{s}</Option>)}
                            </Select>
                        </Space>
                    </Col>
                </Row>

                <Table dataSource={filteredAppointments} columns={columns} rowKey="id" />

                <Modal
                    title="Đặt lịch hẹn mới"
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onOk={() => form.submit()}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical" onFinish={handleCreate}>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="customerPhone" label="Số điện thoại" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true }]}>
                            <Select placeholder="Chọn dịch vụ">
                                {services.filter(s => s.status === 'active').map(s => (
                                    <Option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} phút - {s.price.toLocaleString()}đ)</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="staffId" label="Nhân viên" rules={[{ required: true }]}>
                            <Select placeholder="Chọn nhân viên">
                                {staffList.map(s => (
                                    <Option key={s.id} value={s.id}>{s.fullName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item name="date" label="Ngày hẹn" rules={[{ required: true }]}>
                                    <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < moment().startOf('day')} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="time" label="Giờ hẹn" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn giờ">
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <React.Fragment key={i}>
                                                <Option value={`${i.toString().padStart(2, '0')}:00`}>{i.toString().padStart(2, '0')}:00</Option>
                                                <Option value={`${i.toString().padStart(2, '0')}:30`}>{i.toString().padStart(2, '0')}:30</Option>
                                            </React.Fragment>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="note" label="Ghi chú">
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </PageContainer>
    );
};

export default AppointmentManagement;
