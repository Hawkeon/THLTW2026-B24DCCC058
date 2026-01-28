import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { useModel } from 'umi';
import { ShoppingCartOutlined, DollarCircleOutlined, ShopOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard: React.FC = () => {
    const { products } = useModel('products');
    const { orders } = useModel('orders');

    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const totalOrders = orders.length;
    const totalRevenue = orders
        .filter((o) => o.status === 'Hoàn thành')
        .reduce((acc, o) => acc + o.totalAmount, 0);

    const statusCounts = {
        'Chờ xử lý': 0,
        'Đang giao': 0,
        'Hoàn thành': 0,
        'Đã hủy': 0,
    };

    orders.forEach((o) => {
        if (statusCounts[o.status] !== undefined) {
            statusCounts[o.status]++;
        }
    });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    return (
        <PageContainer title="Tổng quan hệ thống">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Tổng số sản phẩm"
                            value={totalProducts}
                            prefix={<DatabaseOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Giá trị tồn kho"
                            value={totalInventoryValue}
                            precision={0}
                            formatter={(val) => formatCurrency(Number(val))}
                            prefix={<ShopOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Tổng số đơn hàng"
                            value={totalOrders}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Doanh thu"
                            value={totalRevenue}
                            precision={0}
                            formatter={(val) => formatCurrency(Number(val))}
                            prefix={<DollarCircleOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} md={12}>
                    <Card title="Trạng thái đơn hàng">
                        {Object.entries(statusCounts).map(([status, count]) => {
                            const percent = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                            let color = '#1890ff';
                            if (status === 'Hoàn thành') color = '#52c41a';
                            if (status === 'Đã hủy') color = '#ff4d4f';
                            if (status === 'Chờ xử lý') color = '#faad14';

                            return (
                                <div key={status} style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{status}</span>
                                        <span>{count}</span>
                                    </div>
                                    <Progress percent={percent} strokeColor={color} showInfo={false} />
                                </div>
                            );
                        })}
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default Dashboard;
