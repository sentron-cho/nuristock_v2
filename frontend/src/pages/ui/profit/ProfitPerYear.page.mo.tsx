import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { ProfitCard } from '@features/profit/ui/ProfitCard.ui';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import clsx from 'clsx';
import { valueOfPlusMinus } from '@shared/libs/utils.lib';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { useMemo } from 'react';
import { URL } from '@shared/config/url.enum';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { NoData } from '@entites/NoData';
import { TitleNavigation } from '@entites/TitleNavigation';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { ProfitSummary } from '@features/profit/ui/ProfitSummary.ui';
import { useNaviByOptions } from '@shared/hooks/useOptionNavi.hook';

export const ProfitPerYearPageMo = () => {
	const { param, navigate } = useCommonHook();

	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit();

	const { summary, groupedByYear, dividendByYear, naviOptions, createTotal, createDividendSumData } = useProfitData(
		yearsData?.value,
		profitData?.value,
		profitData?.dividend
	);

	// 데이터
	const data = useMemo(() => {
		if (!groupedByYear || !param) return undefined;

		const key = param?.id as string;
		const value = groupedByYear?.[key];
		const sum = value?.map((a) => Number(a.sonic))?.reduce((a, b) => a + b, 0); // 수익금액
		const buyTotal = createTotal(value, 'sprice'); // 매수총액
		const sellTotal = createTotal(value, 'eprice'); // 매도총액
		const rate = ((sum / buyTotal) * 100).toFixed(2); // 매수 총액 대비 수익율
		const type = valueOfPlusMinus(Number(sum));
		const dividend = dividendByYear?.[key]?.map((a) => a.price)?.reduce((a, b) => a + b, 0);

		return {
			title: key,
			type,
			buyTotal,
			sellTotal,
			rate,
			sum,
			value,
			isEmpty: !buyTotal,
			dividend,
		};
	}, [param, groupedByYear, dividendByYear]);

	const { next, prev } = useNaviByOptions({ options: naviOptions, value: param?.id });

	// 종목별 배당 합계
	const dividendData = createDividendSumData(dividendByYear?.[param?.id as string], 'name');

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: (dir) => {
			return `${URL.PROFIT}/year/${dir === 'next' ? next?.value : prev?.value}`;
		},
	});

	const onClick = (eid?: string) => {
		navigate(`${URL.PROFIT}/year/${eid}`);
	};

	return (
		<PageContainer className={clsx('profit', 'per-year')} summaryData={summary} isShowScrollTop={false}>
			<Flex className={clsx(swipeClass)} flex={1} direction={'column'} {...handlerSwipe}>
				{/* 헤드 */}
				<TitleNavigation sticky options={naviOptions} value={param?.id} onClick={onClick} />

				{/* 요약 */}
				{!data?.isEmpty && <ProfitSummary data={data} />}

				{!data?.isEmpty && (
					<Flex className='contents-layer' direction={'column'}>
						{/* 컨텐츠 */}
						<Flex className='card-list'>
							<ProfitCard data={data?.value} dividend={dividendData} />
						</Flex>
					</Flex>
				)}
				{data?.isEmpty && <NoData />}
			</Flex>
		</PageContainer>
	);
};
