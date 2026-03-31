import { Button, Card, Space, Table, Select, Modal, Form, message, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel, useLocation } from 'umi';
import { SwapOutlined } from '@ant-design/icons';
import { QuanLyCauLacBo, clubService } from '@/services/ClubManagement/clubService';

const MemberManagement: React.FC = () => {
	const { danhSachDonDangKy, danhSachCauLacBo, fetchDanhSachDonDangKy, fetchDanhSachCauLacBo } = useModel('club' as any);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [transferVisible, setTransferVisible] = useState(false);
	const [targetClubId, setTargetClubId] = useState<string | undefined>(undefined);
	const [idCauLacBoChon, setidCauLacBoChon] = useState<string | undefined>(undefined);

	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const idCauLacBoBanDau = query.get('idCauLacBo');

	useEffect(() => {
		fetchDanhSachDonDangKy();
		fetchDanhSachCauLacBo();
		if (idCauLacBoBanDau) {
			setidCauLacBoChon(idCauLacBoBanDau);
		}
	}, [fetchDanhSachDonDangKy, fetchDanhSachCauLacBo, idCauLacBoBanDau]);

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const handleBulkTransfer = () => {
		if (!targetClubId) {
			message.error('Vui lòng chọn câu lạc bộ đích');
			return;
		}
		clubService.chuyenCauLacBo(selectedRowKeys as string[], targetClubId);
		message.success(`Đã chuyển ${selectedRowKeys.length} thành viên thành công`);
		setTransferVisible(false);
		setSelectedRowKeys([]);
		fetchDanhSachDonDangKy();
	};

	const thanhVien = danhSachDonDangKy.filter(
		(app: QuanLyCauLacBo.DonDangKy) => 
			app.trangThai === QuanLyCauLacBo.TrangThaiDon.DA_DUYET &&
			(!idCauLacBoChon || app.idCauLacBo === idCauLacBoChon)
	);

	const columns = [
		{
			title: 'Họ và tên',
			dataIndex: 'hoTen',
			key: 'hoTen',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDienThoai',
			key: 'soDienThoai',
		},
		{
			title: 'Câu lạc bộ hiện tại',
			dataIndex: 'idCauLacBo',
			key: 'idCauLacBo',
			render: (idCauLacBo: string) => danhSachCauLacBo.find((c: any) => c.idCauLacBo === idCauLacBo)?.tenCauLacBo || idCauLacBo,
		},
	];

	return (
		<div>
			<Card
				title="Quản lý thành viên"
				extra={
					<Button
						type="primary"
						icon={<SwapOutlined />}
						disabled={selectedRowKeys.length === 0}
						onClick={() => setTransferVisible(true)}
					>
						Chuyển câu lạc bộ
					</Button>
				}
			>
				<div style={{ marginBottom: 16 }}>
					<Space>
						<span>Lọc theo Câu lạc bộ:</span>
						<Select
							style={{ width: 250 }}
							placeholder="Tất cả Câu lạc bộ"
							allowClear
							value={idCauLacBoChon}
							onChange={setidCauLacBoChon}
						>
							{danhSachCauLacBo.map((club: QuanLyCauLacBo.CauLacBo) => (
								<Select.Option key={club.idCauLacBo} value={club.idCauLacBo}>
									{club.tenCauLacBo}
								</Select.Option>
							))}
						</Select>
						<Tag color="blue">{thanhVien.length} Thành viên</Tag>
					</Space>
				</div>
				<Table
					rowSelection={rowSelection}
					columns={columns}
					dataSource={thanhVien}
					rowKey="id"
					pagination={{ pageSize: 15 }}
				/>
			</Card>

			{/* Chuyển Câu lạc bộ Modal */}
			<Modal
				title="Chuyển thành viên sang câu lạc bộ khác"
				visible={transferVisible}
				onCancel={() => setTransferVisible(false)}
				onOk={handleBulkTransfer}
			>
				<p>Bạn đang thực hiện chuyển {selectedRowKeys.length} thành viên.</p>
				<Form layout="vertical">
					<Form.Item label="Chọn câu lạc bộ đích" required>
						<Select
							placeholder="Chọn câu lạc bộ"
							style={{ width: '100%' }}
							value={targetClubId}
							onChange={setTargetClubId}
						>
							{danhSachCauLacBo.map((club: QuanLyCauLacBo.CauLacBo) => (
								<Select.Option key={club.idCauLacBo} value={club.idCauLacBo}>
									{club.tenCauLacBo}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default MemberManagement;
