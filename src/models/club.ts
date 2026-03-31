import { useState, useCallback } from 'react';
import { clubService, QuanLyCauLacBo } from '@/services/ClubManagement/clubService';

export default () => {
	const [danhSachCauLacBo, setDanhSachCauLacBo] = useState<QuanLyCauLacBo.CauLacBo[]>([]);
	const [danhSachDonDangKy, setDanhSachDonDangKy] = useState<QuanLyCauLacBo.DonDangKy[]>([]);
	const [dangTai, setDangTai] = useState<boolean>(false);

	const fetchDanhSachCauLacBo = useCallback(() => {
		setDangTai(true);
		clubService.seedIfEmpty();
		const data = clubService.getDanhSachCauLacBo();
		setDanhSachCauLacBo(data);
		setDangTai(false);
	}, []);

	const fetchDanhSachDonDangKy = useCallback(() => {
		setDangTai(true);
		clubService.seedIfEmpty();
		const data = clubService.getDanhSachDonDangKy();
		setDanhSachDonDangKy(data);
		setDangTai(false);
	}, []);

	const themCauLacBo = (clb: QuanLyCauLacBo.CauLacBo) => {
		clubService.luuCauLacBo(clb);
		fetchDanhSachCauLacBo();
	};

	const xoaCauLacBo = (idCauLacBo: string) => {
		clubService.xoaCauLacBo(idCauLacBo);
		fetchDanhSachCauLacBo();
	};

	const themDonDangKy = (don: QuanLyCauLacBo.DonDangKy) => {
		clubService.luuDonDangKy(don);
		fetchDanhSachDonDangKy();
	};

	const capNhatTrangThai = (id: string, trangThai: QuanLyCauLacBo.TrangThaiDon, lyDo?: string) => {
		clubService.capNhatTrangThaiDon(id, trangThai, lyDo);
		fetchDanhSachDonDangKy();
	};

	const xoaDonDangKy = (id: string) => {
		clubService.xoaDonDangKy(id);
		fetchDanhSachDonDangKy();
	};

	return {
		danhSachCauLacBo,
		danhSachDonDangKy,
		dangTai,
		fetchDanhSachCauLacBo,
		fetchDanhSachDonDangKy,
		themCauLacBo,
		xoaCauLacBo,
		themDonDangKy,
		capNhatTrangThai,
		xoaDonDangKy,
	};
};
