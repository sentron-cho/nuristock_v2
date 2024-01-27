import { updateUser } from '@/store/MainReducer';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useUser() {
	const dispatch = useDispatch();

	const onUpdateUser = useCallback(() => {
		dispatch(updateUser());
	}, []);

	return { onUpdateUser };
}
