import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.ui';
import { styled } from '@styles/stitches.config';
import { ErrorBoundary } from './ErrorBoundary';

const StyledLayout = styled('div', {
	height: '100vh',
});

const PageLayout = ({ children }: { children?: ReactNode }) => {
	return (
		<ErrorBoundary>
			<StyledLayout className='page'>
				<Header />
				{children || <Outlet />}
			</StyledLayout>
		</ErrorBoundary>
	);
};

export default PageLayout;
