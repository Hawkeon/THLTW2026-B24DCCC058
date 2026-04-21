export interface Post {
	_id: string;
	postId: string;
	title: string;
	slug: string;
	summary: string;
	content: string;
	thumbnail: string;
	author: string;
	tags: string[];
	createdAt: string;
	status: 'draft' | 'published';
	viewCount: number;
}

export interface Tag {
	_id: string;
	name: string;
	createdAt: string;
}

export interface Author {
	avatar: string;
	name: string;
	bio: string;
	skills: string[];
	socialLinks: {
		facebook?: string;
		github?: string;
		linkedin?: string;
	};
}
