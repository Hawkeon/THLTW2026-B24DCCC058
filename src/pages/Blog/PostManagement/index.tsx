import { Button, Card, Col, Input, Popconfirm, Row, Select, Space, Table, Tag, Typography } from 'antd';
import { useState, useEffect } from 'react';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table/interface';
import { useDebounce } from '@/hooks/useDebounce';
import PostManagementForm from './Form';
import blogPostModel from '@/models/blogPost';
import type { Post } from '@/types/blog';

const { Text } = Typography;

const PostManagement: React.FC = () => {
	const { posts, deletePost, isSlugUnique, getAllTags, createPost, updatePost } = blogPostModel();
	const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<string | null>(null);
	const [record, setRecord] = useState<Post | undefined>();
	const [visible, setVisible] = useState(false);

	const debouncedSearch = useDebounce(searchText, 300);

	useEffect(() => {
		let result = [...posts];

		if (debouncedSearch) {
			const query = debouncedSearch.toLowerCase();
			result = result.filter((p) => p.title.toLowerCase().includes(query));
		}

		if (statusFilter) {
			result = result.filter((p) => p.status === statusFilter);
		}

		setFilteredPosts(result);
	}, [posts, debouncedSearch, statusFilter]);

	const handleDelete = (id: string) => {
		deletePost(id);
	};

	const handleFormSuccess = () => {
		setVisible(false);
		setRecord(undefined);
	};

	const columns: ColumnsType<Post> = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			key: 'title',
			render: (title: string) => <Text strong>{title}</Text>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: 'draft' | 'published') => (
				<Tag color={status === 'published' ? 'green' : 'orange'}>
					{status === 'published' ? 'Published' : 'Draft'}
				</Tag>
			),
		},
		{
			title: 'Tags',
			dataIndex: 'tags',
			key: 'tags',
			render: (tags: string[]) => (
				<Space size={4} wrap>
					{tags.map((tag: string) => (
						<Tag key={tag} color='blue'>
							{tag}
						</Tag>
					))}
				</Space>
			),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'viewCount',
			key: 'viewCount',
			width: 100,
			align: 'center',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 120,
			render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Tác giả',
			dataIndex: 'author',
			key: 'author',
			width: 120,
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 100,
			align: 'center',
			render: (_, record) => (
				<Space size='small'>
					<Button
						type='link'
						icon={<EditOutlined />}
						disabled={record.author !== 'John Doe'}
						onClick={() => {
							setRecord(record);
							setVisible(true);
						}}
					/>
					<Popconfirm
						title='Xác nhận xóa?'
						onConfirm={() => handleDelete(record._id)}
						okText='Xóa'
						cancelText='Hủy'
						disabled={record.author !== 'John Doe'}
					>
						<Button type='link' danger icon={<DeleteOutlined />} disabled={record.author !== 'John Doe'} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card title='Quản lý bài viết'>
			<div style={{ marginBottom: 16 }}>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} md={8}>
						<Input
							placeholder='Tìm theo tiêu đề...'
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} md={6}>
						<Select
							placeholder='Lọc theo trạng thái'
							allowClear
							style={{ width: '100%' }}
							onChange={(value) => setStatusFilter(value)}
						>
							<Select.Option value='published'>Published</Select.Option>
							<Select.Option value='draft'>Draft</Select.Option>
						</Select>
					</Col>
					<Col xs={24} md={10} style={{ textAlign: 'right' }}>
						<Space>
							<Button
								type='primary'
								icon={<PlusCircleOutlined />}
								onClick={() => {
									setRecord(undefined);
									setVisible(true);
								}}
							>
								Thêm mới
							</Button>
							<Button icon={<ReloadOutlined />} onClick={() => setFilteredPosts(posts)}>
								Tải lại
							</Button>
						</Space>
					</Col>
				</Row>
			</div>

			<Table
				columns={columns}
				dataSource={filteredPosts}
				rowKey='_id'
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total) => `Tổng số: ${total}`,
				}}
			/>

			{visible && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'rgba(0,0,0,0.5)',
						zIndex: 1000,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					onClick={() => setVisible(false)}
				>
					<div
						onClick={(e) => e.stopPropagation()}
						style={{
							background: 'white',
							padding: 24,
							borderRadius: 8,
							width: '90%',
							maxWidth: 700,
							maxHeight: '90vh',
							overflow: 'auto',
						}}
					>
						<h3 style={{ marginBottom: 24 }}>{record ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h3>
						<PostManagementForm
							record={record}
							onSuccess={handleFormSuccess}
							isSlugUnique={isSlugUnique}
							getAllTags={getAllTags}
							createPost={createPost}
							updatePost={updatePost}
						/>
					</div>
				</div>
			)}
		</Card>
	);
};

export default PostManagement;
