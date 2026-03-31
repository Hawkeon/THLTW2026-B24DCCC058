export namespace QuanLyCauLacBo {
	export interface CauLacBo {
		idCauLacBo: string;
		tenCauLacBo: string;
		hinhAnh?: string;
		ngayThanhLap: string;
		moTa: string; // HTML
		chuNhiem: string;
		dangHoatDong: boolean;
	}

	export enum TrangThaiDon {
		CHO_DUYET = 'CHO_DUYET',
		DA_DUYET = 'DA_DUYET',
		TU_CHOI = 'TU_CHOI',
	}

	export interface LichSuHanhDong {
		hanhDong: string;
		thoiGian: string;
		lyDo?: string;
	}

	export interface DonDangKy {
		id: string;
		hoTen: string;
		email: string;
		soDienThoai: string;
		gioiTinh: string;
		diaChi: string;
		soTruong: string;
		idCauLacBo: string;
		lyDo: string;
		trangThai: TrangThaiDon;
		ghiChu?: string;
		lichSu: LichSuHanhDong[];
	}
}

const STORAGE_KEYS = {
	CLB_DANH_SACH: 'clb_danh_sach',
	CLB_DON_DANG_KY: 'clb_don_dang_ky',
};

const getFromStorage = <T>(key: string, defaultValue: T): T => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = <T>(key: string, data: T) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const clubService = {
	// Di cư dữ liệu (Migration)
	migrate: () => {
		const oldClubs = localStorage.getItem('cm_clubs');
		const oldApps = localStorage.getItem('cm_applications');

		if (oldClubs && !localStorage.getItem(STORAGE_KEYS.CLB_DANH_SACH)) {
			const clubs = JSON.parse(oldClubs).map((c: any) => ({
				idCauLacBo: c.clubId,
				tenCauLacBo: c.name,
				hinhAnh: c.avatar,
				ngayThanhLap: c.foundedDate,
				moTa: c.description,
				chuNhiem: c.leader,
				dangHoatDong: c.isActive,
			}));
			saveToStorage(STORAGE_KEYS.CLB_DANH_SACH, clubs);
		}

		if (oldApps && !localStorage.getItem(STORAGE_KEYS.CLB_DON_DANG_KY)) {
			const apps = JSON.parse(oldApps).map((a: any) => ({
				id: a.id,
				hoTen: a.fullName,
				email: a.email,
				soDienThoai: a.phoneNumber,
				gioiTinh: a.gender,
				diaChi: a.address,
				soTruong: a.skills,
				idCauLacBo: a.clubId,
				lyDo: a.reason,
				trangThai: a.status === 'Approved' ? QuanLyCauLacBo.TrangThaiDon.DA_DUYET : 
						   a.status === 'Rejected' ? QuanLyCauLacBo.TrangThaiDon.TU_CHOI : 
						   QuanLyCauLacBo.TrangThaiDon.CHO_DUYET,
				ghiChu: a.note,
				lichSu: a.history.map((h: any) => ({
					hanhDong: h.action,
					thoiGian: h.time,
					lyDo: h.reason,
				})),
			}));
			saveToStorage(STORAGE_KEYS.CLB_DON_DANG_KY, apps);
		}
	},

	// Thao tác Câu lạc bộ
	getDanhSachCauLacBo: (): QuanLyCauLacBo.CauLacBo[] => getFromStorage(STORAGE_KEYS.CLB_DANH_SACH, []),
	luuCauLacBo: (clb: QuanLyCauLacBo.CauLacBo) => {
		const danhSach = clubService.getDanhSachCauLacBo();
		const index = danhSach.findIndex((c) => c.idCauLacBo === clb.idCauLacBo);
		if (index > -1) {
			danhSach[index] = clb;
		} else {
			danhSach.push(clb);
		}
		saveToStorage(STORAGE_KEYS.CLB_DANH_SACH, danhSach);
	},
	xoaCauLacBo: (idCauLacBo: string) => {
		const danhSach = clubService.getDanhSachCauLacBo().filter((c) => c.idCauLacBo !== idCauLacBo);
		saveToStorage(STORAGE_KEYS.CLB_DANH_SACH, danhSach);
	},

	// Thao tác Đơn đăng ký
	getDanhSachDonDangKy: (): QuanLyCauLacBo.DonDangKy[] => getFromStorage(STORAGE_KEYS.CLB_DON_DANG_KY, []),
	luuDonDangKy: (don: QuanLyCauLacBo.DonDangKy) => {
		const danhSach = clubService.getDanhSachDonDangKy();
		const index = danhSach.findIndex((a) => a.id === don.id);
		if (index > -1) {
			danhSach[index] = don;
		} else {
			danhSach.push(don);
		}
		saveToStorage(STORAGE_KEYS.CLB_DON_DANG_KY, danhSach);
	},
	capNhatTrangThaiDon: (
		id: string,
		trangThai: QuanLyCauLacBo.TrangThaiDon,
		lyDo?: string,
		tenAdmin: string = 'Quản trị viên',
	) => {
		const danhSach = clubService.getDanhSachDonDangKy();
		const index = danhSach.findIndex((a) => a.id === id);
		if (index > -1) {
			const don = danhSach[index];
			const log: QuanLyCauLacBo.LichSuHanhDong = {
				hanhDong: `${tenAdmin} ${trangThai === QuanLyCauLacBo.TrangThaiDon.DA_DUYET ? 'đã duyệt' : 'từ chối'}`,
				thoiGian: new Date().toLocaleString(),
				lyDo,
			};
			don.trangThai = trangThai;
			if (lyDo) don.ghiChu = lyDo;
			don.lichSu = [...(don.lichSu || []), log];
			danhSach[index] = don;
			saveToStorage(STORAGE_KEYS.CLB_DON_DANG_KY, danhSach);
		}
	},
	xoaDonDangKy: (id: string) => {
		const danhSach = clubService.getDanhSachDonDangKy().filter((a) => a.id !== id);
		saveToStorage(STORAGE_KEYS.CLB_DON_DANG_KY, danhSach);
	},

	// Chuyển câu lạc bộ
	chuyenCauLacBo: (ids: string[], idCauLacBoMoi: string) => {
		const danhSach = clubService.getDanhSachDonDangKy();
		ids.forEach((id) => {
			const index = danhSach.findIndex((a) => a.id === id);
			if (index > -1) {
				danhSach[index].idCauLacBo = idCauLacBoMoi;
				danhSach[index].lichSu.push({
					hanhDong: `Chuyển sang câu lạc bộ ${idCauLacBoMoi}`,
					thoiGian: new Date().toLocaleString(),
				});
			}
		});
		saveToStorage(STORAGE_KEYS.CLB_DON_DANG_KY, danhSach);
	},

	seedIfEmpty: () => {
		clubService.migrate();
		if (clubService.getDanhSachCauLacBo().length === 0) {
			const initialClubs: QuanLyCauLacBo.CauLacBo[] = [
				{
					idCauLacBo: 'clb1',
					tenCauLacBo: 'Câu lạc bộ Lập trình',
					hinhAnh: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=100&h=100&fit=crop',
					ngayThanhLap: '2023-01-01',
					moTa: '<p>Câu lạc bộ dành cho những người yêu thích lập trình và công nghệ.</p>',
					chuNhiem: 'Nguyễn Văn A',
					dangHoatDong: true,
				},
				{
					idCauLacBo: 'clb2',
					tenCauLacBo: 'Câu lạc bộ Cờ vua',
					hinhAnh: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=100&h=100&fit=crop',
					ngayThanhLap: '2022-05-15',
					moTa: '<p>Nơi rèn luyện tư duy chiến thuật qua bộ môn cờ vua.</p>',
					chuNhiem: 'Trần Thị B',
					dangHoatDong: true,
				},
			];
			saveToStorage(STORAGE_KEYS.CLB_DANH_SACH, initialClubs);
		}

		if (clubService.getDanhSachDonDangKy().length === 0) {
			const initialApps: QuanLyCauLacBo.DonDangKy[] = [
				{
					id: 'don1',
					hoTen: 'Lê Văn C',
					email: 'levanc@example.com',
					soDienThoai: '0123456789',
					gioiTinh: 'Nam',
					diaChi: 'Hà Nội',
					soTruong: 'React, Node.js',
					idCauLacBo: 'clb1',
					lyDo: 'Tôi muốn học hỏi thêm về lập trình.',
					trangThai: QuanLyCauLacBo.TrangThaiDon.CHO_DUYET,
					lichSu: [{ hanhDong: 'Đã nộp đơn', thoiGian: '2024-03-31 09:00' }],
				},
				{
					id: 'don2',
					hoTen: 'Phạm Thị D',
					email: 'phamthid@example.com',
					soDienThoai: '0987654321',
					gioiTinh: 'Nữ',
					diaChi: 'TP.HCM',
					soTruong: 'Đánh cờ chuyên nghiệp',
					idCauLacBo: 'clb2',
					lyDo: 'Tôi rất yêu thích cờ vua.',
					trangThai: QuanLyCauLacBo.TrangThaiDon.DA_DUYET,
					lichSu: [
						{ hanhDong: 'Đã nộp đơn', thoiGian: '2024-03-30 10:00' },
						{ hanhDong: 'Quản trị viên đã duyệt', thoiGian: '2024-03-30 14:00' },
					],
				},
			];
			saveToStorage(STORAGE_KEYS.CLB_DON_DANG_KY, initialApps);
		}
	},
};
