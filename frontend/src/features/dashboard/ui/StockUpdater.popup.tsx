import { TextFieldForm } from '@entites/TextFieldForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import { DashboardItemType as DataType } from '@features/dashboard/api/dashboard.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const StockUpdaterPopup = ({ item, onClose }: { item?: DataType; onClose: (isOk: boolean) => void }) => {
	const forms = useForm<{ title: string }>({
		defaultValues: { title: item?.name },
		resolver: zodResolver(
			z.object({
				title: z.string().nonempty({ message: ST.PLEASE_INPUT }),
			})
		),
	});
	console.log(item);

	const onClickClose = (isOk: boolean) => {
		forms?.handleSubmit(
			(forms) => {
				console.log('[success]', { forms });
				onClose?.(isOk);
			},
			// (error) => {
			// 	console.log('[error]', { error });
			// }
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
