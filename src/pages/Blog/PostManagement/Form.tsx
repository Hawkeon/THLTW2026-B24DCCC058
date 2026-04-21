import { Button, Form, Input, Select, Switch, message } from 'antd';
import { useEffect } from 'react';
import type { Post } from '@/types/blog';

interface PostFormValues {
	title: string;
	slug: string;
	summary: string;
	content: string;
	thumbnail: string;
	tags: string[];
	status: boolean;
}

interface PostManagementFormProps {
	record?: Post;
	onSuccess: () => void;
	isSlugUnique: (slug: string, excludeId?: string) => boolean;
	getAllTags: () => string[];
	createPost: (data: Omit<Post, '_id' | 'postId' | 'viewCount' | 'createdAt'>) => Post;
	updatePost: (id: string, data: Partial<Post>) => Post | undefined;
}

const PostManagementForm: React.FC<PostManagementFormProps> = ({
	record,
	onSuccess,
	isSlugUnique,
	getAllTags,
	createPost,
	updatePost,
}) => {
	const [form] = Form.useForm<PostFormValues>();
	const allTags = getAllTags();

	useEffect(() => {
		if (record) {
			form.setFieldsValue({
				title: record.title,
				slug: record.slug,
				summary: record.summary,
				content: record.content,
				thumbnail: record.thumbnail,
				tags: record.tags,
				status: record.status === 'published',
			});
		} else {
			form.resetFields();
		}
	}, [record, form]);

	const handleFinish = (values: PostFormValues) => {
		const postStatus: 'draft' | 'published' = values.status ? 'published' : 'draft';
		const postData = {
			title: values.title,
			slug: values.slug,
			summary: values.summary,
			content: values.content,
			thumbnail: values.thumbnail,
			tags: values.tags,
			author: 'Anonymous',
			status: postStatus,
		};

		if (!record && !isSlugUnique(values.slug)) {
			message.error('Slug đã tồn tại. Vui lòng chọn slug khác.');
			return;
		}

		if (record && !isSlugUnique(values.slug, record._id)) {
			message.error('Slug đã tồn tại. Vui lòng chọn slug khác.');
			return;
		}

		if (record) {
			updatePost(record._id, postData);
			message.success('Cập nhật bài viết thành công');
		} else {
			createPost(postData);
			message.success('Tạo bài viết thành công');
		}

		onSuccess();
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleFinish} initialValues={{ status: 'draft' }}>
			<Form.Item
				name='title'
				label='Tiêu đề'
				rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
			>
				<Input placeholder='Nhập tiêu đề bài viết' />
			</Form.Item>

			<Form.Item
				name='slug'
				label='Slug'
				rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
			>
				<Input placeholder='vi-du-bai-viet' />
			</Form.Item>

			<Form.Item
				name='summary'
				label='Tóm tắt'
				rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
			>
				<Input.TextArea rows={2} placeholder='Nhập tóm tắt bài viết' />
			</Form.Item>

			<Form.Item
				name='content'
				label='Nội dung (Markdown)'
				rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
			>
				<Input.TextArea rows={10} placeholder='# Tiêu đề&#10;&#10;Nội dung bài viết...' />
			</Form.Item>

			<Form.Item
				name='thumbnail'
				label='URL hình thumbnail'
				rules={[{ required: true, message: 'Vui lòng nhập URL hình' }]}
			>
				<Input placeholder='https://example.com/image.jpg' />
			</Form.Item>

			<Form.Item name='tags' label='Tags'>
				<Select mode='multiple' placeholder='Chọn tags'>
					{allTags.map((tag: string) => (
						<Select.Option key={tag} value={tag}>
							{tag}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item name='status' label='Trạng thái' valuePropName='checked'>
				<Switch checkedChildren='Published' unCheckedChildren='Draft' />
			</Form.Item>

			<Form.Item style={{ marginBottom: 0 }}>
				<div style={{ display: 'flex', gap: 8 }}>
					<Button type='primary' htmlType='submit'>
						{record ? 'Cập nhật' : 'Tạo mới'}
					</Button>
					<Button onClick={onSuccess}>Hủy</Button>
				</div>
			</Form.Item>
		</Form>
	);
};

export default PostManagementForm;
