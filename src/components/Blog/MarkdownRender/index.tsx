import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRenderProps {
	content: string;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ content }) => {
	return (
		<div className='markdown-content'>
			<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
		</div>
	);
};

export default MarkdownRender;
