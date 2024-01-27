import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Alert from '@/components/Alert';
import { useDispatch } from 'react-redux';
import { IAlertReducer, hideMessage } from '@/store/MainReducer';
import { RootState } from '@/store/Store';

const MainAlert = () => {
	const dispatch = useDispatch();
	const alert = useSelector<RootState>(
		(state) => state.main.alert
	) as IAlertReducer;

	const [timer, setTimer] = useState<number | null>(null);

	useEffect(() => {
		if (alert && alert.message) {
			// 기존 타이머가 동작하면 중복 방지를 위해 삭제
			timer && clearTimeout(timer);

			const ti = setTimeout(() => {
				closeAlert();
			}, alert?.timeout || 3000);

			setTimer(ti);
		}
	}, [alert]);

	const closeAlert = () => {
		dispatch(hideMessage());
		timer && clearTimeout(timer);
		setTimer(null);
	};

	if (!alert || !alert.message) return;

	return (
		<Alert
			text={alert.message}
			timeout={0}
			type={alert.type}
			align={alert.align}
			onClose={closeAlert}
		/>
	);
};

export default MainAlert;
