import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { ProfitCard } from '@features/profit/ui/ProfitCard.ui';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import { SubTitle } from '@entites/Title';
import clsx from 'clsx';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { ST } from '@shared/config/kor.lang';
import { Text } from '@entites/Text';
import { StyledProfitPage } from '@page/style/Profit.style';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { useMemo } from 'react';
import { URL } from '@shared/config/url.enum';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { NoData } from '@entites/NoData';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { sortBy } from 'lodash';
import { TitleNavigation } from '@entites/TitleNavigation';

export const ProfitPerYearPageMo = () => {
	const { param, navigate } = useCommonHook();

	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit();

	const { summary, years, groupedByYear, dividendByYear, createTotal } = useProfitData(
		yearsData?.value,
		profitData?.value,
		profitData?.dividend
	);

	// 데이터
	const data = useMemo(() => {
		if (!groupedByYear || !param) return undefined;

		const year = param?.id as string;
		const value = groupedByYear?.[year];
		const sum = value?.map((a) => Number(a.sonic))?.reduce((a, b) => a + b, 0); // 수익금액
		const buyTotal = createTotal(value, 'sprice'); // 매수총액
		const sellTotal = createTotal(value, 'eprice'); // 매도총액
		const rate = ((sum / buyTotal) * 100).toFixed(2); // 매수 총액 대비 수익율
		const type = valueOfPlusMinus(Number(sum));
		const dividend = dividendByYear?.[year]?.map((a) => a.price)?.reduce((a, b) => a + b, 0);

		return {
			year,
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

	const options = useMemo(() => {
		return sortBy(
			years?.map((a) => ({ value: a?.year, label: a?.year })),
			['value']
		);
	}, [years]);

	// 이전 년도
	const prev = useMemo(() => {
		if (!years?.length || !param?.id) return '';

		const sorted = sortBy(years, ['year']);
		const index = sorted?.findIndex((a) => a.year?.toString() === param.id?.toString()) - 1;
		if (index < 0) {
			return sorted[years?.length - 1].year;
		} else {
			return sorted[index].year;
		}
	}, [param?.id]);

	// 다음 년도
	const next = useMemo(() => {
		if (!years?.length || !param?.id) return '';

		const sorted = sortBy(years, ['year']);
		const index = sorted?.findIndex((a) => a.year?.toString() === param.id?.toString()) + 1;
		if (index >= years?.length) {
			return sorted[0].year;
		} else {
			return sorted[index].year;
		}
	}, [param?.id]);

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: (dir) => {
			return `${URL.PROFIT}/year/${dir === 'next' ? next : prev}`;
		},
	});

	const onClick = (eid?: string) => {
		navigate(`${URL.PROFIT}/year/${eid}`);
	};

	return (
		<StyledProfitPage className={clsx('profit', 'per-year')} summaryData={summary} isShowScrollTop={false}>
			<Flex className={clsx('view-box', swipeClass)} direction={'column'} {...handlerSwipe}>
				{/* 헤드 */}
				<TitleNavigation sticky options={options} value={param?.id} onClick={onClick} />

				{!data?.isEmpty && (
					<Flex className='contents' direction={'column'}>
						{/* 요약 */}
						<ContentsHeader>
							<Flex direction={'column'}>
								<Flex justify={'between'}>
									<SubTitle title={ST.BUY} flex={1} />
									<Text size='sm' flex={1} align='right' text={`${toCost(data?.buyTotal)}`} />
								</Flex>
								<Flex className={clsx(data?.type)} justify={'between'}>
									<SubTitle title={ST.SELL} />
									<Text size='sm' flex={1} align='right' text={`${toCost(data?.sellTotal)}`} />
								</Flex>
								<Flex className={clsx(data?.type)} justify={'between'}>
									<SubTitle title={ST.SONIC} />
									<Text bold flex={1} align='right' className={clsx('sum', data?.type)} text={`${toCost(data?.sum)}`} />
								</Flex>
								{data?.dividend && (
									<Flex className={clsx(data?.type)} justify={'between'}>
										<SubTitle title={ST.DIVIDEND} />
										<Text
											bold
											flex={1}
											align='right'
											className={clsx('sum', 'plus')}
											text={`${toCost(data?.dividend)}`}
										/>
									</Flex>
								)}
							</Flex>
						</ContentsHeader>

						{/* 컨텐츠 */}
						<Flex className='card-list'>
							<ProfitCard data={data?.value} />
						</Flex>
					</Flex>
				)}
				{data?.isEmpty && <NoData />}
			</Flex>
		</StyledProfitPage>
	);
};
