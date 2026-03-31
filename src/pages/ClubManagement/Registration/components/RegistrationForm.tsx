import { Form, Input, Modal, Select, message } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { QuanLyCauLacBo } from '@/services/ClubManagement/clubService';

interface RegistrationFormProps {
	visible: boolean;
	onCancel: () => void;
	editingRecord?: QuanLyCauLacBo.DonDangKy;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ visible, onCancel, editingRecord }) => {
	const [form] = Form.useForm();
	const { themDonDangKy, danhSachCauLacBo } = useModel('club' as any);

	useEffect(() => {
		if (visible) {
			if (editingRecord) {
				form.setFieldsValue(editingRecord);
			} else {
				form.resetFields();
				form.setFieldsValue({ trangThai: QuanLyCauLacBo.TrangThaiDon.CHO_DUYET });
			}
		}
	}, [visible, editingRecord, form]);

	const onFinish = (values: any) => {
		const registrationData: QuanLyCauLacBo.DonDangKy = {
			...editingRecord,
			...values,
			id: editingRecord?.id || `don_${Date.now()}`,
			trangThai: editingRecord?.trangThai || QuanLyCauLacBo.TrangThaiDon.CHO_DUYET,
			lichSu: editingRecord?.lichSu || [{ hanhDong: 'Đã nộp đơn (Tạo thủ công)', thoiGian: new Date().toLocaleString() }],
		};
		themDonDangKy(registrationData);
		message.success(editingRecord ? 'Cập nhật thành công' : 'Thêm mới thành công');
		onCancel();
	};

	return (
		<Modal
			title={editingRecord ? 'Chỉnh sửa Đơn đăng ký' : 'Thêm mới Đơn đăng ký'}
			visible={visible}
			onCancel={onCancel}
			onOk={() => form.submit()}
			width={700}
			destroyOnClose
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item
					label="Họ và tên"
					name="hoTen"
					rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
				>
					<Input placeholder="Nhập họ và tên" />
				</Form.Item>
				<Form.Item
					label="Email"
					name="email"
					rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
				>
					<Input placeholder="Nhập email" />
				</Form.Item>
				<Form.Item
					label="Số điện thoại"
					name="soDienThoai"
					rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
				>
					<Input placeholder="Nhập số điện thoại" />
				</Form.Item>
				<Form.Item label="Giới tính" name="gioiTinh" initialValue="Nam">
					<Select>
						<Select.Option value="Nam">Nam</Select.Option>
						<Select.Option value="Nữ">Nữ</Select.Option>
						<Select.Option value="Khác">Khác</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item label="Địa chỉ" name="diaChi">
					<Input placeholder="Nhập địa chỉ" />
				</Form.Item>
				<Form.Item label="Sở trường" name="soTruong">
					<Input.TextArea rows={2} placeholder="Nhập sở trường" />
				</Form.Item>
				<Form.Item
					label="Câu lạc bộ"
					name="idCauLacBo"
					rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
				>
					<Select placeholder="Chọn câu lạc bộ">
						{danhSachCauLacBo.map((club: QuanLyCauLacBo.CauLacBo) => (
							<Select.Option key={club.idCauLacBo} value={club.idCauLacBo}>
								{club.tenCauLacBo}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label="Lý do đăng ký" name="lyDo">
					<Input.TextArea rows={3} placeholder="Nhập lý do đăng ký" />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default RegistrationForm;
