import { useSelectProfit } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import clsx from 'clsx';
import { valueOfPlusMinus } from '@shared/libs/utils.lib';
import { useMemo } from 'react';
import { sortedByKey } from '@shared/libs/sort.lib';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { useNaviByOptions } from '@shared/hooks/useOptionNavi.hook';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { URL } from '@shared/config/url.enum';
import { TitleNavigation } from '@entites/TitleNavigation';
import { ProfitSummary } from '@features/profit/ui/ProfitSummary.ui';
import { ProfitCard } from '@features/profit/ui/ProfitCard.ui';

export const ProfitPerCodePageMo = () => {
	const { param, navigate } = useCommonHook();
	const { data: profitData } = useSelectProfit();

	const {
		summary,
		data: list,
		createSumData,
		groupedByName,
		dividendByName,
		createTotal,
		createDividendSumData,
	} = useProfitData(undefined, profitData);

	const name = useMemo(() => {
		return profitData?.value?.find((a) => a?.code === param?.id)?.name as string;
	}, [param]);

	// 데이터
	const data = useMemo(() => {
		if (!groupedByName || !name) return undefined;

		const key = name as string;
		const value = groupedByName?.[key];
		const sum = value?.map((a) => Number(a.sonic))?.reduce((a, b) => a + b, 0); // 수익금액
		const buyTotal = createTotal(value, 'sprice'); // 매수총액
		const sellTotal = createTotal(value, 'eprice'); // 매도총액
		const rate = ((sum / buyTotal) * 100).toFixed(2); // 매수 총액 대비 수익율
		const type = valueOfPlusMinus(Number(sum));
		const dividend = dividendByName?.[key]?.map((a) => a.price)?.reduce((a, b) => a + b, 0);
		const assetTotal = buyTotal; // 투자총액 = 매수총액

		// const assetTotal = value?.[0]?.asset;

		return {
			title: key,
			type,
			buyTotal,
			sellTotal,
			assetTotal,
			rate,
			sum,
			value,
			isEmpty: !buyTotal,
			dividend,
		};
	}, [name, groupedByName, dividendByName]);

	// 종목별 합계 구하기(손익 내림차순)
	const sortedList = useMemo(() => {
		return sortedByKey(createSumData(list, 'name'), 'sonic', true);
	}, [list]);

	// 연도별 배당 합계
	const dividendData = createDividendSumData(dividendByName?.[name as string], 'year');

	const naviOptions = useMemo(() => {
		return sortedList && Object.values(sortedList)?.map((a) => ({ value: a?.code, label: a?.name }));
	}, [sortedList]);

	const { next, prev } = useNaviByOptions({ options: naviOptions, value: param?.id });

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: (dir) => {
			return `${URL.PROFIT}/code/${dir === 'next' ? next?.value : prev?.value}`;
		},
	});

	const onClick = (eid?: string) => {
		navigate(`${URL.PROFIT}/code/${eid}`);
	};

	return (
		<PageContainer className={clsx('profit', 'per-code')} summaryData={summary}>
			<Flex direction={'column'} flex={1}>
				{/* 헤드 */}
				<TitleNavigation sticky options={naviOptions} value={param?.id} onClick={onClick} />

				{/* 요약 */}
				{!data?.isEmpty && <ProfitSummary data={data} />}

				{/* 컨텐츠 */}
				<Flex className={clsx(swipeClass)} flex={1} direction={'column'} {...handlerSwipe}>
					{!data?.isEmpty && (
						<Flex className='contents-layer' direction={'column'}>
							<ProfitCard viewType='code' data={data?.value} dividend={dividendData} />
						</Flex>
					)}
				</Flex>
			</Flex>
		</PageContainer>
	);
};
