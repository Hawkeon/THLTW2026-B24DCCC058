import React, { useState } from 'react';
import { Card, Row, Col, Button, Progress, Tag, Space, Drawer, Form, Input, Select, DatePicker, InputNumber, Popconfirm, Segmented, Typography, Empty, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';

const { Text, Title } = Typography;
const { Option } = Select;

const GoalManagement: React.FC = () => {
	const { data, addGoal, updateGoal, deleteGoal, visible, setVisible, editingRecord, setEditingRecord } = useModel('goal');
	const [form] = Form.useForm();
	const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

	const goalTypes = {
		'Weight loss': 'Giảm cân',
		'Muscle gain': 'Tăng cơ',
		'Endurance': 'Sức bền',
		'Other': 'Khác',
	};

	const goalStatuses = {
		'In progress': 'Đang thực hiện',
		'Completed': 'Đã hoàn thành',
		'Cancelled': 'Đã hủy',
	};

	const filteredData = data.filter((item) => {
		if (statusFilter === 'Tất cả') return true;
		const statusInEnglish = Object.keys(goalStatuses).find(key => goalStatuses[key as keyof typeof goalStatuses] === statusFilter);
		return item.status === (statusInEnglish || statusFilter);
	});

	const handleAdd = () => {
		setEditingRecord(null);
		form.resetFields();
		setVisible(true);
	};

	const handleEdit = (record: Fitness.Goal) => {
		setEditingRecord(record);
		form.setFieldsValue({
			...record,
			deadline: moment(record.deadline),
		});
		setVisible(true);
	};

	const onFinish = (values: any) => {
		const formattedValues = {
			...values,
			deadline: values.deadline.format('YYYY-MM-DD'),
			currentValue: values.currentValue || 0,
			status: values.status || 'In progress',
		};

		if (editingRecord) {
			updateGoal(editingRecord.id, formattedValues);
			message.success('Cập nhật mục tiêu thành công');
		} else {
			addGoal(formattedValues);
			message.success('Thêm mục tiêu mới thành công');
		}
		setVisible(false);
	};

	const handleDelete = (id: string) => {
		deleteGoal(id);
		message.success('Xóa mục tiêu thành công');
	};

	const handleUpdateValue = (id: string, value: number) => {
		updateGoal(id, { currentValue: value });
	};

	return (
		<div style={{ padding: '0 8px' }}>
			<div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
				<Title level={4} style={{ margin: 0 }}>Quản lý mục tiêu</Title>
				<Space wrap>
					<Segmented
						options={['Tất cả', 'Đang thực hiện', 'Đã hoàn thành', 'Đã hủy']}
						value={statusFilter}
						onChange={(value) => setStatusFilter(value as string)}
					/>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
						Thêm mục tiêu mới
					</Button>
				</Space>
			</div>

			{filteredData.length > 0 ? (
				<Row gutter={[16, 16]}>
					{filteredData.map((goal) => {
						const progress = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
						const statusLabel = goalStatuses[goal.status as keyof typeof goalStatuses] || goal.status;
						return (
							<Col xs={24} sm={12} lg={8} key={goal.id}>
								<Card
									hoverable
									actions={[
										<EditOutlined key="edit" onClick={() => handleEdit(goal)} />,
										<Popconfirm key="delete" title="Xóa mục tiêu này?" onConfirm={() => handleDelete(goal.id)}>
											<DeleteOutlined style={{ color: '#ff4d4f' }} />
										</Popconfirm>,
									]}
								>
									<Card.Meta
										avatar={<TrophyOutlined style={{ fontSize: 24, color: '#faad14' }} />}
										title={goal.name}
										description={
											<Space direction="vertical" style={{ width: '100%' }}>
												<Tag color="blue">{goalTypes[goal.type as keyof typeof goalTypes] || goal.type}</Tag>
												<div style={{ display: 'flex', justifyContent: 'space-between' }}>
													<Text type="secondary">Hạn chót: {moment(goal.deadline).format('DD/MM/YYYY')}</Text>
													<Tag color={goal.status === 'Completed' ? 'green' : goal.status === 'Cancelled' ? 'red' : 'processing'}>
														{statusLabel}
													</Tag>
												</div>
												<div style={{ marginTop: 8 }}>
													<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
														<Text>Tiến độ</Text>
														<Text strong>{goal.currentValue} / {goal.targetValue}</Text>
													</div>
													<Progress percent={progress} status={goal.status === 'Completed' ? 'success' : 'active'} />
												</div>
												<div style={{ marginTop: 8 }}>
													<Text size="small">Cập nhật giá trị hiện tại:</Text>
													<InputNumber
														min={0}
														style={{ width: '100%', marginTop: 4 }}
														value={goal.currentValue}
														onChange={(val) => handleUpdateValue(goal.id, val || 0)}
													/>
												</div>
											</Space>
										}
									/>
								</Card>
							</Col>
						);
					})}
				</Row>
			) : (
				<Empty description={`Không tìm thấy mục tiêu nào ${statusFilter === 'Tất cả' ? '' : `ở trạng thái ${statusFilter.toLowerCase()}`}`} style={{ marginTop: 64 }}>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
						Tạo mục tiêu đầu tiên
					</Button>
				</Empty>
			)}

			<Drawer
				title={editingRecord ? 'Sửa mục tiêu' : 'Thêm mục tiêu mới'}
				width={window.innerWidth > 600 ? 400 : '100%'}
				onClose={() => setVisible(false)}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div style={{ textAlign: 'right' }}>
						<Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
							Hủy
						</Button>
						<Button onClick={() => form.submit()} type="primary">
							Lưu
						</Button>
					</div>
				}
			>
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true, message: 'Nhập tên mục tiêu' }]}>
						<Input placeholder="VD: Giảm 5kg, Chạy 10km" />
					</Form.Item>
					<Form.Item name="type" label="Loại mục tiêu" rules={[{ required: true, message: 'Chọn loại mục tiêu' }]}>
						<Select>
							{Object.entries(goalTypes).map(([key, value]) => (
								<Option key={key} value={key}>{value}</Option>
							))}
						</Select>
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true, message: 'Nhập giá trị' }]}>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="currentValue" label="Giá trị hiện tại">
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name="deadline" label="Hạn chót" rules={[{ required: true, message: 'Chọn ngày hạn chót' }]}>
						<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
					</Form.Item>
					<Form.Item name="status" label="Trạng thái" initialValue="In progress">
						<Select>
							{Object.entries(goalStatuses).map(([key, value]) => (
								<Option key={key} value={key}>{value}</Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
};

export default GoalManagement;
