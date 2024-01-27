import { str } from '@/langs/common.langs';
import { styled } from '@stitches/react';

const StyledComponent = styled('div', {
	'&.no-item': {
		width: '100%',
		minHeight: '40px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: '18px',
	},

	variants: {
		size: {
			auto: {
				height: '100%',
			},
			sm: {
				height: '100px',
				fontSize: '14px',
			},
			md: {
				height: '200px',
				fontSize: '16px',
			},
			lg: {
				height: '400px',
				fontSize: '18px',
			},
		},
	},
});

const NoData = ({
	title = str.nodata,
	size = 'auto',
}: {
	title?: string;
	size?: 'auto' | 'sm' | 'md' | 'lg';
}) => {
	return (
		<StyledComponent className='no-item' size={size}>
			<span className='text-secondary text-opacity-50'>{title}</span>
		</StyledComponent>
	);
};

export default NoData;
