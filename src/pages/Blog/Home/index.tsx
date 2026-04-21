import { Card, Col, Input, Pagination, Row, Tag } from 'antd';
import { useState, useMemo } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import PostCard from '@/components/Blog/PostCard';
import { useDebounce } from '@/hooks/useDebounce';
import blogPostModel from '@/models/blogPost';

const POSTS_PER_PAGE = 9;

const BlogHome: React.FC = () => {
	const { posts, getAllTags } = blogPostModel();
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

	const debouncedSearch = useDebounce(searchQuery, 300);

	const allTags = getAllTags();

	const filteredPosts = useMemo(() => {
		let result = posts.filter((p) => p.status === 'published');

		if (selectedTag) {
			result = result.filter((p) => p.tags.includes(selectedTag));
		}

		if (debouncedSearch) {
			const query = debouncedSearch.toLowerCase();
			result = result.filter(
				(p) =>
					p.title.toLowerCase().includes(query) ||
					p.summary.toLowerCase().includes(query) ||
					p.author.toLowerCase().includes(query),
			);
		}

		return result;
	}, [posts, selectedTag, debouncedSearch]);

	const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

	const paginatedPosts = useMemo(() => {
		const start = (page - 1) * POSTS_PER_PAGE;
		return filteredPosts.slice(start, start + POSTS_PER_PAGE);
	}, [filteredPosts, page]);

	const handleTagClick = (tag: string) => {
		setSelectedTag(selectedTag === tag ? null : tag);
		setPage(1);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		setPage(1);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div style={{ padding: '24px 0' }}>
			<Card style={{ marginBottom: 24 }}>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} md={12}>
						<Input
							placeholder='Tìm kiếm bài viết...'
							prefix={<SearchOutlined />}
							value={searchQuery}
							onChange={handleSearchChange}
							allowClear
						/>
					</Col>
					<Col xs={24} md={12}>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
							<Tag
								color={selectedTag === null ? 'blue' : 'default'}
								style={{ cursor: 'pointer', margin: 0 }}
								onClick={() => {
									setSelectedTag(null);
									setPage(1);
								}}
							>
								Tất cả
							</Tag>
							{allTags.map((tag: string) => (
								<Tag
									key={tag}
									color={selectedTag === tag ? 'blue' : 'default'}
									style={{ cursor: 'pointer', margin: 0 }}
									onClick={() => handleTagClick(tag)}
								>
									{tag}
								</Tag>
							))}
						</div>
					</Col>
				</Row>
			</Card>

			<Row gutter={[16, 16]}>
				{paginatedPosts.map((post) => (
					<Col key={post._id} xs={24} sm={12} md={8} lg={6}>
						<PostCard post={post} />
					</Col>
				))}
			</Row>

			{filteredPosts.length === 0 && (
				<Card style={{ textAlign: 'center', marginTop: 24 }}>
					<p>Không tìm thấy bài viết nào.</p>
				</Card>
			)}

			{totalPages > 1 && (
				<div style={{ textAlign: 'center', marginTop: 24 }}>
					<Pagination
						current={page}
						pageSize={POSTS_PER_PAGE}
						total={filteredPosts.length}
						onChange={handlePageChange}
						showSizeChanger={false}
					/>
				</div>
			)}
		</div>
	);
};

export default BlogHome;
