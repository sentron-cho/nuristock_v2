import { TextFieldForm } from '@entites/TextFieldForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { MyStockTreadType as TreadType } from '../api/mystock.dto';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { DatePickerForm } from '@entites/DatePickerForm';
import dayjs from 'dayjs';
import { withCommas } from '@shared/libs/utils.lib';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { ST } from '@shared/config/kor.lang';

const StyledForm = styled(Flex, {
	input: {
		// textAlign: 'right',
	},
});

export const MyStockSellPopup = ({ item, onClose }: { item?: TreadType; onClose: (isOk: boolean) => void }) => {
	console.log('[MyStockSellPopup]', { item });

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
		<Dialog title={ST.SELL} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={24}>
				{/* 매수 */}
				<Flex direction={'column'} gap={10}>
					<DatePickerForm
						id='buyDate'
						disabled
						defaultValue={dayjs(new Date())}
						label={ST.BUY_DATE}
						placeholder={ST.IN_DATE}
						align='right'
					/>
					<Flex direction={'row'} gap={10}>
						<TextFieldForm
							id='buyCost'
							disabled
							label={ST.BUY_COST}
							size='small'
							withComma
							align='right'
							value={'123'}
						/>
						<TextFieldForm
							id='buyCount'
							disabled
							label={ST.STOCK_COUNT}
							size='small'
							withComma
							align='right'
							defaultValue={123}
						/>
					</Flex>
				</Flex>

				{/* 매도 */}
				<Flex direction={'column'} gap={10}>
					<DatePickerForm id='date' label={ST.SELL_DATE} placeholder={ST.IN_DATE} formMethod={forms} align='right' />
					<Flex direction={'row'} gap={10}>
						<TextFieldForm
							className='cost'
							label={ST.SELL_COST}
							placeholder={ST.IN_NUMBER}
							size='small'
							id='cost'
							formMethod={forms}
							maxLength={12}
							withComma
							focused
							align='right'
						/>
						<TextFieldForm
							className='count'
							label={ST.STOCK_COUNT}
							placeholder={ST.IN_NUMBER}
							size='small'
							id='count'
							formMethod={forms}
							maxLength={8}
							withComma
							focused
							align='right'
							// slotProps={{ input: { type: 'number' } }}
						/>
					</Flex>
				</Flex>
			</StyledForm>
		</Dialog>
	);
};
