import { NumberInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { MyStockTreadType as TreadType } from '../api/mystock.dto';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@styles/stitches.config';
import { DatePickerForm } from '@entites/DatePickerForm';
import dayjs from 'dayjs';
import { toNumber, withCommas } from '@shared/libs/utils.lib';
import { Schema, useCommonHook } from '@shared/hooks/useCommon.hook';
import { useCreateMyStockBuy, useUpdateMyStockBuy } from '../api/mystock.api';
import { DATE_DB_FORMAT } from '@shared/config/common.constant';
import { useMemo } from 'react';

const StyledForm = styled(Flex, {
	input: {
		// textAlign: 'right',
	},
});

export const MyStockBuyPopup = ({ item, onClose }: { item?: TreadType; onClose: (isOk: boolean) => void }) => {
	const { showToast } = useCommonHook();

	const isEditMode = useMemo(() => !!item?.rowid, [item]);

	const forms = useForm({
		defaultValues: isEditMode
			? { date: dayjs(item?.sdate).toDate(), cost: withCommas(item?.scost), count: withCommas(item?.count) }
			: { date: new Date(), cost: withCommas(item?.sise), count: '' },
		resolver: zodResolver(
			z.object({
				date: Schema.DefaultDate,
				cost: Schema.DefaultNumber,
				count: Schema.DefaultNumber,
			})
		),
		shouldFocusError: true,
	});

	const { mutateAsync: createData } = useCreateMyStockBuy();
	const { mutateAsync: updateData } = useUpdateMyStockBuy();

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (fields) => {
					if (!item?.code) return showToast('error', ST.ERROR_UNKNOWN);

					const params = {
						rowid: item?.rowid,
						code: item.code,
						scost: Number(toNumber(fields.cost)),
						count: Number(toNumber(fields.count)),
						sdate: dayjs(fields?.date).format(DATE_DB_FORMAT),
					};

					if (isEditMode) {
						await updateData(params);
					} else {
						await createData(params);
					}

					// showToast('registered');
					onClose?.(isOk);
				}
				// (error) => {
				// 	console.error('[error]', { error });
				// }
			)();
		} else {
			onClose?.(false);
		}
	};

	return (
		<Dialog title={`${ST.BUY}(${isEditMode ? ST.UPDATE : ST.ADD})`} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<DatePickerForm id='date' label={ST.BUY_DATE} placeholder={ST.IN_DATE} formMethod={forms} align='right' />
				<NumberInputForm
					id='cost'
					label={ST.BUY_COST}
					formMethod={forms}
					maxLength={12}
					autoFocus
				/>
				<NumberInputForm
					id='count'
					label={ST.STOCK_COUNT}
					formMethod={forms}
					maxLength={8}
					focused
				/>
			</StyledForm>
		</Dialog>
	);
};
