import { Suspense, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.ui';
import { styled } from '@styles/stitches.config';
import { ErrorBoundary } from './ErrorBoundary';
import { Loading } from '@entites/Loading';
import Footer from './Footer.ui';

const StyledLayout = styled('div', {
	height: '100vh',
});

const PageLayout = ({ children }: { children?: ReactNode }) => {
	return (
		<ErrorBoundary>
			<StyledLayout className='page'>
				<Header />
				<Footer />
				<Suspense fallback={<Loading />}>{children || <Outlet />}</Suspense>
			</StyledLayout>
		</ErrorBoundary>
	);
};

export default PageLayout;
