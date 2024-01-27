import { Navbar } from 'reactstrap';
import { Logo } from '@/assets/svg/images';
import { $url } from '@/request/paths';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
// import Notification from './Notification';
import Profile from './Profile';
import { styled } from '@stitches/react';

export const StyledHeader = styled('div', {
	'.topbar': {
		padding: '0',

		'&.navbar': {
			zIndex: '99',
		},

		'& > div': {
			minWidth: '1700px',
			maxWidth: '1700px',
			height: '60px',
			margin: '0',

			'.input-search': {
				width: '480px',
				marginLeft: '64px',
			},

			button: {
				border: 'none',
				'&:hover': {
					border: 'none',
				},
			},
		},
	},
});

const Header = () => {
	const navigate = useNavigate();

	return (
		<StyledHeader>
			<Navbar color={'white'} light={true} expand='lg' className='topbar'>
				{/* 로고 */}
				<div className='d-none d-lg-flex align-items-center logo-space'>
					<Logo
						className='cursor-pointer'
						onClick={() => navigate($url.apps.dashboard)}
					/>
				</div>

				{/* 검색 폼 및 구독하기 */}
				<div className='me-auto d-flex flex-row align-items-center w-100'>
					<SearchBar />
				</div>

				{/* 우측 아이콘 */}
				<div className='d-flex align-items-center'>
					{/* <Notification /> */}
					<Profile />
				</div>
			</Navbar>
		</StyledHeader>
	);
};

export default Header;
