import blogPostModel from './blogPost';
import blogTagModel from './blogTag';

export default () => {
	const postState = blogPostModel();
	const tagState = blogTagModel();

	return {
		...postState,
		...tagState,
	};
};
