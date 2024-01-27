import { showLoading, hideLoading } from '@/store/MainReducer';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useLoading() {
	const dispatch = useDispatch();

	const onLoading = useCallback((isLoading: boolean = true) => {
		dispatch(isLoading ? showLoading() : hideLoading());
	}, []);

	const onShowLoading = useCallback(() => {
		dispatch(showLoading());
	}, []);

	const onHideLoading = useCallback(() => {
		dispatch(hideLoading());
	}, []);

	return { onLoading, onShowLoading, onHideLoading };
}
