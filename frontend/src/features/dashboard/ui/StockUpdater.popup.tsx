import { TextFieldForm } from '@entites/TextFieldForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import { DashboardItemType as DataType } from '@features/dashboard/api/dashboard.dto';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const StockUpdaterPopup = ({ item, onClose }: { item?: DataType; onClose: (isOk: boolean) => void }) => {
	const forms = useForm<{ title: string }>({
		defaultValues: { title: item?.name },
		resolver: zodResolver(
			z.object({
				title: z.string({ message: ST.PLEASE_INPUT }),
			})
		),
	});
	console.log(item);

	const onClickClose = (isOk: boolean) => {
		// if (isOk) {
		// 	if (!forms?.getValues('textInput')) {
		// 		forms.setError('textInput', { message: ST.PLEASE_INPUT });
		// 		return;
		// 	}
		// }

		forms?.handleSubmit(
			(forms) => {
				console.log('[success]', { forms });
			},
			(error) => {
				console.log('[error]', { error });
			}
		)();

		onClose?.(isOk);
	};

	const onClearError = (id: string) => {
		forms?.clearErrors(id as never);
	};

	return (
		<Dialog title={ST.UPDATE} onClose={onClickClose}>
			<TextFieldForm
				label={ST.STOCK_TITLE}
				size='small'
				id='title'
				formMethod={forms}
				onClearError={onClearError}
				maxLength={10}
			/>
		</Dialog>
	);
};
