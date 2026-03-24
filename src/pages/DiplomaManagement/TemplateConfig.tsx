import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { diplomaService } from '@/services/DiplomaManagement/diplomaService';
import { DiplomaManagement } from '@/services/DiplomaManagement/typing';

const TemplateConfig: React.FC = () => {
	const [data, setData] = useState<DiplomaManagement.TemplateField[]>([]);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	const fetchData = () => {
		setLoading(true);
		setData(diplomaService.getTemplates());
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleAdd = (values: any) => {
		diplomaService.addTemplate(values);
		message.success('Thêm trường thông tin thành công');
		setIsModalVisible(false);
		form.resetFields();
		fetchData();
	};

	const handleDelete = (id: string) => {
		diplomaService.deleteTemplate(id);
		message.success('Xóa trường thành công');
		fetchData();
	};

	const columns = [
		{ title: 'Tên trường', dataIndex: 'fieldName', key: 'fieldName' },
		{ title: 'Loại dữ liệu', dataIndex: 'dataType', key: 'dataType' },
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: DiplomaManagement.TemplateField) => (
				<Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)}>
					<Button icon={<DeleteOutlined />} danger />
				</Popconfirm>
			),
		},
	];

	return (
		<Card title="Cấu hình biểu mẫu (Trường thông tin động)">
			<Space style={{ marginBottom: 16 }}>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setIsModalVisible(true)}
				>
					Thêm trường mới
				</Button>
			</Space>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="id"
				loading={loading}
			/>

			<Modal
				title="Thêm trường thông tin"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onOk={() => form.submit()}
			>
				<Form form={form} onFinish={handleAdd} layout="vertical">
					<Form.Item name="fieldName" label="Tên trường (VD: Dân tộc, Nơi sinh)" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name="dataType" label="Loại dữ liệu" rules={[{ required: true }]}>
						<Select>
							<Select.Option value="String">Văn bản (String)</Select.Option>
							<Select.Option value="Number">Số (Number)</Select.Option>
							<Select.Option value="Date">Ngày tháng (Date)</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default TemplateConfig;
