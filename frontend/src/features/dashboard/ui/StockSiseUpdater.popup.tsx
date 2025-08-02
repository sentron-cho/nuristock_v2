import { NumberInputForm, TextInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ST } from '@shared/config/kor.lang';
import { DashboardSiseItemType as DataType } from '@features/dashboard/api/dashboard.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Schema, useCommonHook } from '@shared/hooks/useCommon.hook';
import { withCommas, toNumber, valueOfUpDown } from '@shared/libs/utils.lib';
import { useUpdateMarketSise } from '@features/market/api/market.api';
import dayjs from 'dayjs';
import { DATE_TIME_FORMAT, DATE_TIME_DB_FORMAT } from '@shared/config/common.constant';
import Flex from '@entites/Flex';

export const StockSiseUpdaterPopup = ({ item, onClose }: { item?: DataType; onClose: (isOk: boolean) => void }) => {
	const { showToast } = useCommonHook();

	const forms = useForm({
		defaultValues: {
			stime: dayjs().format(DATE_TIME_FORMAT),
			sise: withCommas(item?.sise),
			ecost: withCommas(item?.ecost),
		},
		resolver: zodResolver(
			z.object({
				stime: z.string(),
				sise: Schema.DefaultNumber,
				ecost: Schema.DefaultNumber,
			})
		),
		shouldFocusError: true,
	});

	const { mutateAsync: updateData } = useUpdateMarketSise();

	const onClickClose = (isOk: boolean) => {
		if (!isOk) return onClose(false);

		forms?.handleSubmit(async (field) => {
			if (!forms?.formState.dirtyFields) return onClose(false);

			if (!item || !field) return showToast('error', ST.ERROR_UNKNOWN);

			const sise = Number(toNumber(field.sise));
			const ecost = Number(toNumber(field.ecost));

			const params = {
				sise: sise,
				ecost: ecost,
				stime: dayjs(field.stime).format(DATE_TIME_DB_FORMAT),
				code: item.code,
				updown: valueOfUpDown(ecost, 0),
				erate: Number(((ecost / sise) * 100).toFixed(2)),
			};

			params && (await updateData(params));
			// showToast('updated');
			onClose?.(isOk);
		})();
	};

	return (
		<Dialog title={`${item?.name}(${item?.code})`} onClose={onClickClose}>
			<Flex direction={'column'} gap={24}>
				<TextInputForm
					id={`stime`}
					disabled={true}
					label={ST.UPDATE_TIME}
					size='small'
					align='right'
					formMethod={forms}
				/>
				<NumberInputForm autoFocus id='sise' label={ST.SISE} maxLength={10} formMethod={forms} />
				<NumberInputForm id='ecost' label={ST.ECOST} maxLength={10} formMethod={forms} />
			</Flex>
		</Dialog>
	);
};
