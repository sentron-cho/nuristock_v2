import { TextInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import { DashboardItemType as DataType } from '@features/dashboard/api/dashboard.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateDashboard } from '../api/dashboard.api';
// import { useCommonHook } from '@shared/hooks/useCommon.hook';

export const StockUpdaterPopup = ({ item, onClose }: { item?: DataType; onClose: (isOk: boolean) => void }) => {
	// const { showToast } = useCommonHook();

	const forms = useForm<{ title: string }>({
		defaultValues: { title: '' },
		values: { title: item?.name || '' },
		resolver: zodResolver(
			z.object({
				title: z.string({ message: ST.PLEASE_INPUT }).nonempty(),
			})
		),
		shouldFocusError: true,
	});

	const { mutateAsync: updateData } = useUpdateDashboard();

	const onClickClose = (isOk: boolean) => {
		if (!isOk) return onClose(false);

		forms?.handleSubmit(
			async (field) => {
				if (!forms?.formState.dirtyFields) return onClose(false);

				item?.code && (await updateData({ code: item.code, name: field?.title }));
				// showToast('updated');
				onClose?.(isOk);
			}
			// (error) => {
			// 	console.log('[error]', { error });
			// }
		)();
	};

	return (
		<Dialog title={ST.UPDATE} onClose={onClickClose}>
			<TextInputForm autoFocus id='title' label={ST.STOCK_TITLE} size='small' formMethod={forms} maxLength={20} />
		</Dialog>
	);
};
