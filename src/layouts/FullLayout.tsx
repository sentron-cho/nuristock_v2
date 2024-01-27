import { Outlet, useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from './header/Header';
import Sidebar from './Sidebar';
import { styled } from '@stitches/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import Loading from '@/components/Loading';

const StyledMain = styled('main', {
	'&.apps-users, &.apps-request, &.apps-contact, &.apps-library': {
		overflow: 'hidden',
		height: '100vh',

		'.contentArea': {
			height: '100vh',

			'.boxContainer': {
				minHeight: 'calc(760px - 60px)',
				height: 'calc(100vh - 60px)',
				margin: 0,
			},
		},
	},
	'.loading': {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: '9999',
	},
});

const FullLayout = () => {
	const location = useLocation();
	const path = location.pathname.replace(/\//gi, '-').substring(1);
	const loading = useSelector<RootState>(
		(state) => state.main.loading
	) as string;

	return (
		<StyledMain className={`${path}`}>
			<div className={`pageWrapper d-md-block d-lg-flex`}>
				{/* 사이드바 영역 */}
				<aside className={`sidebarArea showSidebar side-bar`}>
					<Sidebar />
				</aside>

				{/* 콘텐츠 영역 */}
				<div className={`contentArea fixedTopbar`}>
					{/* 헤더 */}
					<Header />

					{/* 콘텐츠 */}
					<Container fluid className={`boxContainer`}>
						<Outlet />
						{/* <Customizer className={customizerToggle ? "showCustomizer" : ""} /> */}
					</Container>
				</div>
			</div>
			{loading && <Loading />}
		</StyledMain>
	);
};

export default FullLayout;

// export const BlankLayout = () => {
//   return <Outlet />;
// };
