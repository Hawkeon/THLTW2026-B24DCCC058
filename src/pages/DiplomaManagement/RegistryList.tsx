import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, InputNumber, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { diplomaService } from '@/services/DiplomaManagement/diplomaService';
import { DiplomaManagement } from '@/services/DiplomaManagement/typing';

const RegistryList: React.FC = () => {
	const [data, setData] = useState<DiplomaManagement.Registry[]>([]);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	const fetchData = () => {
		setLoading(true);
		const res = diplomaService.getRegistries();
		setData(res);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleAdd = async (values: { year: number }) => {
		try {
			diplomaService.addRegistry(values);
			message.success('Thêm sổ văn bằng thành công');
			setIsModalVisible(false);
			form.resetFields();
			fetchData();
		} catch (error) {
			message.error('Có lỗi xảy ra');
		}
	};

	const columns = [
		{
			title: 'Năm',
			dataIndex: 'year',
			key: 'year',
		},
		{
			title: 'ID Sổ',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Số thứ tự hiện tại',
			dataIndex: 'currentRunningNumber',
			key: 'currentRunningNumber',
		},
	];

	return (
		<Card title="Quản lý Sổ văn bằng">
			<Space style={{ marginBottom: 16 }}>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setIsModalVisible(true)}
				>
					Thêm sổ mới
				</Button>
			</Space>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="id"
				loading={loading}
				pagination={{ pageSize: 10 }}
			/>

			<Modal
				title="Thêm Sổ văn bằng"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onOk={() => form.submit()}
			>
				<Form form={form} onFinish={handleAdd} layout="vertical">
					<Form.Item
						name="year"
						label="Năm"
						rules={[{ required: true, message: 'Vui lòng chọn năm' }]}
					>
						<InputNumber style={{ width: '100%' }} placeholder="Nhập năm (VD: 2024)" />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default RegistryList;
