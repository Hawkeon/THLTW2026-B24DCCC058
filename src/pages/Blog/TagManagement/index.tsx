import { Button, Card, Form, Input, message, Modal, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table/interface';
import blogTagModel from '@/models/blogTag';
import type { Tag as TagType } from '@/types/blog';

const TagManagement: React.FC = () => {
	const { tags, createTag, updateTag, deleteTag, isNameUnique } = blogTagModel();
	const [tagList, setTagList] = useState<TagType[]>([]);
	const [editRecord, setEditRecord] = useState<TagType | null>(null);
	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		setTagList(tags);
	}, [tags]);

	const handleCreate = () => {
		setEditRecord(null);
		form.resetFields();
		setVisible(true);
	};

	const handleEdit = (record: TagType) => {
		setEditRecord(record);
		form.setFieldsValue({ name: record.name });
		setVisible(true);
	};

	const handleSave = () => {
		form.validateFields().then((values) => {
			if (editRecord) {
				if (!isNameUnique(values.name, editRecord._id)) {
					message.error('Tên tag đã tồn tại!');
					return;
				}
				updateTag(editRecord._id, values.name);
				message.success('Cập nhật tag thành công');
			} else {
				if (!isNameUnique(values.name)) {
					message.error('Tên tag đã tồn tại!');
					return;
				}
				createTag(values.name);
				message.success('Tạo tag thành công');
			}
			setVisible(false);
		});
	};

	const handleDelete = (id: string) => {
		deleteTag(id);
		message.success('Xóa tag thành công');
	};

	const columns: ColumnsType<TagType> = [
		{
			title: 'Tên tag',
			dataIndex: 'name',
			key: 'name',
			render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 150,
			render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 100,
			align: 'center',
			render: (_, record) => (
				<>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm
						title='Xác nhận xóa tag này?'
						onConfirm={() => handleDelete(record._id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<Card title='Quản lý Tags'>
			<div style={{ marginBottom: 16, textAlign: 'right' }}>
				<Button type='primary' icon={<PlusCircleOutlined />} onClick={handleCreate}>
					Thêm mới Tag
				</Button>
			</div>

			<Table columns={columns} dataSource={tagList} rowKey='_id' pagination={false} />

			<Modal
				title={editRecord ? 'Chỉnh sửa Tag' : 'Thêm Tag mới'}
				visible={visible}
				onOk={handleSave}
				onCancel={() => setVisible(false)}
				okText={editRecord ? 'Cập nhật' : 'Tạo mới'}
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='name'
						label='Tên tag'
						rules={[{ required: true, message: 'Vui lòng nhập tên tag' }]}
					>
						<Input placeholder='Nhập tên tag' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default TagManagement;
