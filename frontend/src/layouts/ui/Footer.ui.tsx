import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import { StyledFooter } from '../style/Footer.style';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { Menus } from '@layouts/data/menu.data';
import { URL } from '@shared/config/url.enum';

const Footer: React.FC = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { isMobile } = useCommonHook();

	const menu = useMemo(() => Menus(false, true), [pathname]);

	const onClickNav = (url: string) => {
		// 더보기 메뉴 화면에서 다시 더보기 메뉴 클릭시 이전 화면으로...
		if (url === '/menus' && pathname === url) {
			navigate(-1);
		} else {
			navigate(url);
		}
	};

	if (!isMobile) return null;

	return (
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
	);
};

export default Footer;
