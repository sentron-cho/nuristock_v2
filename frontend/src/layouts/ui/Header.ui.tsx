import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import IconLogo from '@mui/icons-material/MonetizationOn';
import { ST } from '@shared/config/kor.lang';
import { SCREEN } from '@shared/config/default.config';
import { Menus } from '@layouts/data/menu.data';
import { URL } from '@shared/config/url.enum';
import { IconForward } from '@entites/Icons';
import { styled } from '@styles/stitches.config';

export const StyledHeader = styled('div', {
	'.header-bar': {
		userSelect: 'none',
		position: 'sticky',
		top: 0,
		left: 0,
		height: '40px',
		backgroundColor: '$gray900',
		color: '$white',
		zIndex: 1200,

		'.nav': {
			display: 'flex',
			gap: '$20',

			'@sm': {
				display: 'none',
			},
		},
	},

	'.link': {
		fontSize: '1rem',
		color: 'white',
		textDecoration: 'none',
		transition: 'color 0.2s',

		'&:hover, &.active': {
			color: '$warning',
		},
	},

	'.btn-back': {
		position: 'absolute',
		left: 0,
		paddingLeft: 20,
		width: 60,
		height: '100%',

		svg: {
			transform: 'rotate(180deg)',
		},
	},
});

// === Component ===
const Header: React.FC = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [isOpen, setOpen] = useState(false);

	const isBackButton = useMemo(() => {
		if (pathname.startsWith(URL.MYSTOCK)) {
			return true;
		} else if (pathname.startsWith(`${URL.PROFIT}/`)) {
			return true;
		} else if (pathname.startsWith(`${URL.INVEST}/`)) {
			return true;
		} else {
			return false;
		}
	}, [pathname]);

	const onClickBack = () => {
		if (pathname.startsWith(URL.MYSTOCK)) {
			navigate(URL.DASHBOARD);
		} else if (pathname.startsWith(`${URL.PROFIT}/`)) {
			navigate(URL.PROFIT);
		} else if (pathname.startsWith(`${URL.INVEST}/`)) {
			navigate(URL.INVEST);
		}
	};

	// ✅ 윈도우 리사이즈 시 메뉴 닫기
	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			width > SCREEN.MOBILE && isOpen && setOpen(false);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isOpen]);

	const menu = useMemo(() => Menus(true, false), []);

	return (
		<StyledHeader>
			<Flex className='header-bar' justify={'center'} width={'100vw'}>
				{/* 데스크톱 메뉴 */}
				<nav className='nav'>
					{menu?.map((a) => (
						<Link key={a.value} to={a.value} className={clsx('link', { active: a.value === pathname })}>
							{a.label}
						</Link>
					))}
				</nav>

				{/* 타이틀 */}
				<Flex className='mobile' justify={'between'}>
					<Flex className='title-bar' justify={'center'} flex={1} gap={4}>
						<Flex
							className='box'
							width={'fit-content'}
							onClick={() => {
								setOpen(false);
								navigate('/');
							}}
						>
							<IconLogo fontSize='medium' />
							<Typography className='title'>{ST.STOCK_DIARY}</Typography>
						</Flex>
					</Flex>
				</Flex>

				{/* 백버튼 */}
				{isBackButton && (
					<Flex className='btn-back' onClick={onClickBack}>
						<IconForward />
					</Flex>
				)}
			</Flex>
		</StyledHeader>
	);
};

export default Header;
