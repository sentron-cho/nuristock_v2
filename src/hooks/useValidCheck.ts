import useAlert from './useAlert';

export default function useValidCheck() {
	const { showAlertError } = useAlert();

	const setCheckValid = (
		ref: any,
		message: string,
		isFocus: boolean = true
	) => {
		const value = ref?.current?.value;

		if (!value) {
			showAlertError(message);
			isFocus && setTimeout(() => ref?.current?.focus(), 200);
			return false;
		} else {
			return value;
		}
	};

	return { setCheckValid };
}
