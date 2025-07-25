import { TextInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { MyStockSellType as SellDataType } from '../api/mystock.dto';
import { styled } from '@styles/stitches.config';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMemo } from 'react';
import { DatePickerForm } from '@entites/DatePickerForm';
import dayjs from 'dayjs';
import { toNumber, withCommas } from '@shared/libs/utils.lib';
import { Schema, useCommonHook } from '@shared/hooks/useCommon.hook';
import { ST } from '@shared/config/kor.lang';
import { Text } from '@entites/Text';
import { DATE_DB_FORMAT } from '@shared/config/common.constant';
import { useCreateMyStockSell, useUpdateMyStockSell } from '../api/mystock.api';

const StyledForm = styled(Flex, {
	input: {},
});

export const MyStockSellPopup = ({ item, onClose }: { item?: SellDataType; onClose: (isOk: boolean) => void }) => {
	const { showToast } = useCommonHook();

	const isEditMode = useMemo(() => item?.mode === 'edit', [item]);

	console.log({ item });

	const forms = useForm({
		defaultValues: isEditMode
			? {
					buyCost: withCommas(item?.scost),
					buyCount: withCommas(item?.count),
					buyDate: dayjs(item?.sdate).toDate(),
					sellDate: dayjs(item?.edate).toDate(),
					sellCost: withCommas(item?.ecost),
					sellCount: withCommas(item?.count),
				}
			: {
					buyCost: withCommas(item?.scost),
					buyCount: withCommas(item?.count),
					buyDate: dayjs(item?.sdate).toDate(),
					sellDate: new Date(),
					sellCost: withCommas(item?.sise),
					sellCount: withCommas(item?.count),
				},
		resolver: zodResolver(
			z.object({
				buyCost: z.string().optional(),
				buyCount: z.string().optional(),
				buyDate: z.date().optional(),
				sellDate: Schema.DefaultDate,
				sellCost: Schema.DefaultNumber,
				sellCount: Schema.DefaultNumber,
			})
		),
		shouldFocusError: true,
	});

	const { mutateAsync: createData } = useCreateMyStockSell();
	const { mutateAsync: updateData } = useUpdateMyStockSell();

	// useEffect(() => {
	// 	setTimeout(() => forms?.setFocus('sellCost'), 200);
	// }, [forms]);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (fields) => {
					if (!item?.code) return showToast('error', ST.ERROR_UNKNOWN);

					const params = {
						rowid: item?.rowid,
						code: item.code,
						sdate: dayjs(fields?.buyDate).format(DATE_DB_FORMAT),
						edate: dayjs(fields?.sellDate).format(DATE_DB_FORMAT),
						scost: Number(toNumber(fields.buyCost)),
						ecost: Number(toNumber(fields.sellCost)),
						count: Number(toNumber(fields.sellCount)),
					};

					console.log({fields, params});

					if (isEditMode) {
						await updateData(params);
					} else {
						await createData(params);
					}

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
					autoFocus={!isBuy}
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
