import { Form, Input, Modal, DatePicker, Switch, message } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import moment from 'moment';
import TinyEditor from '@/components/TinyEditor';
import { QuanLyCauLacBo } from '@/services/ClubManagement/clubService';

interface ClubFormProps {
	visible: boolean;
	onCancel: () => void;
	editingRecord?: QuanLyCauLacBo.CauLacBo;
}

const ClubForm: React.FC<ClubFormProps> = ({ visible, onCancel, editingRecord }) => {
	const [form] = Form.useForm();
	const { themCauLacBo } = useModel('club' as any);

	useEffect(() => {
		if (visible) {
			if (editingRecord) {
				form.setFieldsValue({
					...editingRecord,
					ngayThanhLap: editingRecord.ngayThanhLap ? moment(editingRecord.ngayThanhLap) : undefined,
				});
			} else {
				form.resetFields();
				form.setFieldsValue({ dangHoatDong: true });
			}
		}
	}, [visible, editingRecord, form]);

	const onFinish = (values: any) => {
		const clubData: QuanLyCauLacBo.CauLacBo = {
			...values,
			idCauLacBo: editingRecord?.idCauLacBo || `clb_${Date.now()}`,
			ngayThanhLap: values.ngayThanhLap ? values.ngayThanhLap.format('YYYY-MM-DD') : '',
		};
		themCauLacBo(clubData);
		message.success(editingRecord ? 'Cập nhật thành công' : 'Thêm mới thành công');
		onCancel();
	};

	return (
		<Modal
			title={editingRecord ? 'Chỉnh sửa Câu lạc bộ' : 'Thêm mới Câu lạc bộ'}
			visible={visible}
			onCancel={onCancel}
			onOk={() => form.submit()}
			width={800}
			destroyOnClose
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item
					label="Tên câu lạc bộ"
					name="tenCauLacBo"
					rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
				>
					<Input placeholder="Nhập tên câu lạc bộ" />
				</Form.Item>
				<Form.Item label="Link ảnh đại diện" name="hinhAnh">
					<Input placeholder="Nhập đường dẫn ảnh đại diện" />
				</Form.Item>
				<Form.Item
					label="Ngày thành lập"
					name="ngayThanhLap"
					rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
				>
					<DatePicker style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					label="Chủ nhiệm"
					name="chuNhiem"
					rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
				>
					<Input placeholder="Nhập tên chủ nhiệm" />
				</Form.Item>
				<Form.Item label="Đang hoạt động" name="dangHoatDong" valuePropName="checked">
					<Switch />
				</Form.Item>
				<Form.Item label="Mô tả" name="moTa">
					<TinyEditor height={300} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ClubForm;
