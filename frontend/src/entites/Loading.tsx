import { Box, CircularProgress } from '@mui/material';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';

const StyledBox = styled(Box, {
	'&.loading': {
		width: '100vw',
		zIndex: '$loading',
		background: '#00000020',

		'&.fixed': {
			position: 'fixed',
			top: 0,
			left: 0,
		},
	},
});

export const Loading = ({ position = 'fixed' }: { position?: string }) => {
	return (
		<StyledBox
			className={clsx('loading', position)}
			display='flex'
			justifyContent='center'
			alignItems='center'
			minHeight='100vh'
		>
			<CircularProgress />
		</StyledBox>
	);
};
