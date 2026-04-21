import { ArrowLeftOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Tag, Typography } from 'antd';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import MarkdownRender from '@/components/Blog/MarkdownRender';
import PostCard from '@/components/Blog/PostCard';
import blogPostModel from '@/models/blogPost';
import type { Post } from '@/types/blog';

const { Title, Text } = Typography;

const AUTHOR_INFO: Record<string, {
	avatar: string;
	name: string;
	bio: string;
	skills: string[];
	socialLinks: {
		facebook?: string;
		github?: string;
		linkedin?: string;
	};
}> = {
	'John Doe': {
		avatar: 'https://picsum.photos/seed/author/150/150',
		name: 'John Doe',
		bio: 'Senior Frontend Developer với 8+ năm kinh nghiệm xây dựng các ứng dụng web quy mô lớn. Chuyên gia về React, TypeScript và các giải pháp UI/UX hiện đại.',
		skills: ['React', 'TypeScript', 'UmiJS', 'Ant Design', 'Node.js', 'GraphQL', 'Docker', 'Git'],
		socialLinks: {
			facebook: 'https://facebook.com/johndoe',
			github: 'https://github.com/johndoe',
			linkedin: 'https://linkedin.com/in/johndoe',
		},
	},
	'Jane Smith': {
		avatar: 'https://picsum.photos/seed/janesmith/150/150',
		name: 'Jane Smith',
		bio: 'Full Stack Developer với 5+ năm kinh nghiệm. Chuyên gia về TypeScript, Node.js và các giải pháp Cloud Native.',
		skills: ['TypeScript', 'Node.js', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL', 'React', 'Git'],
		socialLinks: {
			facebook: 'https://facebook.com/janesmith',
			github: 'https://github.com/janesmith',
			linkedin: 'https://linkedin.com/in/janesmith',
		},
	},
};

const PostDetail: React.FC = () => {
	const { getPostBySlug, getRelatedPosts, incrementViewCount } = blogPostModel();
	const [post, setPost] = useState<Post | null>(null);
	const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

	const slug = history.location.pathname.split('/').pop();

	useEffect(() => {
		if (slug) {
			const found = getPostBySlug(slug);
			if (found) {
				setPost(found);
				incrementViewCount(found._id);
				const related = getRelatedPosts(found, 3);
				setRelatedPosts(related);
			}
		}
	}, [slug]);

	if (!post) {
		return (
			<Card style={{ textAlign: 'center', marginTop: 24 }}>
				<Text>Bai viet khong ton tai.</Text>
				<div style={{ marginTop: 16 }}>
					<Button onClick={() => history.push('/blog')}>
						<ArrowLeftOutlined /> Quay lai
					</Button>
				</div>
			</Card>
		);
	}

	const authorInfo = AUTHOR_INFO[post.author] || AUTHOR_INFO['John Doe'];

	return (
		<div style={{ padding: '24px 0' }}>
			<Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/blog')} style={{ marginBottom: 16 }}>
				Quay lai
			</Button>

			<Card style={{ marginBottom: 24 }}>
				<img
					src={post.thumbnail}
					alt={post.title}
					style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
				/>

				<Title level={2} style={{ marginTop: 24 }}>
					{post.title}
				</Title>

				<div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
					<a href={`/blog/about?author=${encodeURIComponent(post.author)}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						<UserOutlined />
						<Text strong>{post.author}</Text>
					</a>
					<Text type='secondary'> - </Text>
					<Text type='secondary'>{moment(post.createdAt).format('DD/MM/YYYY')}</Text>
					<Text type='secondary'> - </Text>
					<Text>
						<EyeOutlined /> {post.viewCount} luot xem
					</Text>
				</div>

				<div style={{ marginTop: 12 }}>
					{post.tags.map((tag: string) => (
						<Tag key={tag} color='blue'>
							{tag}
						</Tag>
					))}
				</div>

				<div style={{ marginTop: 24 }}>
					<MarkdownRender content={post.content} />
				</div>
			</Card>

			{relatedPosts.length > 0 && (
				<Card title='Bai viet lien quan'>
					<Row gutter={[16, 16]}>
						{relatedPosts.map((related) => (
							<Col key={related._id} xs={24} sm={12} md={8}>
								<PostCard post={related} />
							</Col>
						))}
					</Row>
				</Card>
			)}
		</div>
	);
};

export default PostDetail;
