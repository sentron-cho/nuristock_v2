import { TextInputForm } from '@entites/TextInputForm';
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
import { useCreateMyStockBuy } from '../api/mystock.api';
import { DATE_DB_FORMAT } from '@shared/config/common.constant';

const StyledForm = styled(Flex, {
	input: {
		// textAlign: 'right',
	},
});

export const MyStockBuyPopup = ({ item, onClose }: { item?: TreadType; onClose: (isOk: boolean) => void }) => {
	const { showToast } = useCommonHook();

	const forms = useForm({
		defaultValues: { date: new Date(), cost: withCommas(item?.sise), count: '' },
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

	// useEffect(() => {
	// 	setTimeout(() => forms?.setFocus('cost'), 200);
	// }, [forms]);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (fields) => {
					if (!item?.code) return showToast('error', ST.ERROR_UNKNOWN);

					const params = {
						code: item.code,
						scost: Number(toNumber(fields.cost)),
						count: Number(toNumber(fields.count)),
						sdate: dayjs(fields?.date).format(DATE_DB_FORMAT),
					};

					await createData(params);
					showToast('registered');
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
		<Dialog title={ST.BUY} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<DatePickerForm id='date' label={ST.BUY_DATE} placeholder={ST.IN_DATE} formMethod={forms} align='right' />
				<TextInputForm
					id='cost'
					label={ST.BUY_COST}
					placeholder={ST.IN_NUMBER}
					size='small'
					formMethod={forms}
					maxLength={12}
					withComma
					autoFocus
					align='right'
				/>
				<TextInputForm
					id='count'
					label={ST.STOCK_COUNT}
					placeholder={ST.IN_NUMBER}
					size='small'
					formMethod={forms}
					maxLength={8}
					withComma
					focused
					align='right'
					// slotProps={{ input: { type: 'number' } }}
				/>
			</StyledForm>
		</Dialog>
	);
};
