import { useMemo } from 'react';
import { PageContainer } from '../../features/common/ui/PageContainer.ui';
import { Menus } from '@layouts/data/menu.data';
import Flex from '@entites/Flex';
import { styled } from '@styles/stitches.config';
import { Text } from '@entites/Text';
import { FieldValues } from 'react-hook-form';
import clsx from 'clsx';
import { useCommonHook } from '@shared/hooks/useCommon.hook';

const StyledFlex = styled(Flex, {
	'&.menu-layout': {
		flexWrap: 'wrap',
		padding: '20px',

		'.btn-layout': {
			width: '33.33333%',
			height: 'calc((100vw - 40px) * 0.33333333)',
			padding: '10px',
			margin: '10px 0',

			'.btn-box': {
				width: '100%',
				height: '100%',
				background: '$gray900',
				borderRadius: '10px',
				cursor: 'pointer',
				color: 'white',

				'.icon': {
					svg: {
						width: '48px',
						height: '48px',
						color: 'white',
					},
				},
			},
		},
	},
});

const MenuPage = () => {
	const { navigate, location } = useCommonHook();
	const { pathname } = location;

	const menus = useMemo(() => {
		return Menus(true);
	}, [pathname]);

	const onClick = (item: FieldValues) => {
		item?.value && navigate(item?.value);
	};

	return (
		<PageContainer>
			<StyledFlex className='menu-layout' direction={'row'}>
				{menus?.map((item) => {
					return (
						<Flex className='btn-layout' onClick={() => onClick(item)}>
							<Flex className={clsx('btn-box')} gap={10} direction={'column'} justify={'center'} align={'center'}>
								<Flex className='icon' justify={'center'}>
									{item?.icon}
								</Flex>
								<Text className='text' text={item?.label}></Text>
							</Flex>
						</Flex>
					);
				})}
			</StyledFlex>
		</PageContainer>
	);
};

MenuPage.displayName = 'MenuPage';
export default MenuPage;
