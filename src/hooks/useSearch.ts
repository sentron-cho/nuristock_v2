import { setSearch, clearSearch } from '@/store/MainReducer';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useSearch() {
	const dispatch = useDispatch();

	const onSearch = useCallback((text: string) => {
		dispatch(setSearch(text));
	}, []);

	const onClearSearch = useCallback(() => {
		dispatch(clearSearch());
	}, []);

	return { onSearch, onClearSearch };
}
