import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Flex from '@entites/Flex';
import clsx from 'clsx';
import { StyledFooter } from '../style/Footer.style';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { Menus } from '@layouts/data/menu.data';

const Footer: React.FC = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { isMobile } = useCommonHook();

	const menu = useMemo(() => Menus(), []);

	const onClickNav = (url: string) => {
		navigate(url);
	};

	if (!isMobile) return null;

	return (
		<StyledFooter className='footer-bar'>
			<Flex justify={'center'} width={'100vw'}>
				<Flex className='nav' gap={10}>
					{menu?.map((item) => {
						return (
							<Flex
								className={clsx('link', { active: item.value === pathname })}
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
