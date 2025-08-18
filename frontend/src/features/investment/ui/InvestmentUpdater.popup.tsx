import { NumberInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { InvestmentItemType as DataType } from '../api/investment.dto';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@styles/stitches.config';
import { toNumber, withCommas } from '@shared/libs/utils.lib';
import { useUpdateInvestment as useUpdate } from '../api/investment.api';
import { SubTitle } from '@entites/Title';

const StyledForm = styled(Flex, {
	input: {
		// textAlign: 'right',
	},
});

export const InvestmentUpdaterPopup = ({ item, onClose }: { item?: DataType; onClose: (isOk: boolean) => void }) => {
	console.log({ item });
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

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (fields) => {
					const params = {
						rowid: item?.rowid,
						...fields,
						// profit: toNumber(fields?.profit),
						equity: toNumber(fields?.equity),
						count: toNumber(fields?.count),
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
				<NumberInputForm id='equity' label={ST.EQUITY} formMethod={forms} focused />
				{/* <NumberInputForm id='profit' label={ST.EXCESS_PROFIT} formMethod={forms} focused /> */}
				<NumberInputForm id='brate' label={ST.BASE_RATE} formMethod={forms} focused />
			</StyledForm>
		</Dialog>
	);
};
