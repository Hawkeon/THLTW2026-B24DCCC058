import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, Select, InputNumber, Popconfirm, Tag, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const WorkoutLog: React.FC = () => {
	const { data, addWorkout, updateWorkout, deleteWorkout, visible, setVisible, editingRecord, setEditingRecord } = useModel('workout');
	const [form] = Form.useForm();
	const [searchText, setSearchText] = useState('');
	const [filterType, setFilterType] = useState<string | undefined>(undefined);
	const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

	const workoutTypes = {
		Cardio: 'Tim mạch (Cardio)',
		Strength: 'Sức mạnh (Strength)',
		Yoga: 'Yoga',
		HIIT: 'Cường độ cao (HIIT)',
		Other: 'Khác',
	};

	const filteredData = useMemo(() => {
		return data.filter((item) => {
			const matchesSearch = item.type.toLowerCase().includes(searchText.toLowerCase()) || 
								 (item.notes || '').toLowerCase().includes(searchText.toLowerCase());
			const matchesType = filterType ? item.type === filterType : true;
			const matchesDate = dateRange 
				? moment(item.date).isBetween(dateRange[0], dateRange[1], 'day', '[]')
				: true;
			return matchesSearch && matchesType && matchesDate;
		});
	}, [data, searchText, filterType, dateRange]);

	const handleAdd = () => {
		setEditingRecord(null);
		form.resetFields();
		setVisible(true);
	};

	const handleEdit = (record: Fitness.Workout) => {
		setEditingRecord(record);
		form.setFieldsValue({
			...record,
			date: moment(record.date),
		});
		setVisible(true);
	};

	const onFinish = (values: any) => {
		const formattedValues = {
			...values,
			date: values.date.format('YYYY-MM-DD'),
		};

		if (editingRecord) {
			updateWorkout(editingRecord.id, formattedValues);
			message.success('Cập nhật buổi tập thành công');
		} else {
			addWorkout(formattedValues);
			message.success('Thêm buổi tập thành công');
		}
		setVisible(false);
	};

	const handleDelete = (id: string) => {
		deleteWorkout(id);
		message.success('Xóa buổi tập thành công');
	};

	const columns = [
		{
			title: 'Ngày',
			dataIndex: 'date',
			key: 'date',
			render: (text: string) => moment(text).format('DD/MM/YYYY'),
			sorter: (a: any, b: any) => moment(a.date).unix() - moment(b.date).unix(),
		},
		{
			title: 'Loại bài tập',
			dataIndex: 'type',
			key: 'type',
			render: (type: string) => <Tag color="blue">{workoutTypes[type as keyof typeof workoutTypes] || type}</Tag>,
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'duration',
			key: 'duration',
		},
		{
			title: 'Calo đốt',
			dataIndex: 'calories',
			key: 'calories',
		},
		{
			title: 'Ghi chú',
			dataIndex: 'notes',
			key: 'notes',
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Tag color={status === 'Completed' ? 'green' : 'red'}>
					{status === 'Completed' ? 'Hoàn thành' : 'Bỏ lỡ'}
				</Tag>
			),
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: Fitness.Workout) => (
				<Space size="middle">
					<Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
						<Button type="link" danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card title="Nhật ký tập luyện">
			<Space direction="vertical" style={{ width: '100%' }} size="large">
				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} md={6}>
						<Input
							placeholder="Tìm theo tên hoặc ghi chú"
							prefix={<SearchOutlined />}
							onChange={(e) => setSearchText(e.target.value)}
						/>
					</Col>
					<Col xs={24} md={6}>
						<Select
							placeholder="Lọc theo loại"
							style={{ width: '100%' }}
							allowClear
							onChange={(value) => setFilterType(value)}
						>
							{Object.entries(workoutTypes).map(([key, value]) => (
								<Option key={key} value={key}>{value}</Option>
							))}
						</Select>
					</Col>
					<Col xs={24} md={8}>
						<RangePicker 
							style={{ width: '100%' }} 
							onChange={(dates: any) => setDateRange(dates)}
							placeholder={['Từ ngày', 'Đến ngày']}
						/>
					</Col>
					<Col xs={24} md={4} style={{ textAlign: 'right' }}>
						<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
							Thêm buổi tập
						</Button>
					</Col>
				</Row>

				<Table 
					columns={columns} 
					dataSource={filteredData} 
					rowKey="id"
					pagination={{ pageSize: 10 }}
				/>
			</Space>

			<Modal
				title={editingRecord ? 'Sửa buổi tập' : 'Thêm buổi tập'}
				visible={visible}
				onCancel={() => setVisible(false)}
				onOk={() => form.submit()}
				destroyOnClose
				okText="Lưu"
				cancelText="Hủy"
			>
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<Form.Item name="date" label="Ngày tập" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
						<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
					</Form.Item>
					<Form.Item name="type" label="Loại bài tập" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
						<Select>
							{Object.entries(workoutTypes).map(([key, value]) => (
								<Option key={key} value={key}>{value}</Option>
							))}
						</Select>
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: 'Nhập thời lượng' }]}>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="calories" label="Calo đốt" rules={[{ required: true, message: 'Nhập calo' }]}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái' }]}>
						<Select>
							<Option value="Completed">Hoàn thành</Option>
							<Option value="Missed">Bỏ lỡ</Option>
						</Select>
					</Form.Item>
					<Form.Item name="notes" label="Ghi chú">
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default WorkoutLog;
