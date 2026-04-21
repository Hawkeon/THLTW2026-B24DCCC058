import { Card, Tag, Typography } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import 'moment/locale/vi';

const { Meta } = Card;
const { Title, Text } = Typography;

import type { Post } from '@/types/blog';

interface PostCardProps {
	post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	const handleClick = () => {
		history.push(`/blog/post/${post.slug}`);
	};

	return (
		<Card
			hoverable
			onClick={handleClick}
			cover={<img alt={post.title} src={post.thumbnail} style={{ height: 180, objectFit: 'cover' }} />}
		>
			<Meta
				title={<Title level={4}>{post.title}</Title>}
				description={
					<>
						<Text type='secondary'>{moment(post.createdAt).format('DD/MM/YYYY')}</Text>
						<Text strong style={{ marginLeft: 8 }}>
							· {post.author}
						</Text>
					</>
				}
			/>
			<div style={{ marginTop: 8 }}>
				<Text
					ellipsis={{
						tooltip: post.summary,
					}}
				>
					{post.summary}
				</Text>
			</div>
			<div style={{ marginTop: 12 }}>
				{post.tags.map((tag: string) => (
					<Tag key={tag} color='blue'>
						{tag}
					</Tag>
				))}
			</div>
			<div style={{ marginTop: 8 }}>
				<Text type='secondary' style={{ fontSize: 12 }}>
					{post.viewCount} lượt xem
				</Text>
			</div>
		</Card>
	);
};

export default PostCard;
