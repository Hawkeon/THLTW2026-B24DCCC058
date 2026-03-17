import React, { useState, useEffect, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { ShoppingCartOutlined, DollarCircleOutlined, StarOutlined } from '@ant-design/icons';
import { bookingStorage, Appointment, Service, Staff, Review } from '@/utils/bookingStorage';

const Reports: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        setAppointments(bookingStorage.getAppointments());
        setServices(bookingStorage.getServices());
        setStaffList(bookingStorage.getStaff());
        setReviews(bookingStorage.getReviews());
    }, []);

    const stats = useMemo(() => {
        const completed = appointments.filter(a => a.status === 'Hoàn thành');
        const revenue = completed.reduce((sum, a) => {
            const s = services.find(srv => srv.id === a.serviceId);
            return sum + (s?.price || 0);
        }, 0);

        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 'N/A';

        return {
            totalAppointments: appointments.length,
            completedAppointments: completed.length,
            totalRevenue: revenue,
            avgRating
        };
    }, [appointments, services, reviews]);

    const serviceStats = useMemo(() => {
        return services.map(s => {
            const appts = appointments.filter(a => a.serviceId === s.id && a.status === 'Hoàn thành');
            return {
                id: s.id,
                name: s.name,
                count: appts.length,
                revenue: appts.length * s.price
            };
        }).sort((a, b) => b.revenue - a.revenue);
    }, [services, appointments]);

    const staffStats = useMemo(() => {
        return staffList.map(s => {
            const appts = appointments.filter(a => a.staffId === s.id && a.status === 'Hoàn thành');
            const staffReviews = reviews.filter(r => r.staffId === s.id);
            const avgRating = staffReviews.length > 0
                ? (staffReviews.reduce((sum, r) => sum + r.rating, 0) / staffReviews.length).toFixed(1)
                : 'N/A';
            return {
                id: s.id,
                name: s.fullName,
                count: appts.length,
                rating: avgRating
            };
        }).sort((a, b) => b.count - a.count);
    }, [staffList, appointments, reviews]);

    return (
        <PageContainer title="Báo cáo & Thống kê">
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng lịch hẹn"
                            value={stats.totalAppointments}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Lịch hoàn thành"
                            value={stats.completedAppointments}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Doanh thu (VNĐ)"
                            value={stats.totalRevenue}
                            precision={0}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<DollarCircleOutlined />}
                            suffix="đ"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đánh giá trung bình"
                            value={stats.avgRating}
                            prefix={<StarOutlined />}
                            suffix="/ 5"
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Hiệu suất dịch vụ (Hoàn thành)">
                        <Table
                            dataSource={serviceStats}
                            rowKey="id"
                            pagination={false}
                            columns={[
                                { title: 'Dịch vụ', dataIndex: 'name' },
                                { title: 'Số lượng', dataIndex: 'count', align: 'right' },
                                { 
                                    title: 'Doanh thu', 
                                    dataIndex: 'revenue', 
                                    align: 'right',
                                    render: (v) => v.toLocaleString() + ' đ'
                                }
                            ]}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Xếp hạng nhân viên">
                        <Table
                            dataSource={staffStats}
                            rowKey="id"
                            pagination={false}
                            columns={[
                                { title: 'Nhân viên', dataIndex: 'name' },
                                { title: 'Lịch hoàn thành', dataIndex: 'count', align: 'right' },
                                { 
                                    title: 'Đánh giá', 
                                    dataIndex: 'rating', 
                                    align: 'center',
                                    render: (v) => <Tag color="gold">{v}</Tag>
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default Reports;
