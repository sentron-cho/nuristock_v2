import { styled } from '@styles/stitches.config';
import Flex from './Flex';
import { ReactNode, useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export const StyledSlideWrapper = styled(Flex, {
	// display: 'flex',
	transition: 'transform 0.3s ease-in-out',
	width: '100%',

	'& > div': {
		width: '100vw',
		flexShrink: 0,
	},
});

export const IndicatorWrapper = styled('div', {
	display: 'flex',
	justifyContent: 'center',
	gap: 6,
	position: 'fixed',
	bottom: 4,
	zIndex: 1,
});

export const Dot = styled('div', {
	width: 8,
	height: 8,
	borderRadius: '50%',
	backgroundColor: '#aaa',

	variants: {
		active: {
			true: { backgroundColor: '#1976d2' },
			false: { backgroundColor: '#ccc' },
		},
	},
});

export const SlideWrapper = ({ children, active }: { children?: ReactNode; active?: number }) => {
	const [activePage, setActivePage] = useState(0);
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (active !== undefined) {
			onShow();
			setActivePage(active);
		}
	}, [active]);

	const handlerSwipe = useSwipeable({
		onSwipedLeft: () => {
			onShow();
			setActivePage((prev) => Math.min(prev + 1, 1));
		},
		onSwipedRight: () => {
			onShow();
			setActivePage((prev) => Math.max(prev - 1, 0));
		},
		trackMouse: true,
	});

	const onShow = () => {
		setShow(true);
		setTimeout(() => setShow(false), 2000);
	};

	useEffect(() => {
		onShow();
	}, []);

	return (
		<>
			<StyledSlideWrapper style={{ transform: `translateX(-${activePage * 100}%)` }} align={'start'} {...handlerSwipe}>
				{children}
			</StyledSlideWrapper>

			{show && (
				<IndicatorWrapper className='dot'>
					{[0, 1].map((i) => (
						<Dot key={i} active={activePage === i} />
					))}
				</IndicatorWrapper>
			)}
		</>
	);
};
