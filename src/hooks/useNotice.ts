import { updateNotice } from '@/store/MainReducer';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useNotice() {
	const dispatch = useDispatch();

	const onUpdateNotice = useCallback(() => {
		dispatch(updateNotice());
	}, []);

	return { onUpdateNotice };
}
