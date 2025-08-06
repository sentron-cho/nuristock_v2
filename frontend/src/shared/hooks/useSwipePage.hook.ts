import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

export const useSwipePage = ({ onNextPage }: { onNextPage?: () => string | void }) => {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const navigate = useNavigate();

	const swipeClass = `swipe-${searchParams?.get('swipe')}`;

	const handlerSwipe = useSwipeable({
		onSwiped: (e) => {
			const { dir } = e;
			// navigate(`${URL.DASHBOARD}/${viewType === 'keep' ? 'trade' : 'keep'}?swipe=${dir.toLowerCase()}`);
			const page = onNextPage?.();
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
