import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import { StyledFooter } from '../style/Footer.style';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { Menus } from '@layouts/data/menu.data';
import { URL } from '@shared/config/url.enum';
import MenuPage from '@page/ui/Menu.page';
import { IconHome, IconMoreHori } from '@entites/Icons';
import { ST } from '@shared/config/kor.lang';

const Footer: React.FC = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { isMobile } = useCommonHook();
	const [showMenu, setShowMenu] = useState<boolean>();

	const menu = useMemo(() => Menus(), [pathname]);

	const onClickNav = (url: string) => {
		if (url === URL.MEMUS) {
			setShowMenu((prev) => !prev);
			return;
		} else {
			setShowMenu(false);
			navigate(url);
		}
	};

	if (!isMobile) return null;

	return (
		<>
			<StyledFooter className='footer-bar'>
				<Flex justify={'center'} width={'100vw'}>
					<Flex className='nav' gap={10}>
						{/* home */}
						<Flex
							fullWidth={false}
							className={clsx('link home', { active: pathname.startsWith(URL.MAIN) })}
							onClick={() => onClickNav(URL.MAIN)}
							direction={'column'}
							gap={4}
						>
							<IconHome fontSize='small' />
							<p className='text'>{ST.MENU.DASHBOARD}</p>
						</Flex>

						<Flex className='scroll' gap={10} >
							{menu?.map((item) => {
								let active = pathname.startsWith(item.value);

								if (pathname.startsWith(URL.MYSTOCK)) {
									if (item.value === URL.DASHBOARD) active = true;
								}

								// if (pathname === '/' && item?.value === URL.DASHBOARD) active = true;
								if (pathname === '/' && item?.value === URL.MAIN) active = true;

								return (
									<Flex
										key={item.value}
										fullWidth={false}
										className={clsx('link', { active })}
										onClick={() => onClickNav(item.value)}
										direction={'column'}
										gap={4}
									>
										{item?.icon}
										<p className='text'>{item.label}</p>
									</Flex>
								);
							})}
						</Flex>

						{/* menu */}
						<Flex
							fullWidth={false}
							className={clsx('link more', { active: pathname.startsWith(URL.MEMUS) })}
							onClick={() => onClickNav(URL.MEMUS)}
							direction={'column'}
							gap={4}
						>
							<IconMoreHori fontSize='small' />
							<p className='text'>{ST.MENU.MORE}</p>
						</Flex>
					</Flex>
				</Flex>
			</StyledFooter>

			{showMenu && <MenuPage onClose={() => setShowMenu(false)} />}
		</>
	);
};

export default Footer;
