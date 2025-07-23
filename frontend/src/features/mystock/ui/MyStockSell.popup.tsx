import { TextInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { MyStockTreadType as TreadType } from '../api/mystock.dto';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useMemo } from 'react';
import { DatePickerForm } from '@entites/DatePickerForm';
import dayjs from 'dayjs';
import { withCommas } from '@shared/libs/utils.lib';
import { Schema, useCommonHook } from '@shared/hooks/useCommon.hook';
import { ST } from '@shared/config/kor.lang';
import { Text } from '@entites/Text';

const StyledForm = styled(Flex, {
	input: {
		// textAlign: 'right',
	},
});

export const MyStockSellPopup = ({ item, onClose }: { item?: TreadType; onClose: (isOk: boolean) => void }) => {
	console.log('[MyStockSellPopup]', { item });

	const { showToast } = useCommonHook();

	const forms = useForm({
		defaultValues: {
			buyCost: withCommas(item?.scost),
			buyCount: withCommas(item?.count),
			buyDate: item?.sdate,
			sellDate: new Date(),
			sellCost: withCommas(item?.sise),
			sellCount: withCommas(item?.count),
		},
		resolver: zodResolver(
			z.object({
				buyCost: z.string().optional(),
				buyCount: z.string().optional(),
				buyDate: z.string().optional(),
				sellDate: Schema.DefaultDate,
				sellCost: Schema.DefaultNumber,
				sellCount: Schema.DefaultNumber,
			})
		),
		shouldFocusError: true,
	});

	useEffect(() => {
		setTimeout(() => forms?.setFocus('sellCost'), 200);
	}, [forms]);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				(values) => {
					const params = { ...values, date: dayjs(values?.sellDate).format('YYYY-MM-DD') };
					console.log('[success]', { values, params });
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
		<Dialog title={ST.SELL} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={24}>
				{/* 매수 */}
				<ContentsForm type={'buy'} formMethod={forms} />

				{/* 매도 */}
				<ContentsForm type={'sell'} formMethod={forms} />
			</StyledForm>
		</Dialog>
	);
};

const ContentsForm = <T extends FieldValues>({
	type = 'buy',
	formMethod,
}: {
	type: 'buy' | 'sell';
	formMethod?: UseFormReturn<T>;
}) => {
	const isBuy = useMemo(() => type === 'buy', [type]);

	return (
		<Flex direction={'column'} gap={10}>
			<Text bold text={isBuy ? ST.BUY : ST.SELL} />
			<DatePickerForm
				id={`${type}Date`}
				disabled={isBuy}
				defaultValue={dayjs(new Date())}
				label={isBuy ? ST.BUY_DATE : ST.SELL_DATE}
				placeholder={ST.IN_DATE}
				align='right'
				formMethod={formMethod}
			/>
			<Flex direction={'row'} gap={10}>
				<TextInputForm
					id={`${type}Cost`}
					disabled={isBuy}
					focused={!isBuy}
					label={isBuy ? ST.BUY_COST : ST.SELL_COST}
					size='small'
					withComma
					align='right'
					formMethod={formMethod}
				/>
				<TextInputForm
					id={`${type}Count`}
					disabled={isBuy}
					focused={!isBuy}
					label={ST.STOCK_COUNT}
					placeholder={ST.IN_NUMBER}
					size='small'
					withComma
					align='right'
					maxLength={8}
					formMethod={formMethod}
				/>
			</Flex>
		</Flex>
	);
};
