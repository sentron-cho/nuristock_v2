import Flex from '@entites/Flex';
import { Text } from '@entites/Text';
import { SubTitle } from '@entites/Title';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { ST } from '@shared/config/kor.lang';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { ProfitItemType } from '../api/profit.dto';
import { useProfitData } from '../hook/ProfitData.hook';
import { sortedByKey } from '@shared/libs/sort.lib';

// 투자손익 메인 화면 요약
export const ProfitSummaryMain = ({ data, dividend }: { data?: ProfitItemType[]; dividend?: ProfitItemType[] }) => {
	const { createSumData } = useProfitData();

	// 년도별 수익 합계(배당 미포함)
	const parsed = useMemo(() => {
		const items = createSumData(data, 'year');
		return items && sortedByKey(Object.values(items), 'title', true);
	}, [data]);

	const item = useMemo(() => {
		const buyTotal = parsed?.map((a) => Number(a.sprice))?.reduce((a, b) => a + b, 0);
		const sellTotal = parsed?.map((a) => Number(a.eprice))?.reduce((a, b) => a + b, 0);
		const sonicTotal = parsed?.map((a) => Number(a.sonic))?.reduce((a, b) => a + b, 0);
		const dividendTotal = dividend?.map((a) => Number(a.sonic))?.reduce((a, b) => a + b, 0);
		const total = Number(sonicTotal) + Number(dividendTotal);
		const assetTotal = parsed?.map((a) => Number(a?.asset))?.reduce((a, b) => a + b, 0);
		const assetAvg = Math.round(Number(assetTotal) / Number(parsed?.length));

		// console.log({ assetTotal, count: parsed?.length, assetAvg });
		// const sonicRate = `${((Number(sonicTotal) / Number(buyTotal)) * 100).toFixed(1)} %`;
		// const dividendRate = `${((Number(dividendTotal) / Number(buyTotal)) * 100).toFixed(1)} %`;
		// const totalRate = `${((Number(total) / Number(buyTotal)) * 100).toFixed(1)} %`;

		const sonicRate = `${((Number(sonicTotal) / Number(assetTotal)) * 100).toFixed(1)} %`; // 손익총액 / 투자총액
		const dividendRate = `${((Number(dividendTotal) / Number(assetTotal)) * 100).toFixed(1)} %`;
		const totalRate = `${((Number(total) / Number(assetTotal)) * 100).toFixed(1)} %`;

		return {
			type: valueOfPlusMinus(sonicTotal),
			buy: toCost(buyTotal),
			sell: toCost(sellTotal),
			sonic: toCost(sonicTotal),
			dividend: toCost(dividendTotal),
			total: toCost(total),
			asset: toCost(assetTotal),
			sonicRate,
			dividendRate,
			totalRate,
			assetAvg,
		};
	}, [parsed, dividend]);

	return (
		<ContentsHeader>
			{item && (
				<Flex direction={'column'}>
					{/* 누적투자총액 */}
					<SummaryField title={ST.ASSET} value={item.asset} />

					{/* 매수 */}
					<SummaryField title={ST.BUY} value={item.buy} />

					{/* 매도 */}
					<SummaryField title={ST.SELL} value={item.sell} />

					{/* 손익 */}
					<SummaryField title={ST.SONIC} value={item.sonic} type={item?.type} text={item.sonicRate} />

					{/* 배당 */}
					<SummaryField title={ST.DIVIDEND} value={item.dividend} type={'plus'} text={item.dividendRate} />

					{/* 총계 */}
					<SummaryField title={ST.TOTAL} value={item.total} type={'plus'} text={item.totalRate} />
				</Flex>
			)}
		</ContentsHeader>
	);
};

// 투자손익 상세 화면 요약
export const ProfitSummary = ({ data }: { data?: FieldValues }) => {
	const item = useMemo(() => {
		const total = Number(data?.dividend) + Number(data?.sum);

		const sonicRate = `${((Number(data?.sum) / Number(data?.assetTotal)) * 100).toFixed(1)} %` // 손익총액 / 투자총액
		const dividendRate = `${((Number(data?.dividend) / Number(data?.assetTotal)) * 100).toFixed(1)} %`;
		const totalRate = `${((Number(total) / Number(data?.assetTotal)) * 100).toFixed(1)} %`;
		
		// const sonicRate = `${((Number(data?.sum) / Number(data?.buyTotal)) * 100).toFixed(1)} %` // 손익총액 / 투자총액
		// const dividendRate = `${((Number(data?.dividend) / Number(data?.buyTotal)) * 100).toFixed(1)} %`;
		// const totalRate = `${((Number(total) / Number(data?.buyTotal)) * 100).toFixed(1)} %`;

		return {
			type: data?.type,
			buy: toCost(data?.buyTotal),
			sell: toCost(data?.sellTotal),
			asset: toCost(data?.assetTotal),
			sonic: toCost(data?.sum),
			dividend: toCost(data?.dividend),
			total: toCost(total),
			totalType: valueOfPlusMinus(total),
			sonicRate,
			dividendRate,
			totalRate,
		};
	}, [data]);

	return (
		<ContentsHeader>
			{item && (
				<Flex direction={'column'}>
					{/* 투자금 */}
					{item.asset !== item.buy && <SummaryField title={ST.ASSET} value={item.asset} />}

					{/* 매수 */}
					<SummaryField title={ST.BUY} value={item.buy} />

					{/* 매도 */}
					<SummaryField title={ST.SELL} value={item.sell} type={item.type} />

					{/* 손익 */}
					<SummaryField title={ST.SONIC} value={item.sonic} type={item.type} text={item.sonicRate} />

					{/* 배당 */}
					{data?.dividend && (
						<SummaryField title={ST.DIVIDEND} value={item.dividend} type={'plus'} text={item.dividendRate} />
					)}

					{/* 배당이 있을 경우 합계 */}
					{data?.dividend && (
						<SummaryField title={ST.TOTAL} value={item.total} type={item.totalType} text={item.totalRate} />
					)}
				</Flex>
			)}
		</ContentsHeader>
	);
};

const StyledField = styled(Flex, {
	'.rate': {
		position: 'absolute',
		transform: 'translateX(50%)',
		right: '52%',
		width: '60px',
		textAlign: 'right',
	},
});

const SummaryField = ({
	type,
	title,
	text,
	value,
}: {
	type?: string;
	title?: string;
	text?: string;
	value: string;
}) => {
	return (
		<StyledField justify={'between'}>
			<SubTitle className='title' title={title} flex={1} />
			{text && <Text size='sm' className={clsx('rate', type)} align='right' text={text} />}
			<Text className={clsx('sum', type)} bold flex={1} align='right' text={value} />
		</StyledField>
	);
};
