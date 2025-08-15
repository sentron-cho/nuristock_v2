import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import { StyledFooter } from '../style/Footer.style';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { Menus } from '@layouts/data/menu.data';
import { URL } from '@shared/config/url.enum';
import MenuPage from '@page/ui/Menu.page';

const Footer: React.FC = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { isMobile } = useCommonHook();
	const [showMenu, setShowMenu] = useState<boolean>();

	const menu = useMemo(() => Menus(false, true), [pathname]);

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
						{menu?.map((item) => {
							let active = pathname.startsWith(item.value);

							if (pathname.startsWith(URL.MYSTOCK)) {
								if (item.value === URL.DASHBOARD) active = true;
							}

							if (pathname === '/' && item?.value === URL.DASHBOARD) active = true;

							return (
								<Flex
									key={item.value}
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
				</Flex>
			</StyledFooter>

			{showMenu && <MenuPage onClose={() => setShowMenu(false)} />}
		</>
	);
};

export default Footer;
