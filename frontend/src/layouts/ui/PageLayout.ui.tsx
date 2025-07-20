import { Suspense, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.ui';
import { styled } from '@styles/stitches.config';
import { ErrorBoundary } from './ErrorBoundary';
import { Box, CircularProgress } from '@mui/material';

const StyledLayout = styled('div', {
	height: '100vh',
});

const PageLayout = ({ children }: { children?: ReactNode }) => {
	return (
		<ErrorBoundary>
			<StyledLayout className='page'>
				<Header />
				<Suspense fallback={<Loading />}>{children || <Outlet />}</Suspense>
			</StyledLayout>
		</ErrorBoundary>
	);
};

const Loading = () => {
	return (
		<Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
			<CircularProgress />
		</Box>
	);
};

export default PageLayout;
