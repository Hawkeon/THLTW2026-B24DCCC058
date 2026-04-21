import { useState } from 'react';

import type { Post } from '../types/blog';

const STORAGE_KEY = 'blog_posts';

const generateId = () => Math.random().toString(36).substring(2, 15);

const getInitialData = (): Post[] => {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		const parsed = JSON.parse(stored);
		if (parsed.length > 0 && parsed[0].thumbnail?.includes('placeholder')) {
			localStorage.removeItem(STORAGE_KEY);
		} else {
			return parsed;
		}
	}

	const mockData: Post[] = [
		{
			_id: '1',
			postId: 'P001',
			title: 'Getting Started with React',
			slug: 'getting-started-react',
			summary: 'Learn the basics of React and build your first component.',
			content: '# Getting Started with React\n\nReact is a JavaScript library for building user interfaces.\n\n## Your First Component\n\n```jsx\nfunction App() {\n  return <h1>Hello World!</h1>;\n}\n```\n\n## Key Concepts\n\n- Components\n- JSX\n- Props and State',
			thumbnail: 'https://picsum.photos/seed/react/400/200',
			author: 'John Doe',
			tags: ['React', 'JavaScript'],
			createdAt: '2024-01-15T10:00:00Z',
			status: 'published',
			viewCount: 120,
		},
		{
			_id: '2',
			postId: 'P002',
			title: 'Understanding TypeScript',
			slug: 'understanding-typescript',
			summary: 'A deep dive into TypeScript type system.',
			content: '# Understanding TypeScript\n\nTypeScript adds static types to JavaScript.\n\n## Basic Types\n\n```typescript\nlet name: string = "John";\nlet age: number = 30;\n```\n\n## Interfaces\n\n```typescript\ninterface User {\n  name: string;\n  age: number;\n}\n```',
			thumbnail: 'https://picsum.photos/seed/typescript/400/200',
			author: 'Jane Smith',
			tags: ['TypeScript', 'JavaScript'],
			createdAt: '2024-01-20T14:30:00Z',
			status: 'published',
			viewCount: 85,
		},
		{
			_id: '3',
			postId: 'P003',
			title: 'UmiJS Best Practices',
			slug: 'umijs-best-practices',
			summary: 'Best practices for building enterprise apps with UmiJS.',
			content: '# UmiJS Best Practices\n\nUmiJS is a router-based framework.\n\n## Directory Structure\n\n- `src/pages/` - Page components\n- `src/models/` - Data models\n- `src/services/` - API services\n\n## Plugins\n\nUmiJS has a rich plugin system.',
			thumbnail: 'https://picsum.photos/seed/umijs/400/200',
			author: 'John Doe',
			tags: ['UmiJS', 'React'],
			createdAt: '2024-02-01T09:00:00Z',
			status: 'published',
			viewCount: 200,
		},
		{
			_id: '4',
			postId: 'P004',
			title: 'Ant Design Pro Components',
			slug: 'ant-design-pro-components',
			summary: 'Learn to use Pro Components effectively.',
			content: '# Ant Design Pro Components\n\nProComponents uses AI to generate templates.\n\n## Table Component\n\nThe Table component supports filtering, sorting, and pagination.\n\n## Form Component\n\nPowerful form handling with validation.',
			thumbnail: 'https://picsum.photos/seed/antdesign/400/200',
			author: 'Jane Smith',
			tags: ['Ant Design', 'React'],
			createdAt: '2024-02-10T11:00:00Z',
			status: 'published',
			viewCount: 150,
		},
		{
			_id: '5',
			postId: 'P005',
			title: 'State Management in React',
			slug: 'state-management-react',
			summary: 'Compare different state management solutions.',
			content: '# State Management in React\n\n## useState\n\nBasic state hook for local state.\n## useReducer\n\nFor complex state logic.\n## Context\n\nBuilt-in state sharing mechanism.\n## External Solutions\n\n- Redux\n- MobX\n- Zustand',
			thumbnail: 'https://picsum.photos/seed/state/400/200',
			author: 'John Doe',
			tags: ['React', 'JavaScript'],
			createdAt: '2024-02-15T08:00:00Z',
			status: 'published',
			viewCount: 95,
		},
		{
			_id: '6',
			postId: 'P006',
			title: 'Building REST APIs',
			slug: 'building-rest-apis',
			summary: 'Design and implement RESTful APIs.',
			content: '# Building REST APIs\n\n## REST Principles\n\n- Client-Server\n- Stateless\n- Cacheable\n\n## HTTP Methods\n\n- GET - Read\n- POST - Create\n- PUT - Update\n- DELETE - Delete',
			thumbnail: 'https://picsum.photos/seed/restapi/400/200',
			author: 'Jane Smith',
			tags: ['Backend', 'API'],
			createdAt: '2024-02-20T10:00:00Z',
			status: 'published',
			viewCount: 110,
		},
		{
			_id: '7',
			postId: 'P007',
			title: 'CSS Grid Layout',
			slug: 'css-grid-layout',
			summary: 'Master CSS Grid for modern layouts.',
			content: '# CSS Grid Layout\n\n## Grid Container\n\n```css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}\n```\n\n## Grid Items\n\nPlace items using `grid-column` and `grid-row`.',
			thumbnail: 'https://picsum.photos/seed/css/400/200',
			author: 'John Doe',
			tags: ['CSS', 'Frontend'],
			createdAt: '2024-03-01T12:00:00Z',
			status: 'published',
			viewCount: 75,
		},
		{
			_id: '8',
			postId: 'P008',
			title: 'Docker for Developers',
			slug: 'docker-for-developers',
			summary: 'Get started with Docker containerization.',
			content: '# Docker for Developers\n\n## Images and Containers\n\nAn image is a template, a container is a running instance.\n\n\n## Dockerfile\n\n```dockerfile\nFROM node:18\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]\n```',
			thumbnail: 'https://picsum.photos/seed/docker/400/200',
			author: 'Jane Smith',
			tags: ['Docker', 'DevOps'],
			createdAt: '2024-03-05T14:00:00Z',
			status: 'published',
			viewCount: 130,
		},
		{
			_id: '9',
			postId: 'P009',
			title: 'Git Advanced Commands',
			slug: 'git-advanced-commands',
			summary: 'Level up your Git skills with advanced commands.',
			content: '# Git Advanced Commands\n\n## Rebase\n\n```bash\ngit rebase main\n```\n\n## Stash\n\n```bash\ngit stash\ngit stash pop\n```\n\n## Bisect\n\nFor finding bugs in history.',
			thumbnail: 'https://picsum.photos/seed/git/400/200',
			author: 'John Doe',
			tags: ['Git', 'DevOps'],
			createdAt: '2024-03-10T09:00:00Z',
			status: 'published',
			viewCount: 88,
		},
		{
			_id: '10',
			postId: 'P010',
			title: 'Testing React Apps',
			slug: 'testing-react-apps',
			summary: 'Complete guide to testing React applications.',
			content: '# Testing React Apps\n\n## Testing Libraries\n\n- Jest - Test runner\n- React Testing Library - Component testing\n- Cypress - E2E testing\n\n## Best Practices\n\nWrite tests from the user perspective.',
			thumbnail: 'https://picsum.photos/seed/testing/400/200',
			author: 'Jane Smith',
			tags: ['Testing', 'React'],
			createdAt: '2024-03-15T11:00:00Z',
			status: 'published',
			viewCount: 105,
		},
		{
			_id: '11',
			postId: 'P011',
			title: 'Draft Post Example',
			slug: 'draft-post-example',
			summary: 'This is a draft post for testing purposes.',
			content: '# Draft Post\n\nThis post is still being worked on.',
			thumbnail: 'https://picsum.photos/seed/draft/400/200',
			author: 'John Doe',
			tags: ['Draft'],
			createdAt: '2024-03-20T16:00:00Z',
			status: 'draft',
			viewCount: 5,
		},
		{
			postId: 'P012',
			_id: '12',
			title: 'Performance Optimization',
			slug: 'performance-optimization',
			summary: 'Tips for optimizing React app performance.',
			content: "# Performance Optimization\n\n## Memoization\n\nUse React.memo, useMemo, and useCallback wisely.\n\n\n## Code Splitting\n\n```jsx\nconst HeavyComponent = lazy(() => import('./HeavyComponent'));\n```",
			thumbnail: 'https://picsum.photos/seed/perf/400/200',
			author: 'Jane Smith',
			tags: ['React', 'Performance'],
			createdAt: '2024-03-25T10:00:00Z',
			status: 'published',
			viewCount: 140,
		},
	];

	localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
	return mockData;
};

