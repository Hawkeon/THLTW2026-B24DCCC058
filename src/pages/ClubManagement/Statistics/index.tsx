import { Card, Col, Row, Statistic, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import ReactApexChart from 'react-apexcharts';
import { QuanLyCauLacBo } from '@/services/ClubManagement/clubService';

const Statistics: React.FC = () => {
	const { danhSachDonDangKy, danhSachCauLacBo, fetchDanhSachDonDangKy, fetchDanhSachCauLacBo, dangTai } = useModel('club' as any);

	useEffect(() => {
		fetchDanhSachDonDangKy();
		fetchDanhSachCauLacBo();
	}, [fetchDanhSachDonDangKy, fetchDanhSachCauLacBo]);

	const tongCauLacBo = danhSachCauLacBo.length;
	const choDuyet = danhSachDonDangKy.filter((a: any) => a.trangThai === QuanLyCauLacBo.TrangThaiDon.CHO_DUYET).length;
	const daDuyet = danhSachDonDangKy.filter((a: any) => a.trangThai === QuanLyCauLacBo.TrangThaiDon.DA_DUYET).length;
	const tuChoi = danhSachDonDangKy.filter((a: any) => a.trangThai === QuanLyCauLacBo.TrangThaiDon.TU_CHOI).length;

	// Chuẩn bị dữ liệu cho biểu đồ
	const danhMucBieuDo = danhSachCauLacBo.map((c: any) => c.tenCauLacBo);
	const duLieuChoDuyet = danhSachCauLacBo.map((clb: any) => {
		return danhSachDonDangKy.filter((a: any) => a.idCauLacBo === clb.idCauLacBo && a.trangThai === QuanLyCauLacBo.TrangThaiDon.CHO_DUYET).length;
	});
	const duLieuDaDuyet = danhSachCauLacBo.map((clb: any) => {
		return danhSachDonDangKy.filter((a: any) => a.idCauLacBo === clb.idCauLacBo && a.trangThai === QuanLyCauLacBo.TrangThaiDon.DA_DUYET).length;
	});
	const duLieuTuChoi = danhSachCauLacBo.map((clb: any) => {
		return danhSachDonDangKy.filter((a: any) => a.idCauLacBo === clb.idCauLacBo && a.trangThai === QuanLyCauLacBo.TrangThaiDon.TU_CHOI).length;
	});

	const optionsBieuDo: any = {
		chart: {
			type: 'bar',
			height: 350,
			stacked: false,
			toolbar: {
				show: true,
			},
			zoom: {
				enabled: true,
			},
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '55%',
				endingShape: 'rounded',
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		xaxis: {
			categories: danhMucBieuDo,
			title: {
				text: 'Câu lạc bộ',
			},
		},
		yaxis: {
			title: {
				text: 'Số lượng đơn đăng ký',
			},
		},
		fill: {
			opacity: 1,
		},
		tooltip: {
			y: {
				formatter: (val: number) => val + ' đơn',
			},
		},
		colors: ['#1890ff', '#52c41a', '#ff4d4f'],
		legend: {
			position: 'top',
			horizontalAlign: 'left',
		},
	};

	const seriesBieuDo = [
		{
			name: 'Chờ duyệt',
			data: duLieuChoDuyet,
		},
		{
			name: 'Đã duyệt',
			data: duLieuDaDuyet,
		},
		{
			name: 'Từ chối',
			data: duLieuTuChoi,
		},
	];

	if (dangTai) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

	return (
		<div>
			<Row gutter={16}>
				<Col span={6}>
					<Card>
						<Statistic title="Tổng câu lạc bộ" value={tongCauLacBo} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Đang chờ duyệt" value={choDuyet} valueStyle={{ color: '#1890ff' }} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Đã duyệt (Thành viên)" value={daDuyet} valueStyle={{ color: '#52c41a' }} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Đã từ chối" value={tuChoi} valueStyle={{ color: '#ff4d4f' }} />
					</Card>
				</Col>
			</Row>

			<Row gutter={16} style={{ marginTop: 24 }}>
				<Col span={24}>
					<Card title="Thống kê đơn đăng ký theo câu lạc bộ">
						<ReactApexChart options={optionsBieuDo} series={seriesBieuDo} type="bar" height={400} />
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Statistics;
