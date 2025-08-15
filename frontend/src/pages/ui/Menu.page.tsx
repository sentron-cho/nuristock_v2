import { useMemo } from 'react';
import { Menus } from '@layouts/data/menu.data';
import Flex from '@entites/Flex';
import { styled } from '@styles/stitches.config';
import { Text } from '@entites/Text';
import { FieldValues } from 'react-hook-form';
import clsx from 'clsx';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { keyframes } from '@stitches/react';

// const overlayFadeIn = keyframes({
// 	from: { opacity: 0 },
// 	to: { opacity: 1 },
// });

const overlayFadeOut = keyframes({
	from: { opacity: 1 },
	to: { opacity: 0 },
});

// 전체 화면 패널이 살짝 아래에서 올라오며(overshoot) 자연스럽게 멈추는 느낌
const panelSlideIn = keyframes({
	'0%': { opacity: 0, transform: 'translate3d(0, 16px, 0) scale(0.995)' },
	'60%': { opacity: 1, transform: 'translate3d(0, -2px, 0) scale(1.001)' },
	'100%': { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
});

const panelSlideOut = keyframes({
	from: { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
	to: { opacity: 0, transform: 'translate3d(0, 12px, 0) scale(0.995)' },
});

export const StyledFlex = styled(Flex, {
	'&.menu-layout': {
		position: 'fixed',
		top: 0,
		left: 0,
		zIndex: '$menuPage',
		background: '$bgcolor',
		height: '100vh',
		width: '100vw',
		overflow: 'hidden',
		willChange: 'transform, opacity',

		// 열기 상태
		'&.open': {
			animation: `${panelSlideIn} 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
		},

		// 닫기 상태
		'&.close': {
			animation: `${panelSlideOut} 220ms cubic-bezier(0.4, 0, 1, 1) forwards`,
			'&::before': {
				animation: `${overlayFadeOut} 200ms ease-in forwards`,
			},
		},

		// 콘텐츠 영역
		'.menus': {
			flexWrap: 'wrap',
			padding: '20px',
			// iOS 안전영역 대응(필요 시)
			paddingTop: 'max(20px, env(safe-area-inset-top))',
			paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
			overflowY: 'auto',
			width: '100%',
			// height: '100%',

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
					transition: 'transform 120ms ease, opacity 120ms ease',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',

					'.icon': {
						svg: {
							width: '48px',
							height: '48px',
							color: 'white',
						},
					},

					'&:active': {
						transform: 'scale(0.98)',
						opacity: 0.9,
					},
				},
			},
		},

		// 모션 감소 선호 사용자 접근성
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
			'&::before': { animation: 'none', opacity: 1 },
			'.menus .btn-layout .btn-box': { transition: 'none' },
		},
	},
});

const MenuPage = ({
	className,
	onClose,
}: {
	className?: string;
	onClose?: () => void;
}) => {
	const { navigate, location } = useCommonHook();
	const { pathname } = location;

	const menus = useMemo(() => {
		return Menus(true);
	}, [pathname]);

	const onClick = (item: FieldValues) => {
		item?.value && navigate(item?.value);
		onClose?.();
	};

	return (
		<StyledFlex className={clsx('menu-layout open', className)} justify={'start'} align={'start'}>
			<Flex className='menus' direction={'row'}>
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
			</Flex>
		</StyledFlex>
	);
};

MenuPage.displayName = 'MenuPage';
export default MenuPage;
