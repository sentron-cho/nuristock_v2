import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

export const useSwipePage = ({ onNextPage }: { onNextPage?: (dir?: 'next' | 'prev') => string | void }) => {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const navigate = useNavigate();
	const [swipeClass] = useState<string>('swipe-anim');

	useEffect(() => {
		const el = document?.querySelector('.swipe-anim') as HTMLElement;

		if (el) {
			el.classList.add(`swipe-${searchParams?.get('swipe')}`);

			const handleAnimationEnd = () => {
				setTimeout(() => {
					el?.classList?.remove('swipe-left');
					el?.classList?.remove('swipe-right');
				}, 200);
			};

			el.addEventListener('animationend', handleAnimationEnd);

			return () => {
				el.removeEventListener('animationend', handleAnimationEnd);
			};
		}
	}, [searchParams]);

	const handlerSwipe = useSwipeable({
		onSwiped: (e) => {
			const { dir, velocity } = e;

			// 민감도 조절
			if (velocity < 0.5) return;

			if (!['left', 'right']?.includes(dir?.toLowerCase())) return;

			const page = onNextPage?.(dir?.toLowerCase() === 'left' ? 'next' : 'prev');
			if (page) {
				navigate(`${page}?swipe=${dir.toLowerCase()}`);
			}
		},
		trackMouse: true,
	});

	return {
		swipeClass,
		handlerSwipe,
		navigate,
	};
};

// export const useSwipePage = ({ onNextPage }: { onNextPage?: (dir?: 'next' | 'prev') => string | void }) => {
// 	const location = useLocation();
// 	const searchParams = new URLSearchParams(location.search);
// 	const navigate = useNavigate();

// 	const swipeClass = `swipe-${searchParams?.get('swipe')}`;

// 	const handlerSwipe = useSwipeable({
// 		onSwiped: (e) => {
// 			const { dir, velocity } = e;
// 			// console.log(e);

// 			// 민감도 조절
// 			if (velocity < 0.5) return;

// 			if (!['left', 'right']?.includes(dir?.toLowerCase())) return;

// 			const page = onNextPage?.(dir?.toLowerCase() === 'left' ? 'next' : 'prev');
// 			if (page) {
// 				navigate(`${page}?swipe=${dir.toLowerCase()}`);
// 			}
// 		},
// 		trackMouse: true,
// 	});

// 	return {
// 		swipeClass,
// 		handlerSwipe,
// 		navigate,
// 	};
// };