export default () => {
	const [posts, setPosts] = useState<Post[]>(getInitialData);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);

	const saveToStorage = (updatedPosts: Post[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
		setPosts(updatedPosts);
	};

	const getPostBySlug = (slug: string): Post | undefined => {
		return posts.find((p) => p.slug === slug);
	};

	const getPostById = (id: string): Post | undefined => {
		return posts.find((p) => p._id === id);
	};

	const createPost = (data: Omit<Post, '_id' | 'postId' | 'viewCount' | 'createdAt'>) => {
		const newPost: Post = {
			...data,
			_id: generateId(),
			postId: `P${String(posts.length + 1).padStart(3, '0')}`,
			viewCount: 0,
			createdAt: new Date().toISOString(),
		};
		const updated = [newPost, ...posts];
		saveToStorage(updated);
		return newPost;
	};

	const updatePost = (id: string, data: Partial<Post>) => {
		const updated = posts.map((p) => (p._id === id ? { ...p, ...data } : p));
		saveToStorage(updated);
		return updated.find((p) => p._id === id);
	};

	const deletePost = (id: string) => {
		const updated = posts.filter((p) => p._id !== id);
		saveToStorage(updated);
	};

	const incrementViewCount = (id: string) => {
		const post = posts.find((p) => p._id === id);
		if (post) {
			const updated = posts.map((p) => (p._id === id ? { ...p, viewCount: p.viewCount + 1 } : p));
			saveToStorage(updated);
		}
	};

	const getRelatedPosts = (currentPost: Post, limit = 3): Post[] => {
		return posts
			.filter(
				(p) =>
					p._id !== currentPost._id &&
					p.status === 'published' &&
					p.tags.some((t: string) => currentPost.tags.includes(t)),
			)
			.slice(0, limit);
	};

	const getAllTags = (): string[] => {
		const tagSet = new Set<string>();
		posts.forEach((p) => p.tags.forEach((t: string) => tagSet.add(t)));
		return Array.from(tagSet).sort();
	};

	const getPostsByTag = (tag: string): Post[] => {
		return posts.filter((p) => p.tags.includes(tag) && p.status === 'published');
	};

	const isSlugUnique = (slug: string, excludeId?: string): boolean => {
		return !posts.some((p) => p.slug === slug && p._id !== excludeId);
	};

	return {
		posts,
		selectedPost,
		setSelectedPost,
		getPostBySlug,
		getPostById,
		createPost,
		updatePost,
		deletePost,
		incrementViewCount,
		getRelatedPosts,
		getAllTags,
		getPostsByTag,
		isSlugUnique,
	};
};
