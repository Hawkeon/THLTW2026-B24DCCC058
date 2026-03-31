import { Button, Card, Popconfirm, Space, Table, Tag, Tooltip, Input, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined, SearchOutlined } from '@ant-design/icons';
import ClubForm from './components/ClubForm';
import { QuanLyCauLacBo } from '@/services/ClubManagement/clubService';

const ClubList: React.FC = () => {
	const { danhSachCauLacBo, dangTai, fetchDanhSachCauLacBo, xoaCauLacBo } = useModel('club' as any);
	const [visible, setVisible] = useState(false);
	const [editingRecord, setEditingRecord] = useState<QuanLyCauLacBo.CauLacBo | undefined>(undefined);
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		fetchDanhSachCauLacBo();
	}, [fetchDanhSachCauLacBo]);

	const columns = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'hinhAnh',
			key: 'hinhAnh',
			width: 120,
			render: (hinhAnh: string) => <Avatar src={hinhAnh} icon={<TeamOutlined />} size="large" />,
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'tenCauLacBo',
			key: 'tenCauLacBo',
			sorter: (a: QuanLyCauLacBo.CauLacBo, b: QuanLyCauLacBo.CauLacBo) => a.tenCauLacBo.localeCompare(b.tenCauLacBo),
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			key: 'ngayThanhLap',
			render: (date: string) => date,
		},
		{
			title: 'Chủ nhiệm',
			dataIndex: 'chuNhiem',
			key: 'chuNhiem',
			render: (chuNhiem: string) => (
				<Space>
					<UserOutlined />
					{chuNhiem}
				</Space>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'dangHoatDong',
			key: 'dangHoatDong',
			render: (dangHoatDong: boolean) => (
				<Tag color={dangHoatDong ? 'green' : 'red'}>
					{dangHoatDong ? 'Đang hoạt động' : 'Ngừng hoạt động'}
				</Tag>
			),
		},
		{
			title: 'Hành động',
			key: 'actions',
			width: 250,
			render: (_: any, record: QuanLyCauLacBo.CauLacBo) => (
				<Space size="middle">
					<Tooltip title="Chỉnh sửa">
						<Button
							type="primary"
							icon={<EditOutlined />}
							onClick={() => {
								setEditingRecord(record);
								setVisible(true);
							}}
						/>
					</Tooltip>
					<Tooltip title="Xem thành viên">
						<Button
							icon={<TeamOutlined />}
							onClick={() => history.push(`/club-management/members?idCauLacBo=${record.idCauLacBo}`)}
						>
							Thành viên
						</Button>
					</Tooltip>
					<Popconfirm
						title="Bạn có chắc chắn muốn xóa câu lạc bộ này?"
						onConfirm={() => xoaCauLacBo(record.idCauLacBo)}
						okText="Có"
						cancelText="Không"
					>
						<Button danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	const filteredData = danhSachCauLacBo.filter(
		(item: QuanLyCauLacBo.CauLacBo) =>
			item.tenCauLacBo.toLowerCase().includes(searchText.toLowerCase()) ||
			item.chuNhiem.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<div>
			<Card
				title="Danh sách câu lạc bộ"
				extra={
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingRecord(undefined);
							setVisible(true);
						}}
					>
						Thêm câu lạc bộ
					</Button>
				}
			>
				<div style={{ marginBottom: 16 }}>
					<Input
						placeholder="Tìm kiếm theo tên hoặc chủ nhiệm"
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 300 }}
						allowClear
					/>
				</div>
				<Table
					columns={columns}
					dataSource={filteredData}
					rowKey="idCauLacBo"
					loading={dangTai}
					pagination={{ pageSize: 10 }}
				/>
			</Card>

			<ClubForm
				visible={visible}
				onCancel={() => setVisible(false)}
				editingRecord={editingRecord}
			/>
		</div>
	);
};

export default ClubList;
