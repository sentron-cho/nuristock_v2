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
import { ProfitItemType } from '@features/profit/api/profit.dto';
import dayjs from 'dayjs';
import { DividendItemType } from '@features/dividend/api/dividend.dto';

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
	} = useProfitData(undefined, profitData?.value, profitData?.dividend);

	const name = useMemo(() => {
		return profitData?.value?.find(a => a?.code === param?.id)?.name as string;
	}, [param])

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
	}, [name, groupedByName, dividendByName]);

	// 종목별 합계 구하기(손익 내림차순)
	const sortedList = useMemo(() => {
		return sortedByKey(createSumData(list, 'name'), 'sonic', true);
	}, [list]);

	// 연도별 배당 합계
	const dividendData = useMemo(() => {
		if (!dividendByName || !name) return undefined;

		const list = dividendByName?.[name as string]?.reduce(
			(acc, curr) => {
				let key = dayjs(curr.sdate).format('YYYY');
				curr['title'] = key;

				// 초기화
				if (!acc[key]) {
					acc[key] = { ...curr, cost: 0, count: 0, price: 0 };
				}

				acc[key].cost = (acc[key].cost || 0) + (curr.cost || 0);
				acc[key].count = (acc[key].count || 0) + (curr.count || 0);
				acc[key].price = (acc[key].price || 0) + (curr.price || 0);

				return acc;
			},
			{} as Record<string, DividendItemType>
		);

		return sortedByKey(list, 'title', true)?.map((a) => ({ title: a?.title, sonic: a?.price })) as ProfitItemType[];
	}, [name, dividendByName]);

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
			<Flex className={clsx(swipeClass)} flex={1} direction={'column'} {...handlerSwipe}>
				{/* 헤드 */}
				<TitleNavigation sticky options={naviOptions} value={param?.id} onClick={onClick} />

				{/* 요약 */}
				{!data?.isEmpty && <ProfitSummary data={data} />}

				{!data?.isEmpty && (
					<Flex className='contents-layer' direction={'column'}>
						{/* 컨텐츠 */}
						<Flex className='card-list'>
							<ProfitCard viewType='code' data={data?.value} dividend={dividendData} />
						</Flex>
					</Flex>
				)}
			</Flex>
		</PageContainer>
	);
};
