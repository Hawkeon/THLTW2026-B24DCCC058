import { Button, Card, Popconfirm, Space, Table, Tag, Tooltip, Input, Modal, Form, message, Descriptions } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { CheckOutlined, CloseOutlined, EyeOutlined, DeleteOutlined, HistoryOutlined, SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { QuanLyCauLacBo } from '@/services/ClubManagement/clubService';
import RegistrationForm from './components/RegistrationForm';

const RegistrationList: React.FC = () => {
	const { danhSachDonDangKy, danhSachCauLacBo, fetchDanhSachDonDangKy, fetchDanhSachCauLacBo, capNhatTrangThai, xoaDonDangKy } = useModel('club' as any);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [historyVisible, setHistoryVisible] = useState(false);
	const [detailVisible, setDetailVisible] = useState(false);
	const [formVisible, setFormVisible] = useState(false);
	const [rejectVisible, setRejectVisible] = useState(false);
	const [currentRecord, setCurrentRecord] = useState<QuanLyCauLacBo.DonDangKy | undefined>(undefined);
	const [rejectionReason, setRejectionReason] = useState('');
	const [searchText, setSearchText] = useState('');
	const [rejectBulk, setRejectBulk] = useState(false);

	useEffect(() => {
		fetchDanhSachDonDangKy();
		fetchDanhSachCauLacBo();
	}, [fetchDanhSachDonDangKy, fetchDanhSachCauLacBo]);

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const handleApprove = (id: string) => {
		Modal.confirm({
			title: 'Xác nhận duyệt đơn',
			content: 'Bạn có chắc chắn muốn duyệt đơn đăng ký này?',
			onOk: () => {
				capNhatTrangThai(id, QuanLyCauLacBo.TrangThaiDon.DA_DUYET);
				message.success('Đã duyệt đơn đăng ký');
			},
		});
	};

	const handleReject = (id: string, reason: string) => {
		capNhatTrangThai(id, QuanLyCauLacBo.TrangThaiDon.TU_CHOI, reason);
		message.success('Đã từ chối đơn đăng ký');
		setRejectVisible(false);
		setRejectionReason('');
	};

	const handleBulkApprove = () => {
		Modal.confirm({
			title: 'Xác nhận duyệt nhiều đơn',
			content: `Bạn có chắc chắn muốn duyệt ${selectedRowKeys.length} đơn đăng ký đã chọn?`,
			onOk: () => {
				selectedRowKeys.forEach((key) => {
					capNhatTrangThai(key as string, QuanLyCauLacBo.TrangThaiDon.DA_DUYET);
				});
				message.success(`Đã duyệt ${selectedRowKeys.length} đơn đăng ký`);
				setSelectedRowKeys([]);
			},
		});
	};

	const handleBulkReject = (reason: string) => {
		selectedRowKeys.forEach((key) => {
			capNhatTrangThai(key as string, QuanLyCauLacBo.TrangThaiDon.TU_CHOI, reason);
		});
		message.success(`Đã từ chối ${selectedRowKeys.length} đơn đăng ký`);
		setSelectedRowKeys([]);
		setRejectVisible(false);
		setRejectionReason('');
	};

	const columns = [
		{
			title: 'Họ và tên',
			dataIndex: 'hoTen',
			key: 'hoTen',
			sorter: (a: QuanLyCauLacBo. DonDangKy, b: QuanLyCauLacBo.DonDangKy) => a.hoTen.localeCompare(b.hoTen),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			key: 'soDienThoai',
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'idCauLacBo',
			key: 'idCauLacBo',
			render: (idCauLacBo: string) => danhSachCauLacBo.find((c: any) => c.idCauLacBo === idCauLacBo)?.tenCauLacBo || idCauLacBo,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			render: (status: QuanLyCauLacBo.TrangThaiDon) => (
				<Tag color={status === QuanLyCauLacBo.TrangThaiDon.DA_DUYET ? 'green' : status === QuanLyCauLacBo.TrangThaiDon.TU_CHOI ? 'red' : 'blue'}>
					{status === QuanLyCauLacBo.TrangThaiDon.DA_DUYET ? 'Đã duyệt' : status === QuanLyCauLacBo.TrangThaiDon.TU_CHOI ? 'Từ chối' : 'Chờ duyệt'}
				</Tag>
			),
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_: any, record: QuanLyCauLacBo.DonDangKy) => (
				<Space size="small">
					<Tooltip title="Xem chi tiết">
						<Button
							icon={<EyeOutlined />}
							onClick={() => {
								setCurrentRecord(record);
								setDetailVisible(true);
							}}
						/>
					</Tooltip>
					<Tooltip title="Chỉnh sửa">
						<Button
							icon={<EditOutlined />}
							onClick={() => {
								setCurrentRecord(record);
								setFormVisible(true);
							}}
						/>
					</Tooltip>
					{record.trangThai === QuanLyCauLacBo.TrangThaiDon.CHO_DUYET && (
						<>
							<Tooltip title="Duyệt">
								<Button
									type="primary"
									icon={<CheckOutlined />}
									onClick={() => handleApprove(record.id)}
								/>
							</Tooltip>
							<Tooltip title="Từ chối">
								<Button
									danger
									icon={<CloseOutlined />}
									onClick={() => {
										setCurrentRecord(record);
										setRejectBulk(false);
										setRejectVisible(true);
									}}
								/>
							</Tooltip>
						</>
					)}
					<Tooltip title="Xem lịch sử">
						<Button
							icon={<HistoryOutlined />}
							onClick={() => {
								setCurrentRecord(record);
								setHistoryVisible(true);
							}}
						/>
					</Tooltip>
					<Popconfirm
						title="Xóa đơn đăng ký này?"
						onConfirm={() => {
							xoaDonDangKy(record.id);
							message.success('Đã xóa');
						}}
					>
						<Button danger type="link" icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	const filteredData = danhSachDonDangKy.filter((item: QuanLyCauLacBo.DonDangKy) =>
		item.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
		item.email.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<div>
			<Card
				title="Quản lý đơn đăng ký"
				extra={
					<Space>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => {
								setCurrentRecord(undefined);
								setFormVisible(true);
							}}
						>
							Thêm mới đơn
						</Button>
						<Button
							type="primary"
							disabled={selectedRowKeys.length === 0}
							onClick={handleBulkApprove}
							style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
						>
							Duyệt {selectedRowKeys.length} đơn đã chọn
						</Button>
						<Button
							danger
							disabled={selectedRowKeys.length === 0}
							onClick={() => {
								setRejectBulk(true);
								setRejectVisible(true);
							}}
						>
							Từ chối {selectedRowKeys.length} đơn đã chọn
						</Button>
					</Space>
				}
			>
				<div style={{ marginBottom: 16 }}>
					<Input
						placeholder="Tìm kiếm theo tên hoặc email"
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 300 }}
						allowClear
					/>
				</div>
				<Table
					rowSelection={rowSelection}
					columns={columns}
					dataSource={filteredData}
					rowKey="id"
					pagination={{ pageSize: 10 }}
				/>
			</Card>

			{/* Form Modal (Add/Edit) */}
			<RegistrationForm
				visible={formVisible}
				onCancel={() => setFormVisible(false)}
				editingRecord={currentRecord}
			/>

			{/* Chi tiết Modal */}
			<Modal
				title="Chi tiết đơn đăng ký"
				visible={detailVisible}
				onCancel={() => setDetailVisible(false)}
				footer={null}
				width={700}
			>
				{currentRecord && (
					<Descriptions bordered column={1}>
						<Descriptions.Item label="Họ và tên">{currentRecord.hoTen}</Descriptions.Item>
						<Descriptions.Item label="Email">{currentRecord.email}</Descriptions.Item>
						<Descriptions.Item label="Số điện thoại">{currentRecord.soDienThoai}</Descriptions.Item>
						<Descriptions.Item label="Giới tính">{currentRecord.gioiTinh}</Descriptions.Item>
						<Descriptions.Item label="Địa chỉ">{currentRecord.diaChi}</Descriptions.Item>
						<Descriptions.Item label="Sở trường">{currentRecord.soTruong}</Descriptions.Item>
						<Descriptions.Item label="Lý do tham gia">{currentRecord.lyDo}</Descriptions.Item>
						<Descriptions.Item label="Trạng thái">
							<Tag color={currentRecord.trangThai === QuanLyCauLacBo.TrangThaiDon.DA_DUYET ? 'green' : currentRecord.trangThai === QuanLyCauLacBo.TrangThaiDon.TU_CHOI ? 'red' : 'blue'}>
								{currentRecord.trangThai === QuanLyCauLacBo.TrangThaiDon.DA_DUYET ? 'Đã duyệt' : currentRecord.trangThai === QuanLyCauLacBo.TrangThaiDon.TU_CHOI ? 'Từ chối' : 'Chờ duyệt'}
							</Tag>
						</Descriptions.Item>
						{currentRecord.ghiChu && (
							<Descriptions.Item label="Ghi chú từ chối">{currentRecord.ghiChu}</Descriptions.Item>
						)}
					</Descriptions>
				)}
			</Modal>

			{/* Lịch sử Modal */}
			<Modal
				title="Lịch sử hành động"
				visible={historyVisible}
				onCancel={() => setHistoryVisible(false)}
				footer={null}
				width={600}
			>
				<Table
					dataSource={currentRecord?.lichSu || []}
					columns={[
						{ title: 'Hành động', dataIndex: 'hanhDong', key: 'hanhDong' },
						{ title: 'Thời gian', dataIndex: 'thoiGian', key: 'thoiGian' },
						{ title: 'Lý do/Ghi chú', dataIndex: 'lyDo', key: 'lyDo' },
					]}
					pagination={false}
					size="small"
				/>
			</Modal>

			{/* Từ chối Modal */}
			<Modal
				title={rejectBulk ? `Từ chối ${selectedRowKeys.length} đơn` : "Lý do từ chối"}
				visible={rejectVisible}
				onCancel={() => setRejectVisible(false)}
				onOk={() => {
					if (!rejectionReason) {
						message.error('Vui lòng nhập lý do từ chối');
						return;
					}
					if (rejectBulk) {
						handleBulkReject(rejectionReason);
					} else if (currentRecord) {
						handleReject(currentRecord.id, rejectionReason);
					}
				}}
			>
				<Form layout="vertical">
					<Form.Item label="Lý do từ chối" required>
						<Input.TextArea
							rows={4}
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							placeholder="Nhập lý do từ chối (Bắt buộc)"
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default RegistrationList;
