import { TextFieldForm } from '@entites/TextFieldForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import { DashboardItemType as DataType } from '@features/dashboard/api/dashboard.dto';

export const StockUpdaterPopup = ({ item, onClose }: { item?: DataType; onClose: (isOk: boolean) => void }) => {
	const forms = useForm<{ textInput: string }>({ defaultValues: { textInput: item?.name } });
	console.log(item);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			if (!forms?.getValues('textInput')) {
				forms.setError('textInput', { message: ST.PLEASE_INPUT });
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
			<TextFieldForm label={ST.STOCK_TITLE} size='small' id='textInput' formMethod={forms} onClearError={onClearError} maxLength={10} />
		</Dialog>
	);
};
