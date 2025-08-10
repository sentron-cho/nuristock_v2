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

	const menu = useMemo(() => Menus(), [pathname]);

	const onClickNav = (url: string) => {
		navigate(url);
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
