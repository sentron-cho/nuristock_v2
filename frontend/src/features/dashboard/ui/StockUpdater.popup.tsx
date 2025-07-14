import { TextFieldForm } from '@entites/TextFieldForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';

export const StockUpdaterPopup = ({ onClose }: { onClose: (isOk: boolean) => void }) => {
	const forms = useForm<{ textInput: string }>({ defaultValues: { textInput: '' } });

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			const isValid = false;

			if (!isValid) {
				forms.setError('textInput', { message: '값을 입력하세요.' });
				return;
			}
		}

		onClose?.(isOk);
	};

	const onClearError = (id: string) => {
		forms?.clearErrors(id as never);
	};

	return (
		<Dialog title={ST.UPDATE} onClose={onClickClose}>
			<TextFieldForm size='small' id='textInput' formMethod={forms} onClearError={onClearError} maxLength={10} />
		</Dialog>
	);
};
