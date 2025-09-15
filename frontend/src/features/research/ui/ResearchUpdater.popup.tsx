import { NumberInputForm, TextInputForm } from '@entites/TextInputForm';
import { Dialog } from '@entites/Dialog';
import { useForm } from 'react-hook-form';
import { ResearchItemType as DataType, ResearchInfoReportData } from '../api/research.dto';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@styles/stitches.config';
import { toNumber, toShortCost, withCommas } from '@shared/libs/utils.lib';
import { useUpdateResearch as useUpdate, useCreateResearchYear as useCreate } from '../api/research.api';
import { SubTitle } from '@entites/Title';
import { Text } from '@entites/Text';
import { useMemo } from 'react';
// import { isEqual } from 'lodash';

const StyledForm = styled(Flex, {
	'.equity, .profit': {
		position: 'relative',

		'.cost-guide': {
			position: 'absolute',
			right: 4,
			top: -16,
			color: '$gray700',
		},
	},
});

export const ResearchUpdaterPopup = ({
	type = 'edit',
	item,
	naverData,
	onClose,
}: {
	type?: 'edit' | 'add';
	item?: DataType;
	naverData?: ResearchInfoReportData;
	onClose: (isOk: boolean) => void;
}) => {
	const values = useMemo(() => {
		if (!item) return undefined;

		if (naverData) {
			const year = item.cdate;
			const report = naverData?.report?.find((a) => a.year?.toString() === year?.toString());
			const { sise, shares } = naverData;

			if (!isNaN(Number(item?.roe)) || !isNaN(Number(item?.equity))) {
				return { sise, stype: naverData?.type, scount: shares, ...report };
			} else {
				return { ...item, stype: naverData?.type };
			}
		} else {
			return {
				...item,
				stype: item?.type,
				debt: toNumber(item?.debt?.toString()),
				eps: Number(toNumber(item?.eps?.toString()))?.toFixed(0),
				debtratio: Number(item?.debtratio),
			};
		}
	}, [item, naverData]);

	const forms = useForm({
		defaultValues: {
			stype: values?.stype,
			sise: !isNaN(Number(values?.sise)) ? withCommas(values?.sise) : '',
			scount: !isNaN(Number(values?.scount)) ? withCommas(values?.scount) : '',
			roe: !isNaN(Number(values?.roe)) ? withCommas(values?.roe) : '',
			equity: !isNaN(Number(values?.equity)) ? withCommas(values?.equity) : '',
			eps: !isNaN(Number(values?.eps)) ? withCommas(values?.eps) : '',
			profit: !isNaN(Number(values?.profit)) ? withCommas(values?.profit) : '',
			debt: !isNaN(Number(values?.debt)) ? withCommas(values?.debt) : '',
			debtratio: !isNaN(Number(values?.debtratio)) ? withCommas(values?.debtratio) : '',
		},
		resolver: zodResolver(
			z.object({
				stype: z.string().optional(),
				sise: z.string().optional(),
				scount: z.string().optional(),
				roe: z.string().optional(),
				equity: z.string().optional(),
				eps: z.string().optional(),
				profit: z.string().optional(),
				debt: z.string().optional(),
				debtratio: z.string().optional(),
			})
		),
		shouldFocusError: true,
	});

	const { mutateAsync: updateData } = useUpdate();
	const { mutateAsync: createData } = useCreate();

	const selectedEquity = forms?.watch('equity');
	const equityGuide = useMemo(() => {
		if (!selectedEquity) return undefined;

		const item = toShortCost(toNumber(selectedEquity));
		return `${Number(toNumber(item.value as string)).toFixed(0)} ${item.unit}`;
	}, [selectedEquity]);

	const selectedProfit = forms?.watch('profit');
	const profitGuide = useMemo(() => {
		if (!selectedProfit) return undefined;

		const item = toShortCost(toNumber(selectedProfit));
		return `${Number(toNumber(item.value as string)).toFixed(0)} ${item.unit}`;
	}, [selectedProfit]);

	const onClickClose = (isOk: boolean) => {
		if (isOk) {
			forms?.handleSubmit(
				async (fields) => {
					// const isDirty = !isEqual(
					// 	{
					// 		profit: toNumber(item?.profit),
					// 		scount: toNumber(item?.scount as string),
					// 		equity: toNumber(item?.equity),
					// 		roe: Number(item?.roe),
					// 	},
					// 	{
					// 		profit: toNumber(fields?.profit),
					// 		scount: toNumber(fields?.scount),
					// 		equity: toNumber(fields?.equity),
					// 		roe: Number(fields?.roe),
					// 	}
					// );

					const params = {
						...fields,
						sise: toNumber(fields?.sise),
						profit: toNumber(fields?.profit),
						equity: toNumber(fields?.equity),
						scount: toNumber(fields?.scount),
					} as DataType;

					if (type === 'edit') {
						await updateData({ ...params, rowid: item?.rowid, code: item?.code, cdate: item?.cdate });
					} else {
						await createData({ ...params, code: item?.code, cdate: item?.cdate });
					}

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
		<Dialog title={`${item?.cdate}${ST.EMPTY_INVESTMENT}`} onClose={onClickClose}>
			<StyledForm direction={'column'} gap={24}>
				<Flex justify={'center'}>
					<SubTitle title={`${item?.name}(${item?.code})`} />
				</Flex>
				<TextInputForm id='stype' label={ST.MARKET} formMethod={forms} focused />
				<NumberInputForm id='sise' label={ST.SISE} formMethod={forms} focused />
				<NumberInputForm id='scount' label={ST.STOCKS_COUNT} formMethod={forms} focused />
				<NumberInputForm id='roe' label={ST.ROE} formMethod={forms} focused />
				{/* 자본 */}
				<Flex className='equity'>
					<NumberInputForm id='equity' label={ST.EQUITY} formMethod={forms} focused />
					{equityGuide && <Text size='xs' className='cost-guide' text={equityGuide} />}
				</Flex>
				{/* 당기순이익 */}
				<Flex className='profit'>
					<NumberInputForm id='profit' label={ST.PROFIT} formMethod={forms} focused />
					{profitGuide && <Text size='xs' className='cost-guide' text={profitGuide} />}
				</Flex>
				<NumberInputForm id='eps' label={ST.EPS} formMethod={forms} focused />
				<NumberInputForm id='debt' label={ST.DEBT} formMethod={forms} focused />
				<NumberInputForm id='debtratio' label={ST.DEBT_RATIO} formMethod={forms} focused />
			</StyledForm>
		</Dialog>
	);
};
