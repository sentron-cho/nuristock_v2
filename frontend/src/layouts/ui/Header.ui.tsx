import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import IconMenu from '@mui/icons-material/Menu';
import IconMenuOpen from '@mui/icons-material/MenuOpen';
import IconLogo from '@mui/icons-material/MonetizationOn';
import { StyledHeader } from '../style/Header.style';
import { ST } from '@shared/config/kor.lang';
import { URL } from '@shared/config/url.enum';

// === Component ===
const Header: React.FC = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [isOpen, setOpen] = useState(false);

	// ✅ 윈도우 리사이즈 시 메뉴 닫기
	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			width > 640 && isOpen && setOpen(false);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isOpen]);

	const menu = useMemo(() => {
		return [
			{ value: URL.ROOT, label: ST.MENU.DASHBOARD },
			{ value: URL.MARKET, label: ST.MENU.MARKET },
			{ value: URL.PROFIT, label: ST.MENU.PROFIT },
			{ value: URL.INVEST, label: ST.MENU.INVEST },
		];
	}, []);

	return (
		<StyledHeader>
			<Flex className='header-bar' justify={'center'} width={'100vw'}>
				<nav className='nav'>
					{menu?.map((a) => (
						<Link
							key={a.value}
							to={a.value}
							className={clsx('link', { active: a.value === pathname })}
						>
							{a.label}
						</Link>
					))}
				</nav>
				<Flex className='mobile' justify={'between'}>
					<Flex className='title-bar' justify={'center'} flex={1} gap={4}>
						<Flex
							className='box'
							width={'fit-content'}
							onClick={() => navigate('/')}
						>
							<IconLogo fontSize='medium' />
							<Typography className='title'>{'주식 다이어리'}</Typography>
						</Flex>
					</Flex>
					<button
						className='menu-button'
						onClick={() => setOpen((prev) => !prev)}
					>
						{isOpen ? (
							<IconMenuOpen fontSize={'large'} />
						) : (
							<IconMenu fontSize={'large'} />
						)}
					</button>
				</Flex>
			</Flex>

			{isOpen && (
				<Flex className='mobile-menu' direction={'column'}>
					<Flex gap={4} className='menu-li' direction={'column'} align={'start'}>
						{menu?.map((a) => (
              <Link
                key={a.value}
								to={a.value}
								className={clsx('link', { active: a.value === pathname })}
								onClick={() => setOpen(false)}
							>
								{a.label}
							</Link>
						))}
					</Flex>
					<div className='menu-bg' onClick={() => setOpen(false)}/>
				</Flex>
			)}
		</StyledHeader>
	);
};

export default Header;
