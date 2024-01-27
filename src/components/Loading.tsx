import { styled } from '@stitches/react';
import { Spinner } from 'reactstrap';

const StyledComponent = styled('div', {
	'&.loading': {
		position: 'absolute',
		top: '0',
		left: '0',
		zIndex: '99999',
		width: '100%',
		minHeight: '40px',
		textAlign: 'center',
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'nowrap',
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},

	variants: {
		size: {
			auto: {
				height: '100%',
			},
			sm: {
				height: '100px',
			},
			md: {
				height: '200px',
			},
			lg: {
				height: '400px',
			},
		},
	},
});

const Loading = ({ size = 'auto' }: { size?: 'auto' | 'sm' | 'md' | 'lg' }) => {
	return (
		<StyledComponent className='loading' size={size}>
			<Spinner color='primary' />
		</StyledComponent>
	);
};

export default Loading;
