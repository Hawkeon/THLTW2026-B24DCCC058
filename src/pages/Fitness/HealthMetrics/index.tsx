import React from 'react';
import { Table, Button, Space, Modal, Form, DatePicker, InputNumber, Popconfirm, Tag, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';

const HealthMetrics: React.FC = () => {
	const { data, addRecord, updateRecord, deleteRecord, visible, setVisible, editingRecord, setEditingRecord } = useModel('health');
	const [form] = Form.useForm();

	const handleAdd = () => {
		setEditingRecord(null);
		form.resetFields();
		setVisible(true);
	};

	const handleEdit = (record: Fitness.HealthRecord) => {
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
			updateRecord(editingRecord.id, formattedValues);
			message.success('Cập nhật chỉ số thành công');
		} else {
			addRecord(formattedValues);
			message.success('Thêm chỉ số thành công');
		}
		setVisible(false);
	};

	const handleDelete = (id: string) => {
		deleteRecord(id);
		message.success('Xóa chỉ số thành công');
	};

	const getBMITag = (bmi: number) => {
		if (bmi < 18.5) return <Tag color="blue">Thiếu cân</Tag>;
		if (bmi < 25) return <Tag color="green">Bình thường</Tag>;
		if (bmi < 30) return <Tag color="yellow">Thừa cân</Tag>;
		return <Tag color="red">Béo phì</Tag>;
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
			title: 'Cân nặng (kg)',
			dataIndex: 'weight',
			key: 'weight',
		},
		{
			title: 'Chiều cao (cm)',
			dataIndex: 'height',
			key: 'height',
		},
		{
			title: 'Chỉ số BMI',
			dataIndex: 'bmi',
			key: 'bmi',
			render: (bmi: number) => (
				<Space>
					<span>{bmi}</span>
					{getBMITag(bmi)}
				</Space>
			),
		},
		{
			title: 'Nhịp tim (bpm)',
			dataIndex: 'heartRate',
			key: 'heartRate',
		},
		{
			title: 'Ngủ (giờ)',
			dataIndex: 'sleepHours',
			key: 'sleepHours',
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: Fitness.HealthRecord) => (
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
		<Card 
			title="Nhật ký chỉ số sức khỏe" 
			extra={
				<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm chỉ số
				</Button>
			}
		>
			<Table 
				columns={columns} 
				dataSource={data} 
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>

			<Modal
				title={editingRecord ? 'Sửa chỉ số' : 'Thêm chỉ số'}
				visible={visible}
				onCancel={() => setVisible(false)}
				onOk={() => form.submit()}
				destroyOnClose
				okText="Lưu"
				cancelText="Hủy"
			>
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<Form.Item name="date" label="Ngày ghi nhận" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
						<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true, message: 'Nhập cân nặng' }]}>
								<InputNumber min={1} step={0.1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true, message: 'Nhập chiều cao' }]}>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="heartRate" label="Nhịp tim lúc nghỉ (bpm)" rules={[{ required: true, message: 'Nhập nhịp tim' }]}>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="sleepHours" label="Giờ ngủ" rules={[{ required: true, message: 'Nhập số giờ ngủ' }]}>
								<InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</Card>
	);
};

export default HealthMetrics;
