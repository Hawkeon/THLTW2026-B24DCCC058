import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, InputNumber, DatePicker, Select, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { diplomaService } from '@/services/DiplomaManagement/diplomaService';
import { DiplomaManagement } from '@/services/DiplomaManagement/typing';
import moment from 'moment';

const DiplomaList: React.FC = () => {
	const [data, setData] = useState<DiplomaManagement.DiplomaRecord[]>([]);
	const [decisions, setDecisions] = useState<DiplomaManagement.GraduationDecision[]>([]);
	const [templates, setTemplates] = useState<DiplomaManagement.TemplateField[]>([]);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();

	const fetchData = () => {
		setLoading(true);
		setData(diplomaService.getDiplomas());
		setDecisions(diplomaService.getDecisions());
		setTemplates(diplomaService.getTemplates());
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleAddOrEdit = (values: any) => {
		const { decisionId, diplomaNumber, studentId, fullName, dateOfBirth, ...dynamicFields } = values;
		const payload = {
			decisionId,
			diplomaNumber,
			studentId,
			fullName,
			dateOfBirth: dateOfBirth.format('YYYY-MM-DD'),
			dynamicFields,
		};

		// Convert dynamic date fields
		templates.forEach(t => {
			if (t.dataType === 'Date' && payload.dynamicFields[t.id]) {
				payload.dynamicFields[t.id] = payload.dynamicFields[t.id].format('YYYY-MM-DD');
			}
		});

		try {
			if (editingId) {
				diplomaService.updateDiploma(editingId, payload);
				message.success('Cập nhật thông tin văn bằng thành công');
			} else {
				diplomaService.addDiploma(payload);
				message.success('Thêm thông tin văn bằng thành công');
			}
			setIsModalVisible(false);
			setEditingId(null);
			form.resetFields();
			fetchData();
		} catch (error: any) {
			message.error(error.message || 'Có lỗi xảy ra');
		}
	};

	const handleDelete = (id: string) => {
		diplomaService.deleteDiploma(id);
		message.success('Xóa thành công');
		fetchData();
	};

	const columns = [
		{ title: 'Số vào sổ', dataIndex: 'registryNumber', key: 'registryNumber' },
		{ title: 'Số hiệu', dataIndex: 'diplomaNumber', key: 'diplomaNumber' },
		{ title: 'MSV', dataIndex: 'studentId', key: 'studentId' },
		{ title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
		{ title: 'Ngày sinh', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
		{
			title: 'Đợt TN',
			dataIndex: 'decisionId',
			key: 'decisionId',
			render: (id: string) => decisions.find(d => d.id === id)?.decisionNumber || 'N/A'
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: DiplomaManagement.DiplomaRecord) => (
				<Space>
					<Button
						icon={<EditOutlined />}
						onClick={() => {
							setEditingId(record.id);
							const dynamicValues = { ...record.dynamicFields };
							templates.forEach(t => {
								if (t.dataType === 'Date' && dynamicValues[t.id]) {
									dynamicValues[t.id] = moment(dynamicValues[t.id]);
								}
							});
							form.setFieldsValue({
								...record,
								dateOfBirth: moment(record.dateOfBirth),
								...dynamicValues,
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

	const renderDynamicField = (field: DiplomaManagement.TemplateField) => {
		switch (field.dataType) {
			case 'Number':
				return <InputNumber style={{ width: '100%' }} />;
			case 'Date':
				return <DatePicker style={{ width: '100%' }} />;
			default:
				return <Input />;
		}
	};

	return (
		<Card title="Quản lý Thông tin văn bằng">
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
					Thêm văn bằng
				</Button>
			</Space>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="id"
				loading={loading}
				scroll={{ x: 1000 }}
			/>

			<Modal
				title={editingId ? "Sửa văn bằng" : "Thêm văn bằng"}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onOk={() => form.submit()}
				width={800}
			>
				<Form form={form} onFinish={handleAddOrEdit} layout="vertical">
					<Space size="large" align="start">
						<div style={{ width: 350 }}>
							<Form.Item name="decisionId" label="Quyết định tốt nghiệp" rules={[{ required: true }]}>
								<Select placeholder="Chọn quyết định">
									{decisions.map(d => (
										<Select.Option key={d.id} value={d.id}>{d.decisionNumber} ({d.registryYear})</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item name="diplomaNumber" label="Số hiệu văn bằng" rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item name="studentId" label="Mã sinh viên (MSV)" rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item name="dateOfBirth" label="Ngày sinh" rules={[{ required: true }]}>
								<DatePicker style={{ width: '100%' }} />
							</Form.Item>
						</div>
						<div style={{ width: 350 }}>
							<h3>Thông tin bổ sung</h3>
							{templates.map(field => (
								<Form.Item key={field.id} name={field.id} label={field.fieldName}>
									{renderDynamicField(field)}
								</Form.Item>
							))}
							{templates.length === 0 && <p style={{ color: '#999' }}>Chưa cấu hình trường thông tin động</p>}
						</div>
					</Space>
				</Form>
			</Modal>
		</Card>
	);
};

export default DiplomaList;
