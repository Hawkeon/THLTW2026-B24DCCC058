import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, DatePicker, Select, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { diplomaService } from '@/services/DiplomaManagement/diplomaService';
import { DiplomaManagement } from '@/services/DiplomaManagement/typing';
import moment from 'moment';

const DecisionList: React.FC = () => {
	const [data, setData] = useState<DiplomaManagement.GraduationDecision[]>([]);
	const [registries, setRegistries] = useState<DiplomaManagement.Registry[]>([]);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();

	const fetchData = () => {
		setLoading(true);
		setData(diplomaService.getDecisions());
		setRegistries(diplomaService.getRegistries());
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleAddOrEdit = (values: any) => {
		const registry = registries.find(r => r.id === values.registryId);
		const payload = {
			...values,
			issueDate: values.issueDate.format('YYYY-MM-DD'),
			registryYear: registry?.year || 0,
		};

		if (editingId) {
			diplomaService.updateDecision(editingId, payload);
			message.success('Cập nhật quyết định thành công');
		} else {
			diplomaService.addDecision(payload);
			message.success('Thêm quyết định thành công');
		}
		setIsModalVisible(false);
		setEditingId(null);
		form.resetFields();
		fetchData();
	};

	const handleDelete = (id: string) => {
		diplomaService.deleteDecision(id);
		message.success('Xóa quyết định thành công');
		fetchData();
	};

	const columns = [
		{ title: 'Số quyết định', dataIndex: 'decisionNumber', key: 'decisionNumber' },
		{ title: 'Ngày ban hành', dataIndex: 'issueDate', key: 'issueDate' },
		{ title: 'Trích yếu', dataIndex: 'summary', key: 'summary' },
		{ title: 'Năm sổ', dataIndex: 'registryYear', key: 'registryYear' },
		{ title: 'Lượt tra cứu', dataIndex: 'viewCount', key: 'viewCount' },
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: DiplomaManagement.GraduationDecision) => (
				<Space>
					<Button
						icon={<EditOutlined />}
						onClick={() => {
							setEditingId(record.id);
							form.setFieldsValue({
								...record,
								issueDate: moment(record.issueDate),
							});
							setIsModalVisible(true);
						}}
					/>
					<Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)}>
						<Button icon={<DeleteOutlined />} danger />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card title="Quản lý Quyết định tốt nghiệp">
			<Space style={{ marginBottom: 16 }}>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => {
						setEditingId(null);
						form.resetFields();
						setIsModalVisible(true);
					}}
				>
					Thêm quyết định
				</Button>
			</Space>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="id"
				loading={loading}
			/>

			<Modal
				title={editingId ? "Sửa Quyết định" : "Thêm Quyết định"}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onOk={() => form.submit()}
			>
				<Form form={form} onFinish={handleAddOrEdit} layout="vertical">
					<Form.Item name="decisionNumber" label="Số quyết định (Số QĐ)" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="issueDate" label="Ngày ban hành" rules={[{ required: true }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="summary" label="Trích yếu" rules={[{ required: true }]}>
						<Input.TextArea />
					</Form.Item>
					<Form.Item name="registryId" label="Sổ văn bằng (Năm)" rules={[{ required: true }]}>
						<Select placeholder="Chọn sổ văn bằng">
							{registries.map(r => (
								<Select.Option key={r.id} value={r.id}>{r.year}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default DecisionList;
