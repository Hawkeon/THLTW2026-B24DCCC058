import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Input, Modal, Form, InputNumber, Select, Tag, Space, message, Statistic, Divider, Row, Col, DatePicker, Typography } from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useModel } from 'umi';
import { Order, OrderStatus } from '@/models/orders';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

const Orders: React.FC = () => {
    const { orders, createOrder, updateOrderStatus } = useModel('orders');
    const { products, updateStock } = useModel('products');
    const [form] = Form.useForm();

    // State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [currentOrderTotal, setCurrentOrderTotal] = useState(0);

    // Filters
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<any>(null);

    // Helper
    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    // Handlers
    const handleStatusChange = (orderId: string, newStatus: OrderStatus, currentStatus: OrderStatus) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Inventory Logic
        if (newStatus === 'Hoàn thành' && currentStatus !== 'Hoàn thành') {
            // Deduct stock
            // Verify first if we can deduct (optional, but good practice). 
            // Assuming we force it or check. Prompt says "Prevent stock from going negative".
            let possible = true;
            order.products.forEach(item => {
                const prod = products.find(p => p.id === item.productId);
                if (!prod || prod.quantity < item.quantity) possible = false;
            });

            if (!possible) {
                message.error('Không đủ tồn kho để hoàn thành đơn hàng này!');
                return;
            }

            order.products.forEach(item => {
                updateStock(item.productId, -item.quantity);
            });
        } else if (currentStatus === 'Hoàn thành' && newStatus !== 'Hoàn thành') {
            // Return stock
            order.products.forEach(item => {
                updateStock(item.productId, item.quantity);
            });
        }

        updateOrderStatus(orderId, newStatus);
        message.success('Cập nhật trạng thái thành công');
    };

    const handleCreateOrder = (values: any) => {
        const orderItems = values.products.map((pId: number) => {
            const prod = products.find(p => p.id === pId);
            const qty = values[`qty_${pId}`];
            return {
                productId: pId,
                productName: prod?.name || 'Unknown',
                quantity: qty,
                price: prod?.price || 0,
            };
        });

        const newOrder: Order = {
            id: `DH${String(Date.now()).slice(-3)}`, // Simple ID gen
            customerName: values.customerName,
            phone: values.phone,
            address: values.address,
            products: orderItems,
            totalAmount: currentOrderTotal,
            status: 'Chờ xử lý',
            createdAt: moment().format('YYYY-MM-DD'),
        };

        createOrder(newOrder);
        message.success('Tạo đơn hàng thành công');
        setIsModalVisible(false);
        form.resetFields();
        setSelectedProducts([]);
        setCurrentOrderTotal(0);
    };

    const handleFormChange = (_: any, allValues: any) => {
        // Calculate total on form change
        if (allValues.products) {
            let total = 0;
            allValues.products.forEach((pId: number) => {
                const prod = products.find(p => p.id === pId);
                const qty = allValues[`qty_${pId}`] || 0;
                if (prod) total += prod.price * qty;
            });
            setCurrentOrderTotal(total);
        }
    };

    // Filtered Data
    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchSearch = o.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                o.id.toLowerCase().includes(searchText.toLowerCase());
            const matchStatus = statusFilter ? o.status === statusFilter : true;
            const matchDate = dateRange ? moment(o.createdAt).isBetween(dateRange[0], dateRange[1], 'day', '[]') : true;
            return matchSearch && matchStatus && matchDate;
        }).sort((a, b) => {
            // Sort logic could represent a specific requested sort, currently defaulting to createdAt desc
            return moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf();
        });
    }, [orders, searchText, statusFilter, dateRange]);

    const columns: ColumnsType<Order> = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Số SP',
            key: 'items',
            render: (_, record) => record.products.length,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val) => formatCurrency(val),
            sorter: (a, b) => a.totalAmount - b.totalAmount,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf(),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                <Select
                    value={record.status}
                    style={{ width: 120 }}
                    onChange={(val) => handleStatusChange(record.id, val as OrderStatus, record.status)}
                >
                    <Option value="Chờ xử lý">Chờ xử lý</Option>
                    <Option value="Đang giao">Đang giao</Option>
                    <Option value="Hoàn thành">Hoàn thành</Option>
                    <Option value="Đã hủy">Đã hủy</Option>
                </Select>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => { setSelectedOrder(record); setDetailModalVisible(true); }}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    return (
        <PageContainer title="Quản lý đơn hàng">
            <Card bordered={false}>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                        <Input
                            placeholder="Tìm tên KH hoặc Mã ĐH"
                            prefix={<SearchOutlined />}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Trạng thái"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={setStatusFilter}
                        >
                            <Option value="Chờ xử lý">Chờ xử lý</Option>
                            <Option value="Đang giao">Đang giao</Option>
                            <Option value="Hoàn thành">Hoàn thành</Option>
                            <Option value="Đã hủy">Đã hủy</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <RangePicker onChange={setDateRange} style={{ width: '100%' }} />
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                            Tạo đơn hàng
                        </Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredOrders}
                    rowKey="id"
                />
            </Card>

            {/* Create Order Modal */}
            <Modal
                title="Tạo đơn hàng mới"
                visible={isModalVisible}
                onOk={form.submit}
                onCancel={() => setIsModalVisible(false)}
                width={700}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleCreateOrder} onValuesChange={handleFormChange}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, pattern: /^\d{10,11}$/, message: 'SĐT không hợp lệ' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Sản phẩm</Divider>

                    <Form.Item name="products" label="Chọn sản phẩm" rules={[{ required: true, message: 'Chọn ít nhất 1 SP' }]}>
                        <Select mode="multiple" onChange={setSelectedProducts} placeholder="Chọn sản phẩm...">
                            {products.map(p => (
                                <Option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                    {p.name} (Tồn: {p.quantity}) - {formatCurrency(p.price)}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedProducts.map(pId => {
                        const prod = products.find(p => p.id === pId);
                        return (
                            <Row key={pId} gutter={16} align="middle" style={{ marginBottom: 12 }}>
                                <Col span={12}><Text strong>{prod?.name}</Text></Col>
                                <Col span={12}>
                                    <Form.Item
                                        name={`qty_${pId}`}
                                        initialValue={1}
                                        noStyle
                                        rules={[
                                            { required: true },
                                            { type: 'number', min: 1, max: prod?.quantity, message: `Max ${prod?.quantity}` }
                                        ]}
                                    >
                                        <InputNumber min={1} max={prod?.quantity} placeholder="SL" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        );
                    })}

                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                        <Statistic title="Tổng tiền tạm tính" value={currentOrderTotal} prefix={<span style={{ fontSize: 14 }}>VND</span>} />
                    </div>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title={`Chi tiết đơn hàng - ${selectedOrder?.id}`}
                visible={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[<Button key="close" onClick={() => setDetailModalVisible(false)}>Đóng</Button>]}
            >
                {selectedOrder && (
                    <div>
                        <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                        <p><strong>SĐT:</strong> {selectedOrder.phone}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                        <p><strong>Ngày tạo:</strong> {selectedOrder.createdAt}</p>
                        <p><strong>Trạng thái:</strong> <Tag>{selectedOrder.status}</Tag></p>
                        <Divider />
                        <Table
                            dataSource={selectedOrder.products}
                            rowKey="productId"
                            pagination={false}
                            size="small"
                            columns={[
                                { title: 'Sản phẩm', dataIndex: 'productName' },
                                { title: 'SL', dataIndex: 'quantity' },
                                { title: 'Đơn giá', dataIndex: 'price', render: formatCurrency },
                                { title: 'Thành tiền', render: (_, r) => formatCurrency(r.price * r.quantity) }
                            ]}
                            summary={(pageData) => {
                                const total = pageData.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
                                return (
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3} className="text-right font-bold">Tổng cộng</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}><Text type="danger" strong>{formatCurrency(total)}</Text></Table.Summary.Cell>
                                    </Table.Summary.Row>
                                );
                            }}
                        />
                    </div>
                )}
            </Modal>
        </PageContainer>
    );
};

export default Orders;
