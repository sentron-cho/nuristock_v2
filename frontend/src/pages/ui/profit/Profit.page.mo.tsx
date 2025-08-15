import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import clsx from 'clsx';
import { ST } from '@shared/config/kor.lang';
import { ProfitCardField } from '@features/profit/ui/ProfitCardRows.ui';
import { URL } from '@shared/config/url.enum';
import { useMemo } from 'react';
import { sortedByKey } from '@shared/libs/sort.lib';
import { styled } from '@styles/stitches.config';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { Card } from '@entites/Card';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { ProfitItemType } from '@features/profit/api/profit.dto';
import { TitleNavigation } from '@entites/TitleNavigation';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { ProfitSummaryMain } from '@features/profit/ui/ProfitSummary.ui';

const StyledPage = styled(PageContainer, {
	'.card': {
		'.box': {
			padding: '10px',
		},
	},
});

export const ProfitPageMo = ({ viewType }: { viewType?: 'year' | 'code' }) => {
	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit();

	const { summary, data, createSumData, createDividendSumData } = useProfitData(yearsData?.value, profitData);
	const { navigate } = useCommonHook();

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: () => {
			return `${URL.PROFIT}/${viewType === 'year' ? 'code' : 'year'}`;
		},
	});

	// 년도별 배당 합계
	const dividendPerYear = useMemo(() => {
		return createDividendSumData(profitData?.dividend, 'year');
	}, [profitData?.dividend]);

	// 종목별 배당 합계
	const dividendPerName = useMemo(() => {
		return createDividendSumData(profitData?.dividend, 'name');
	}, [profitData?.dividend]);

	// 년도별 수익 합계(배당 포함)
	const years = useMemo(() => {
		const items = createSumData(data, 'year');
		return (
			items &&
			sortedByKey(Object.values(items), 'title', true)?.map((item) => {
				const { title, sonicRate } = item;

				const type = valueOfPlusMinus(item.sonic, 0);
				const dividend = dividendPerYear?.find((b) => b.title === title);

				const sonic = dividend ? Number(item.sonic) + Number(dividend?.sonic) : item.sonic;
				const dividendRate = dividend ? ((Number(dividend?.sonic) / Number(item.sprice)) * 100).toFixed(1) : 0;

				return {
					...item,
					type,
					sonic: sonic,
					sonicRate: dividend ? (Number(sonicRate) + Number(dividendRate)).toFixed(1) : sonicRate,
				};
			})
		);
	}, [data]);

	// 종목별 수익 합계(배당 포함)
	const names = useMemo(() => {
		const items = createSumData(data, 'name');
		return (
			items &&
			sortedByKey(Object.values(items), 'sonic', true)?.map((item) => {
				const { title, sonicRate } = item;

				const type = valueOfPlusMinus(item.sonic, 0);
				const dividend = dividendPerName?.find((b) => b.title === title);

				const sonic = dividend ? Number(item.sonic) + Number(dividend?.sonic) : item.sonic;
				const dividendRate = dividend ? ((Number(dividend?.sonic) / Number(item.sprice)) * 100).toFixed(1) : 0;

				return {
					...item,
					type,
					sonic: sonic,
					sonicRate: dividend ? (Number(sonicRate) + Number(dividendRate)).toFixed(1) : sonicRate,
				};
			})
		);
	}, [data]);

	const onClickItemYear = (item: ProfitItemType) => {
		navigate(`${URL.PROFIT}/year/${item?.title}`);
	};

	const onClickItemName = (item: ProfitItemType) => {
		navigate(`${URL.PROFIT}/code/${item?.code}`);
	};

	const onClick = (eid?: string) => {
		eid && navigate(`${URL.PROFIT}/${eid}`);
	};

	const naviOptions = useMemo(
		() => [
			{ label: ST.PER_YEARS, value: 'year' },
			{ label: ST.PER_CODES, value: 'code' },
		],
		[]
	);

	return (
		<StyledPage className={clsx('profit', 'main')} summaryData={summary}>
			<Flex className='contents-layer' direction={'column'} {...handlerSwipe}>
				{/* 연도별 */}
				{viewType === 'year' && (
					<Flex className={clsx(swipeClass)} direction={'column'} justify={'center'}>
						{/* 제목 */}
						<TitleNavigation sticky options={naviOptions} value={viewType} onClick={onClick} />

						{/* 요약 */}
						<ProfitSummaryMain data={data} dividend={dividendPerYear} />

						{/* 컨텐츠 */}
						<Card className={clsx('card')}>
							<Flex className={clsx('box')} direction='column' gap={0}>
								{years?.map((item, index) => {
									const { title, sonic, sonicRate, type } = item;

									return (
										<ProfitCardField
											key={`profit-${index}`}
											type={type}
											title={title}
											text={`${sonicRate} %`}
											value={toCost(sonic)}
											onClick={() => onClickItemYear?.(item)}
											height={36}
											titleProps={{ style: { fontSize: 16, fontWeight: 500 } }}
										/>
									);
								})}
							</Flex>
						</Card>
					</Flex>
				)}

				{/* 종목별 */}
				{viewType === 'code' && (
					<Flex className={clsx(swipeClass)} direction={'column'}>
						{/* 제목 */}
						<TitleNavigation sticky options={naviOptions} value={viewType} onClick={onClick} />

						{/* 요약 */}
						<ProfitSummaryMain data={years} dividend={dividendPerYear} />

						{/* 컨텐츠 */}
						<Card className={clsx('card')}>
							<Flex className={clsx('box')} direction='column' gap={0}>
								{names?.map((item, index) => {
									const { title, sonic, sonicRate, type } = item;

									return (
										<ProfitCardField
											key={`profit-${index}`}
											type={type}
											title={title}
											text={`${sonicRate} %`}
											value={toCost(sonic)}
											onClick={() => onClickItemName?.(item)}
											height={32}
											titleProps={{ style: { fontSize: 16, fontWeight: 500 } }}
										/>
									);
								})}
							</Flex>
						</Card>
					</Flex>
				)}
			</Flex>
		</StyledPage>
	);
};
