import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Input, Modal, Form, InputNumber, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const ProductManagement: React.FC = () => {
    // Mock Data
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
        { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
        { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
        { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
        { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    // Filtered Products
    const filteredProducts = useMemo(() => {
        if (!searchText) return products;
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [products, searchText]);

    // Handlers
    const handleAddProduct = (values: any) => {
        const newProduct: Product = {
            id: Date.now(), // Simple ID generation
            name: values.name,
            price: values.price,
            quantity: values.quantity,
        };
        setProducts([...products, newProduct]);
        message.success('Product added successfully');
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDeleteProduct = (id: number) => {
        setProducts(products.filter((item) => item.id !== id));
        message.success('Product deleted successfully');
    };

    // Table Columns
    const columns: ColumnsType<Product> = [
        {
            title: 'Index',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: 80,
        },
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Hành Động',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                        onConfirm={() => handleDeleteProduct(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined size={14} />} size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <PageContainer title="Product Management">
            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Input
                        placeholder="Nhập Tên Sản Phẩm"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                        Thêm Sản Phẩm
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />

                <Modal
                    title="Thêm Sản Phẩm"
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onOk={() => form.submit()}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical" onFinish={handleAddProduct}>
                        <Form.Item
                            name="name"
                            label="Tên Sản Phẩm"
                            rules={[{ required: true, message: 'Please enter product name' }]}
                        >
                            <Input placeholder="Enter product name" />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[
                                { required: true, message: 'Please enter price' },
                                { type: 'number', min: 1, message: 'Price must be a positive number' },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                placeholder="Enter price"
                            />
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Số Lượng"
                            rules={[
                                { required: true, message: 'Please enter quantity' },
                                { type: 'number', min: 1, message: 'Quantity must be a positive integer' },
                                { pattern: /^[0-9]+$/, message: 'Quantity must be an integer' },
                            ]}
                        >
                            <InputNumber style={{ width: '100%' }} placeholder="Enter quantity" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </PageContainer>
    );
};

export default ProductManagement;
