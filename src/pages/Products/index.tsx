import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Input, Modal, Form, InputNumber, Popconfirm, message, Space, Tag, Select, Slider, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useModel } from 'umi';

const { Option } = Select;

const Products: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useModel('products');
    const [form] = Form.useForm();

    // UI State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Filter State
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);

    // Derived Data
    const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

    const getStatus = (quantity: number) => {
        if (quantity === 0) return { label: 'Hết hàng', color: 'red' };
        if (quantity <= 10) return { label: 'Sắp hết', color: 'orange' };
        return { label: 'Còn hàng', color: 'green' };
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchName = product.name.toLowerCase().includes(searchText.toLowerCase());
            const matchCategory = categoryFilter ? product.category === categoryFilter : true;
            const status = getStatus(product.quantity).label;
            const matchStatus = statusFilter ? status === statusFilter : true;
            const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

            return matchName && matchCategory && matchStatus && matchPrice;
        });
    }, [products, searchText, categoryFilter, statusFilter, priceRange]);

    // Handlers
    const handleEdit = (record: any) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        deleteProduct(id);
        message.success('Xóa sản phẩm thành công');
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            if (editingId) {
                updateProduct(editingId, values);
                message.success('Cập nhật sản phẩm thành công');
            } else {
                addProduct(values);
                message.success('Thêm sản phẩm thành công');
            }
            setIsModalVisible(false);
            form.resetFields();
            setEditingId(null);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingId(null);
    };

    // Columns
    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            filters: categories.map(c => ({ text: c, value: c })),
            onFilter: (value, record) => record.category === value,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => {
                const { label, color } = getStatus(record.quantity);
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa sản phẩm này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <PageContainer title="Quản lý sản phẩm">
            <Card bordered={false}>
                {/* Filters */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                        <Input
                            placeholder="Tìm kiếm theo tên..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Danh mục"
                            style={{ width: '100%' }}
                            allowClear
                            onChange={setCategoryFilter}
                        >
                            {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Trạng thái"
                            style={{ width: '100%' }}
                            allowClear
                            onChange={setStatusFilter}
                        >
                            <Option value="Còn hàng">Còn hàng</Option>
                            <Option value="Sắp hết">Sắp hết</Option>
                            <Option value="Hết hàng">Hết hàng</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Slider
                            range
                            min={0}
                            max={100000000}
                            step={1000000}
                            defaultValue={[0, 100000000]}
                            onAfterChange={(val: [number, number]) => setPriceRange(val)}
                            tooltipVisible
                            tipFormatter={(val) => `${val ? val / 1000000 : 0}Tr`}
                        />
                    </Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                            Thêm mới
                        </Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />

                <Modal
                    title={editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                    visible={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Tên sản phẩm"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="category"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng nhập danh mục' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá' },
                                { type: 'number', min: 0, message: 'Giá phải lớn hơn 0' }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Số lượng"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số lượng' },
                                { type: 'number', min: 0, message: 'Số lượng không được âm' },
                                { pattern: /^[0-9]+$/, message: 'Số lượng phải là số nguyên' }
                            ]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </PageContainer>
    );
};

export default Products;
