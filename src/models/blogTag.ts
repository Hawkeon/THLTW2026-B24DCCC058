import { useState } from 'react';

import type { Tag as TagType } from '../types/blog';

const STORAGE_KEY = 'blog_tags';

const generateId = () => Math.random().toString(36).substring(2, 15);

const getInitialData = (): TagType[] => {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) return JSON.parse(stored);

	const mockData: TagType[] = [
		{ _id: '1', name: 'React', createdAt: '2024-01-01T00:00:00Z' },
		{ _id: '2', name: 'TypeScript', createdAt: '2024-01-01T00:00:00Z' },
		{ _id: '3', name: 'JavaScript', createdAt: '2024-01-01T00:00:00Z' },
		{ _id: '4', name: 'UmiJS', createdAt: '2024-01-15T00:00:00Z' },
		{ _id: '5', name: 'Ant Design', createdAt: '2024-01-15T00:00:00Z' },
		{ _id: '6', name: 'Backend', createdAt: '2024-02-01T00:00:00Z' },
		{ _id: '7', name: 'API', createdAt: '2024-02-01T00:00:00Z' },
		{ _id: '8', name: 'CSS', createdAt: '2024-02-15T00:00:00Z' },
		{ _id: '9', name: 'Frontend', createdAt: '2024-02-15T00:00:00Z' },
		{ _id: '10', name: 'Docker', createdAt: '2024-03-01T00:00:00Z' },
		{ _id: '11', name: 'DevOps', createdAt: '2024-03-01T00:00:00Z' },
		{ _id: '12', name: 'Git', createdAt: '2024-03-05T00:00:00Z' },
		{ _id: '13', name: 'Testing', createdAt: '2024-03-10T00:00:00Z' },
		{ _id: '14', name: 'Performance', createdAt: '2024-03-15T00:00:00Z' },
		{ _id: '15', name: 'Draft', createdAt: '2024-03-20T00:00:00Z' },
	];

	localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
	return mockData;
};

export default () => {
	const [tags, setTags] = useState<TagType[]>(getInitialData);

	const saveToStorage = (updatedTags: TagType[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTags));
		setTags(updatedTags);
	};

	const createTag = (name: string) => {
		const newTag: TagType = {
			_id: generateId(),
			name,
			createdAt: new Date().toISOString(),
		};
		const updated = [...tags, newTag];
		saveToStorage(updated);
		return newTag;
	};

	const updateTag = (id: string, name: string) => {
		const updated = tags.map((t) => (t._id === id ? { ...t, name } : t));
		saveToStorage(updated);
		return updated.find((t) => t._id === id);
	};

	const deleteTag = (id: string) => {
		const updated = tags.filter((t) => t._id !== id);
		saveToStorage(updated);
	};

	const getTagByName = (name: string): TagType | undefined => {
		return tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
	};

	const isNameUnique = (name: string, excludeId?: string): boolean => {
		return !tags.some((t) => t.name.toLowerCase() === name.toLowerCase() && t._id !== excludeId);
	};

	return {
		tags,
		createTag,
		updateTag,
		deleteTag,
		getTagByName,
		isNameUnique,
	};
};
