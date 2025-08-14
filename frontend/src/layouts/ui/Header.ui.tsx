import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import IconLogo from '@mui/icons-material/MonetizationOn';
import { ST } from '@shared/config/kor.lang';
import { Menus } from '@layouts/data/menu.data';
import { URL } from '@shared/config/url.enum';
import { IconForward } from '@entites/Icons';
import { styled } from '@styles/stitches.config';

export const StyledHeader = styled('div', {
	backgroundColor: '$gray900',

	'.header-bar': {
		maxWidth: '$pageWidth',
		margin: 'auto',
		userSelect: 'none',
		position: 'sticky',
		top: 0,
		left: 0,
		height: '40px',

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

	'.title-bar': {
		position: 'absolute',
		left: 20,
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

	'@md': {
		'.title-bar': {
			position: 'unset',
			justifyContent: 'center',
		}
	}
});

// === Component ===
const Header: React.FC = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

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
				<Flex fullWidth={false} className={clsx('title-bar')} flex={1} gap={4}>
					<Flex
						className='box'
						width={'fit-content'}
						onClick={() => navigate('/')}
						gap={4}
					>
						<IconLogo fontSize='medium' />
						<Typography className='title'>{ST.STOCK_DIARY}</Typography>
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
