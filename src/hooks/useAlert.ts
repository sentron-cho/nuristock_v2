import { showMessage } from '@/store/MainReducer';
import { AlertAlign, AlertType } from '@/types/types';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function useAlert() {
	const dispatch = useDispatch();

	const showAlertMessage = (
		message: string,
		type: AlertType = 'success',
		align: AlertAlign = 'right',
		timeout: number = 3000
	) => {
		dispatch(showMessage({ message, type, timeout, align }));
	};

	const showAlert = useCallback(
		(
			message: string,
			type: AlertType = 'success',
			align: AlertAlign = 'right',
			timeout: number = 3000
		) => showAlertMessage(message, type, align, timeout),
		[]
	);

	const showAlertError = useCallback(
		(message: string, align: AlertAlign = 'right', timeout?: number) =>
			showAlertMessage(message, 'fail', align, timeout),
		[]
	);

	const showAlertSuccess = useCallback(
		(message: string, align: AlertAlign = 'right', timeout?: number) =>
			showAlertMessage(message, 'success', align, timeout),
		[]
	);

	return { showAlert, showAlertError, showAlertSuccess };
}
