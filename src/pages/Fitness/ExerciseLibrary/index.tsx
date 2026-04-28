import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Input, Tag, Select, Button, Modal, Form, Typography, Space, Popconfirm, InputNumber, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Text, Paragraph, Title } = Typography;
const { Option } = Select;

const ExerciseLibrary: React.FC = () => {
	const { data, addExercise, updateExercise, deleteExercise, visible, setVisible, editingRecord, setEditingRecord } = useModel('exercise');
	const [searchText, setSearchText] = useState('');
	const [filterMuscle, setFilterMuscle] = useState<string | undefined>(undefined);
	const [filterDifficulty, setFilterDifficulty] = useState<string | undefined>(undefined);
	const [detailVisible, setDetailVisible] = useState(false);
	const [selectedExercise, setSelectedExercise] = useState<Fitness.Exercise | null>(null);
	const [form] = Form.useForm();

	const muscleGroups = {
		'Chest': 'Ngực',
		'Back': 'Lưng',
		'Legs': 'Chân',
		'Shoulders': 'Vai',
		'Arms': 'Tay',
		'Core': 'Cơ bụng/Lõi',
		'Full Body': 'Toàn thân',
	};

	const difficulties = {
		'Easy': 'Dễ',
		'Medium': 'Trung bình',
		'Hard': 'Khó',
	};

	const filteredData = useMemo(() => {
		return data.filter((item) => {
			const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
			const matchesMuscle = filterMuscle ? item.muscleGroup === filterMuscle : true;
			const matchesDifficulty = filterDifficulty ? item.difficulty === filterDifficulty : true;
			return matchesSearch && matchesMuscle && matchesDifficulty;
		});
	}, [data, searchText, filterMuscle, filterDifficulty]);

	const handleAdd = () => {
		setEditingRecord(null);
		form.resetFields();
		setVisible(true);
	};

	const handleEdit = (e: React.MouseEvent, record: Fitness.Exercise) => {
		e.stopPropagation();
		setEditingRecord(record);
		form.setFieldsValue(record);
		setVisible(true);
	};

	const handleDelete = (id: string) => {
		deleteExercise(id);
		message.success('Xóa bài tập thành công');
	};

	const showDetails = (record: Fitness.Exercise) => {
		setSelectedExercise(record);
		setDetailVisible(true);
	};

	const onFinish = (values: any) => {
		if (editingRecord) {
			updateExercise(editingRecord.id, values);
			message.success('Cập nhật bài tập thành công');
		} else {
			addExercise(values);
			message.success('Thêm bài tập mới thành công');
		}
		setVisible(false);
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case 'Easy': return 'green';
			case 'Medium': return 'orange';
			case 'Hard': return 'red';
			default: return 'blue';
		}
	};

	return (
		<div style={{ padding: '0 8px' }}>
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
				<Col xs={24} md={8}>
					<Input
						placeholder="Tìm kiếm bài tập..."
						prefix={<SearchOutlined />}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</Col>
				<Col xs={12} md={5}>
					<Select
						placeholder="Nhóm cơ"
						style={{ width: '100%' }}
						allowClear
						onChange={(value) => setFilterMuscle(value)}
					>
						{Object.entries(muscleGroups).map(([key, value]) => (
							<Option key={key} value={key}>{value}</Option>
						))}
					</Select>
				</Col>
				<Col xs={12} md={5}>
					<Select
						placeholder="Mức độ khó"
						style={{ width: '100%' }}
						allowClear
						onChange={(value) => setFilterDifficulty(value)}
					>
						{Object.entries(difficulties).map(([key, value]) => (
							<Option key={key} value={key}>{value}</Option>
						))}
					</Select>
				</Col>
				<Col xs={24} md={6} style={{ textAlign: 'right' }}>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
						Thêm bài tập
					</Button>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				{filteredData.map((exercise) => (
					<Col xs={24} sm={12} md={8} key={exercise.id}>
						<Card
							hoverable
							onClick={() => showDetails(exercise)}
							actions={[
								<Button type="link" icon={<EditOutlined />} key="edit" onClick={(e) => handleEdit(e, exercise)} />,
								<Popconfirm 
									key="delete" 
									title="Xóa bài tập này?" 
									onConfirm={(e) => {
										e?.stopPropagation();
										handleDelete(exercise.id);
									}}
									onCancel={(e) => e?.stopPropagation()}
								>
									<Button type="link" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
								</Popconfirm>
							]}
						>
							<Card.Meta
								title={exercise.name}
								description={
									<Space direction="vertical" style={{ width: '100%' }}>
										<div style={{ display: 'flex', justifyContent: 'space-between' }}>
											<Tag color="blue">{muscleGroups[exercise.muscleGroup as keyof typeof muscleGroups] || exercise.muscleGroup}</Tag>
											<Tag color={getDifficultyColor(exercise.difficulty)}>{difficulties[exercise.difficulty as keyof typeof difficulties] || exercise.difficulty}</Tag>
										</div>
										<Paragraph ellipsis={{ rows: 2 }}>{exercise.description}</Paragraph>
										<Text type="secondary">{exercise.caloriesPerHour} kcal/giờ</Text>
									</Space>
								}
							/>
						</Card>
					</Col>
				))}
			</Row>

			<Modal
				title={editingRecord ? 'Sửa bài tập' : 'Thêm bài tập mới'}
				visible={visible}
				onCancel={() => setVisible(false)}
				onOk={() => form.submit()}
				destroyOnClose
				width={600}
				okText="Lưu"
				cancelText="Hủy"
			>
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<Form.Item name="name" label="Tên bài tập" rules={[{ required: true, message: 'Nhập tên bài tập' }]}>
						<Input />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="muscleGroup" label="Nhóm cơ" rules={[{ required: true, message: 'Chọn nhóm cơ' }]}>
								<Select>
									{Object.entries(muscleGroups).map(([key, value]) => (
										<Option key={key} value={key}>{value}</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="difficulty" label="Mức độ khó" rules={[{ required: true, message: 'Chọn mức độ' }]}>
								<Select>
									{Object.entries(difficulties).map(([key, value]) => (
										<Option key={key} value={key}>{value}</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name="caloriesPerHour" label="Calo đốt mỗi giờ" rules={[{ required: true, message: 'Nhập calo' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="description" label="Mô tả ngắn" rules={[{ required: true, message: 'Nhập mô tả' }]}>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item name="detailedInstructions" label="Hướng dẫn chi tiết">
						<Input.TextArea rows={6} placeholder="Các bước thực hiện..." />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title="Chi tiết bài tập"
				visible={detailVisible}
				onCancel={() => setDetailVisible(false)}
				footer={[
					<Button key="close" onClick={() => setDetailVisible(false)}>Đóng</Button>
				]}
				width={600}
			>
				{selectedExercise && (
					<div>
						<Title level={4}>{selectedExercise.name}</Title>
						<Space style={{ marginBottom: 16 }}>
							<Tag color="blue">{muscleGroups[selectedExercise.muscleGroup as keyof typeof muscleGroups] || selectedExercise.muscleGroup}</Tag>
							<Tag color={getDifficultyColor(selectedExercise.difficulty)}>{difficulties[selectedExercise.difficulty as keyof typeof difficulties] || selectedExercise.difficulty}</Tag>
							<Text type="secondary">{selectedExercise.caloriesPerHour} kcal/giờ</Text>
						</Space>
						<Title level={5}>Mô tả</Title>
						<Paragraph>{selectedExercise.description}</Paragraph>
						<Title level={5}>Hướng dẫn thực hiện</Title>
						<Paragraph style={{ whiteSpace: 'pre-wrap' }}>
							{selectedExercise.detailedInstructions || 'Chưa có hướng dẫn chi tiết cho bài tập này.'}
						</Paragraph>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default ExerciseLibrary;
