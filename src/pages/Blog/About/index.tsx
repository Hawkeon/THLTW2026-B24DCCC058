import { Avatar, Card, Tag, Typography } from 'antd';
import { GithubOutlined, LinkedinOutlined, FacebookOutlined } from '@ant-design/icons';
import { useLocation } from 'umi';

const { Title, Paragraph } = Typography;

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

const About: React.FC = () => {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const authorParam = searchParams.get('author');
	const authorKey = authorParam ? decodeURIComponent(authorParam) : 'John Doe';
	const author = AUTHOR_INFO[authorKey] || AUTHOR_INFO['John Doe'];

	return (
		<div style={{ padding: '24px 0', maxWidth: 800, margin: '0 auto' }}>
			<Card title='Về tác giả' style={{ textAlign: 'center' }}>
				<Avatar src={author.avatar} size={150} style={{ marginBottom: 24 }} />

				<Title level={2}>{author.name}</Title>

				<Paragraph style={{ fontSize: 16, marginBottom: 24 }}>{author.bio}</Paragraph>

				<div style={{ marginBottom: 24 }}>
					<Title level={5}>Kỹ năng</Title>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
						{author.skills.map((skill) => (
							<Tag key={skill} color='blue'>
								{skill}
							</Tag>
						))}
					</div>
				</div>

				<div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
					{author.socialLinks.facebook && (
						<a href={author.socialLinks.facebook} target='_blank' rel='noopener noreferrer'>
							<FacebookOutlined style={{ fontSize: 24 }} />
						</a>
					)}
					{author.socialLinks.github && (
						<a href={author.socialLinks.github} target='_blank' rel='noopener noreferrer'>
							<GithubOutlined style={{ fontSize: 24 }} />
						</a>
					)}
					{author.socialLinks.linkedin && (
						<a href={author.socialLinks.linkedin} target='_blank' rel='noopener noreferrer'>
							<LinkedinOutlined style={{ fontSize: 24 }} />
						</a>
					)}
				</div>
			</Card>
		</div>
	);
};

export default About;
