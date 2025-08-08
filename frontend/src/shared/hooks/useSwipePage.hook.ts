import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

export const useSwipePage = ({ onNextPage }: { onNextPage?: (dir?: 'left' | 'right') => string | void }) => {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const navigate = useNavigate();

	const swipeClass = `swipe-${searchParams?.get('swipe')}`;

	const handlerSwipe = useSwipeable({
		onSwiped: (e) => {
			const { dir, velocity } = e;
			// console.log(e);

			// 민감도 조절
			if (velocity < 0.5) return;

			if (!['left', 'right']?.includes(dir?.toLowerCase())) return;

			const page = onNextPage?.(dir?.toLowerCase() as 'left' | 'right');
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
