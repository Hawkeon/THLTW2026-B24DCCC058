import React, { useState } from 'react';
import { Card, Form, Input, DatePicker, Button, Table, message, Alert, Descriptions, Divider, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { diplomaService } from '@/services/DiplomaManagement/diplomaService';
import { DiplomaManagement } from '@/services/DiplomaManagement/typing';

const { Title } = Typography;

const DiplomaLookup: React.FC = () => {
	const [results, setResults] = useState<DiplomaManagement.DiplomaRecord[]>([]);
	const [searched, setSearched] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedDiploma, setSelectedDiploma] = useState<DiplomaManagement.DiplomaRecord | null>(null);
	const [decision, setDecision] = useState<DiplomaManagement.GraduationDecision | null>(null);
	const [templates, setTemplates] = useState<DiplomaManagement.TemplateField[]>([]);
	const [form] = Form.useForm();

	const handleSearch = (values: any) => {
		setLoading(true);
		try {
			const searchParams = {
				...values,
				dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
			};
			const res = diplomaService.lookup(searchParams);
			setResults(res);
			setSearched(true);
			setSelectedDiploma(null);
			setDecision(null);
			setTemplates(diplomaService.getTemplates());
			if (res.length === 0) {
				message.info('Không tìm thấy kết quả phù hợp');
			}
		} catch (error: any) {
			message.error(error.message || 'Có lỗi xảy ra');
		} finally {
			setLoading(false);
		}
	};

	const onViewDetail = (record: DiplomaManagement.DiplomaRecord) => {
		setSelectedDiploma(record);
		const decisions = diplomaService.getDecisions();
		const d = decisions.find(item => item.id === record.decisionId) || null;
		setDecision(d);
		if (d) {
			diplomaService.incrementDecisionView(d.id);
		}
	};

	const columns = [
		{ title: 'Số vào sổ', dataIndex: 'registryNumber', key: 'registryNumber' },
		{ title: 'Số hiệu', dataIndex: 'diplomaNumber', key: 'diplomaNumber' },
		{ title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
		{ title: 'Ngày sinh', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: DiplomaManagement.DiplomaRecord) => (
				<Button type="link" onClick={() => onViewDetail(record)}>Xem chi tiết</Button>
			),
		},
	];

	return (
		<div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
			<Card title={<Title level={3} style={{ textAlign: 'center', margin: 0 }}>TRA CỨU THÔNG TIN VĂN BẰNG</Title>} bordered={false} className="shadow">
				<Alert 
					message="Hướng dẫn tra cứu" 
					description="Nhập ít nhất 2 thông tin bên dưới để thực hiện tra cứu (VD: Mã sinh viên + Họ tên)." 
					type="info" 
					showIcon 
					style={{ marginBottom: 24 }}
				/>
				<Form form={form} onFinish={handleSearch} layout="vertical">
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
						<Form.Item name="studentId" label="Mã sinh viên (MSV)">
							<Input placeholder="Nhập mã sinh viên" allowClear />
						</Form.Item>
						<Form.Item name="fullName" label="Họ và tên">
							<Input placeholder="Nhập họ và tên" allowClear />
						</Form.Item>
						<Form.Item name="diplomaNumber" label="Số hiệu văn bằng">
							<Input placeholder="Nhập số hiệu văn bằng" allowClear />
						</Form.Item>
						<Form.Item name="registryNumber" label="Số vào sổ">
							<Input placeholder="Nhập số vào sổ" allowClear />
						</Form.Item>
						<Form.Item name="dateOfBirth" label="Ngày sinh">
							<DatePicker style={{ width: '100%' }} placeholder="Chọn ngày sinh" allowClear />
						</Form.Item>
					</div>
					<Form.Item style={{ textAlign: 'center', marginTop: 16 }}>
						<Button type="primary" htmlType="submit" icon={<SearchOutlined />} size="large" loading={loading} style={{ width: 200 }}>
							Tra cứu
						</Button>
					</Form.Item>
				</Form>

				{searched && results.length > 0 && (
					<div style={{ marginTop: 32 }}>
						<Divider>Kết quả tìm kiếm</Divider>
						<Table 
							columns={columns} 
							dataSource={results} 
							rowKey="id" 
							pagination={results.length > 5 ? { pageSize: 5 } : false}
						/>
					</div>
				)}

				{selectedDiploma && (
					<Card style={{ marginTop: 32, border: '1px solid #1890ff' }} title="CHI TIẾT VĂN BẰNG">
						<Descriptions bordered column={2}>
							<Descriptions.Item label="Số vào sổ" span={1}>{selectedDiploma.registryNumber}</Descriptions.Item>
							<Descriptions.Item label="Số hiệu văn bằng" span={1}>{selectedDiploma.diplomaNumber}</Descriptions.Item>
							<Descriptions.Item label="Mã sinh viên" span={1}>{selectedDiploma.studentId}</Descriptions.Item>
							<Descriptions.Item label="Họ và tên" span={1}>{selectedDiploma.fullName}</Descriptions.Item>
							<Descriptions.Item label="Ngày sinh" span={2}>{selectedDiploma.dateOfBirth}</Descriptions.Item>
							
							{templates.map(t => (
								<Descriptions.Item key={t.id} label={t.fieldName} span={1}>
									{selectedDiploma.dynamicFields[t.id] || '-'}
								</Descriptions.Item>
							))}
						</Descriptions>

						{decision && (
							<>
								<Divider orientation="left">Thông tin Quyết định tốt nghiệp</Divider>
								<Descriptions bordered column={2}>
									<Descriptions.Item label="Số quyết định" span={1}>{decision.decisionNumber}</Descriptions.Item>
									<Descriptions.Item label="Ngày ban hành" span={1}>{decision.issueDate}</Descriptions.Item>
									<Descriptions.Item label="Trích yếu" span={2}>{decision.summary}</Descriptions.Item>
									<Descriptions.Item label="Năm sổ văn bằng" span={2}>{decision.registryYear}</Descriptions.Item>
								</Descriptions>
							</>
						)}
					</Card>
				)}
			</Card>
		</div>
	);
};

export default DiplomaLookup;
