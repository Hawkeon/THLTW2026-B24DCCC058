import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Rate, Tag, message, Popconfirm, Card, Divider, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { TravelPlanning } from '@/services/Travel/travelService';

const DestinationList: React.FC = () => {
	const { destinations, fetchDestinations, addDestination, updateDestination, deleteDestination } = useModel('travel' as any);
	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();
	const [currentId, setCurrentId] = useState<string | null>(null);

	useEffect(() => {
		fetchDestinations();
	}, [fetchDestinations]);

	const showModal = (record?: TravelPlanning.Destination) => {
		setCurrentId(record?.destinationId || null);
		if (record) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
		}
		setVisible(true);
	};

	const onFinish = (values: any) => {
		if (currentId) {
			updateDestination({ ...values, destinationId: currentId });
			message.success('Cập nhật điểm đến thành công');
		} else {
			addDestination({ ...values, destinationId: `d${Date.now()}` });
			message.success('Thêm điểm đến mới thành công');
		}
		setVisible(false);
	};

	const columns = [
		{
			title: 'Địa danh',
			dataIndex: 'name',
			key: 'name',
			render: (text: string, record: any) => (
				<Space>
					<img src={record.image} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
					<span style={{ fontWeight: 500 }}>{text}</span>
				</Space>
			)
		},
		{
			title: 'Loại',
			dataIndex: 'type',
			key: 'type',
			render: (type: string) => {
				const color = type === 'biển' ? 'blue' : type === 'núi' ? 'green' : 'orange';
				return <Tag color={color}>{type}</Tag>;
			}
		},
		{
			title: 'Giá ước tính',
			dataIndex: 'priceEstimate',
			key: 'priceEstimate',
			sorter: (a: any, b: any) => a.priceEstimate - b.priceEstimate,
			render: (val: number) => `${val.toLocaleString()}đ`
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
			sorter: (a: any, b: any) => a.rating - b.rating,
			render: (val: number) => <Rate disabled defaultValue={val} allowHalf style={{ fontSize: 12 }} />
		},
		{
			title: 'Thao tác',
			key: 'actions',
			render: (_: any, record: TravelPlanning.Destination) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => showModal(record)} />
					<Popconfirm
						title="Bạn chắc chắn muốn xóa?"
						onConfirm={() => deleteDestination(record.destinationId)}
						okText="Xóa"
						cancelText="Hủy"
					>
						<Button icon={<DeleteOutlined />} danger />
					</Popconfirm>
				</Space>
			)
		}
	];

	return (
		<div style={{ padding: '24px' }}>
			<Card
				title={<span><SettingOutlined /> Quản lý Điểm đến</span>}
				extra={
					<Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
						Thêm điểm đến
					</Button>
				}
			>
				<Table dataSource={destinations} columns={columns} rowKey="destinationId" />
			</Card>

			<Modal
				title={currentId ? 'Sửa thông tin' : 'Thêm điểm đến mới'}
				visible={visible}
				onCancel={() => setVisible(false)}
				onOk={() => form.submit()}
				width={700}
				destroyOnClose
			>
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<Form.Item name="name" label="Tên địa danh" rules={[{ required: true, message: 'Vui lòng nhập tên địa danh' }]}>
						<Input placeholder="Ví dụ: Vịnh Hạ Long" />
					</Form.Item>
					<Form.Item name="image" label="Đường dẫn hình ảnh (URL)" rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}>
						<Input placeholder="https://..." />
					</Form.Item>
					<Form.Item name="type" label="Loại hình du lịch" rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}>
						<Select placeholder="Chọn loại hình">
							<Select.Option value="biển">Du lịch vùng biển</Select.Option>
							<Select.Option value="núi">Du lịch vùng núi</Select.Option>
							<Select.Option value="thành phố">Du lịch thành phố</Select.Option>
						</Select>
					</Form.Item>
					<Space size="large">
						<Form.Item name="priceEstimate" label="Giá ước tính (đ)" rules={[{ required: true }]}>
							<InputNumber min={0} step={100000} style={{ width: 150 }} />
						</Form.Item>
						<Form.Item name="rating" label="Đánh giá" initialValue={4.5}>
							<Rate allowHalf />
						</Form.Item>
						<Form.Item name="visitDuration" label="Thời gian tham quan (h)" initialValue={24}>
							<InputNumber min={1} style={{ width: 150 }} />
						</Form.Item>
					</Space>
					<Form.Item name="description" label="Mô tả">
						<Input.TextArea rows={3} />
					</Form.Item>
					<Divider>Chi tiết chi phí mẫu (VNĐ)</Divider>
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item name="costFood" label="Ăn uống" initialValue={500000}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="costTransport" label="Di chuyển" initialValue={300000}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="costAccommodation" label="Lưu trú" initialValue={1000000}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default DestinationList;
