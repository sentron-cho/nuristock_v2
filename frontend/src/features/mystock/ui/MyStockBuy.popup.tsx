import { TextFieldForm } from '@entites/TextFieldForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { MyStockTreadType as TreadType } from '../api/mystock.dto';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@styles/stitches.config';
import { useEffect } from 'react';
import { DatePickerForm } from '@entites/DatePickerForm';
import dayjs from 'dayjs';
import { withCommas } from '@shared/libs/utils.lib';
import { useCommonHook } from '@shared/hooks/useCommon.hook';

const StyledForm = styled(Flex, {
	input: {
		// textAlign: 'right',
	},
});

export const MyStockBuyPopup = ({ item, onClose }: { item?: TreadType; onClose: (isOk: boolean) => void }) => {
	console.log('[MyStockBuyPopup]', { item });

	const { showToast } = useCommonHook();

	const forms = useForm({
		defaultValues: { date: new Date(), cost: withCommas(item?.sise), count: '' },
		// values:{date: new Date(), cost: item?.sise, count: item?.count},
		resolver: zodResolver(
			z.object({
				date: z.coerce.string().refine(
					(value) => {
						const isValid = dayjs(value).isValid();
						console.log({ value, isValid });
						return isValid;
					},
					{ message: ST.IN_DATE }
				),
				cost: z.coerce
					.string()
					.refine(
						(value) => {
							return !isNaN(Number(withCommas(value, true)));
						},
						{ message: ST.ONLY_NUMBER }
					)
					.min(1, ST.ONLY_NUMBER),
				count: z.coerce
					.string()
					.refine(
						(value) => {
							return !isNaN(Number(withCommas(value, true)));
						},
						{ message: ST.ONLY_NUMBER }
					)
					.min(1, ST.ONLY_NUMBER),
			})
		),
		shouldFocusError: true,
	});

	useEffect(() => {
		setTimeout(() => forms?.setFocus('count'), 200);
	}, [forms]);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				(values) => {
					const params = { ...values, date: dayjs(values?.date).format('YYYY-MM-DD') };
					console.log('[success]', { values, params });
					showToast('registered');
					onClose?.(isOk);
				},
				(error) => {
					showToast('error');
					console.error('[error]', { error });
				}
			)();
		} else {
			onClose?.(false);
		}
	};

	return (
		<Dialog title={ST.BUY} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={20}>
				<DatePickerForm id='date' label={ST.BUY_DATE} placeholder={ST.IN_DATE} formMethod={forms} align='right' />
				<TextFieldForm
					id='cost'
					label={ST.BUY_COST}
					placeholder={ST.IN_NUMBER}
					size='small'
					formMethod={forms}
					maxLength={12}
					withComma
					focused
					align='right'
				/>
				<TextFieldForm
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
