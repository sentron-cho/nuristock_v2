import { styled } from '@stitches/react';

const StyledComponent = styled('span', {
	'&.text': {
		width: '100%',
		padding: '0',
		margin: '0',
		display: 'inline-block',
	},

	variants: {
		overflow: {
			ellipsis: {
				overflow: 'hidden',
				display: '-webkit-box',
				WebkitBoxOrient: 'vertical',
				textOverflow: 'ellipsis',
			},
			auto: {
				overflowY: 'auto',
			},
			scroll: {
				overflowY: 'scroll',
			},
			hidden: {
				overflowY: 'hidden',
			},
		},
		size: {
			label: {},
			sm: {},
			md: {},
			lg: {},
			xl: {},
			title: {},
		},
	},
});

const Text = ({
	size = 'md',
	text = '',
	onClick,
	className = '',
	align = 'left',
	overflow = 'auto',
	lineHeight = '20px',
	height = 'auto',
	maxLine = 0,
	whiteSpace = 'pre-wrap',
}: {
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'title' | 'label';
	text?: string;
	onClick?: () => void;
	align?: 'center' | 'left' | 'right';
	className?: string;
	overflow?: 'ellipsis' | 'auto' | 'scroll' | 'hidden';
	height?: string;
	lineHeight?: string;
	maxLine?: string | number;
	whiteSpace?: string;
}) => {
	const styled = maxLine
		? {
				height: `calc(${lineHeight} * ${maxLine})`,
				WebkitLineClamp: maxLine,
		  }
		: { height: height, whiteSpace: whiteSpace };
	return (
		<StyledComponent
			className={`text ${className || ''} text-${align}`}
			size={size}
			overflow={overflow}
			onClick={onClick}
			style={styled}
		>
			{text}
		</StyledComponent>
	);
};

export default Text;
