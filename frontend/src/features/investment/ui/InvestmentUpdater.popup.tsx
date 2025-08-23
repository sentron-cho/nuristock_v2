import { NumberInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { InvestmentItemType as DataType } from '../api/investment.dto';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@styles/stitches.config';
import { toNumber, toShortCost, withCommas } from '@shared/libs/utils.lib';
import { useUpdateInvestment as useUpdate } from '../api/investment.api';
import { SubTitle } from '@entites/Title';
import { Text } from '@entites/Text';
import { useMemo } from 'react';
import { CRALER_TYPE } from '@shared/config/common.enum';
import { isEqual } from 'lodash';

const StyledForm = styled(Flex, {
	'.equity': {
		position: 'relative',

		'.equity-guide': {
			position: 'absolute',
			right: 4,
			top: -16,
			color: '$gray700',
		},
	},
});

export const InvestmentUpdaterPopup = ({ item, onClose }: { item?: DataType; onClose: (isOk: boolean) => void }) => {
	const forms = useForm({
		defaultValues: {
			count: withCommas(item?.count),
			roe: withCommas(item?.roe),
			equity: withCommas(item?.equity),
			// profit: withCommas(item?.profit),
			brate: withCommas(item?.brate),
			rate1: withCommas(item?.rate1),
			rate2: withCommas(item?.rate2),
			rate3: withCommas(item?.rate3),
			rate4: withCommas(item?.rate4),
		},
		resolver: zodResolver(
			z.object({
				count: z.string().optional(),
				roe: z.string().optional(),
				equity: z.string().optional(),
				// profit: z.string().optional(),
				brate: z.string().optional(),
				rate1: z.string().optional(),
				rate2: z.string().optional(),
				rate3: z.string().optional(),
				rate4: z.string().optional(),
			})
		),
		shouldFocusError: true,
	});

	const { mutateAsync: updateData } = useUpdate();

	const selectedEquity = forms?.watch('equity');
	const guide = useMemo(() => {
		if (!selectedEquity) return undefined;

		const item = toShortCost(toNumber(selectedEquity));
		return `${Number(toNumber(item.value as string)).toFixed(0)} ${item.unit}`;
	}, [selectedEquity]);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (fields) => {
					const isDirty = !isEqual(
						{ count: toNumber(item?.count), equity: toNumber(item?.equity), roe: Number(item?.roe) },
						{
							count: toNumber(fields?.count),
							equity: toNumber(fields?.equity),
							roe: Number(fields?.roe),
						}
					);
					const ctype = isDirty ? CRALER_TYPE.MANUAL : CRALER_TYPE.FNGUIDE;
					console.log({ ctype });

					const params = {
						rowid: item?.rowid,
						...fields,
						// profit: toNumber(fields?.profit),
						equity: toNumber(fields?.equity),
						count: toNumber(fields?.count),
						ctype: ctype,
					} as DataType;

					await updateData(params);
					onClose?.(isOk);
				},
				(error) => {
					console.error('[error]', { error });
				}
			)();
		} else {
			onClose?.(false);
		}
	};

	return (
		<Dialog title={`${item?.sdate}${ST.EMPTY_INVESTMENT}`} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={24}>
				<Flex justify={'center'}>
					<SubTitle title={`${item?.name}(${item?.code})`} />
				</Flex>
				<NumberInputForm id='count' label={ST.STOCKS_COUNT} formMethod={forms} focused />
				<NumberInputForm id='roe' label={ST.ROE} formMethod={forms} focused />
				{/* 자본 */}
				<Flex className='equity'>
					<NumberInputForm id='equity' label={ST.EQUITY} formMethod={forms} focused />
					{guide && <Text size='xs' className='equity-guide' text={guide} />}
				</Flex>
				{/* <NumberInputForm id='profit' label={ST.EXCESS_PROFIT} formMethod={forms} focused /> */}
				<NumberInputForm id='brate' label={ST.BASE_RATE} formMethod={forms} focused />
			</StyledForm>
		</Dialog>
	);
};
