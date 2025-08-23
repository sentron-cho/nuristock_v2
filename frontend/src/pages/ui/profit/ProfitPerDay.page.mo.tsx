import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import clsx from 'clsx';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { useMemo } from 'react';
import { URL } from '@shared/config/url.enum';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { TitleNavigation } from '@entites/TitleNavigation';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { ProfitSummary } from '@features/profit/ui/ProfitSummary.ui';
import { useNaviByOptions } from '@shared/hooks/useOptionNavi.hook';
import { CardListWrap } from '@entites/Card';
import { RowField } from '@entites/LineRowField';
import dayjs from 'dayjs';
import { styled } from '@styles/stitches.config';
import { reverse, sortBy } from 'lodash';

const StyledFlex = styled(Flex, {
	'.contents-layer': {
		background: '$white',

		'.list-head': {
			position: 'sticky',
			width: '100%',
			background: '$gray400',
			textAlign: 'center',
			height: '40px',
			lineHeight: '40px',
			zIndex: 9,
			padding: '0 8px',
		},

		'.list-body': {
			padding: '0px 4px 12px 4px',

			'.list-row': {},
		},
	}
});

export const ProfitPerDayPageMo = () => {
	const { param, navigate } = useCommonHook();

	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit();

	const { summary, groupedByYear, dividendByYear, naviOptions, createTotal, createSumData } = useProfitData(
		yearsData?.value,
		profitData
	);

	// 데이터(년도별 투자 요약)
	const data = useMemo(() => {
		if (!groupedByYear || !param) return undefined;

		const key = param?.id as string; // 년도
		const value = groupedByYear?.[key];
		const sum = value?.map((a) => Number(a.sonic))?.reduce((a, b) => a + b, 0); // 수익금액
		const buyTotal = createTotal(value, 'sprice'); // 매수총액
		const sellTotal = createTotal(value, 'eprice'); // 매도총액
		const rate = ((sum / buyTotal) * 100).toFixed(2); // 매수 총액 대비 수익율
		const type = valueOfPlusMinus(Number(sum));
		const dividend = dividendByYear?.[key]?.map((a) => a.price)?.reduce((a, b) => a + b, 0);
		const assetTotal = value?.[0]?.asset;

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
	}, [param, groupedByYear, dividendByYear]);

	// 월별 데이터 추출
	const dataList = useMemo(() => {
		if (!groupedByYear || !param) return undefined;

		const key = param?.id as string; // 년도
		const array = groupedByYear?.[key];

		const parsed = array?.reduce(
			(acc, item) => {
				const month = dayjs(item['edate']).format('YYYYMM'); // '20241104' → '202411'
				if (!acc[month]) {
					acc[month] = [];
				}
				acc[month].push(item);
				return acc;
			},
			{} as Record<string, typeof array>
		);

		return parsed;
	}, [param, groupedByYear]);

	const titleList = useMemo(() => {
		// 월별 합계
		const key = param?.id as string; // 년도
		const array = groupedByYear?.[key];
		const list = createSumData(array, 'month');
		// const items = { title: ST.PER_YEARS, data: sortedByKey(list, 'title', true) as ProfitItemType[] };
		return list ? reverse(sortBy(Object.values(list), 'title')) : undefined;
	}, [param, groupedByYear]);

	const { next, prev } = useNaviByOptions({ options: naviOptions, value: param?.id });

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: (dir) => {
			return `${URL.PROFIT}/day/${dir === 'next' ? next?.value : prev?.value}`;
		},
	});

	const onClick = (eid?: string) => {
		navigate(`${URL.PROFIT}/day/${eid}`);
	};

	return (
		<PageContainer className={clsx('profit', 'per-year')} summaryData={summary} isShowScrollTop={false}>
			<Flex direction={'column'} flex={1}>
				{/* 헤드 */}
				<TitleNavigation sticky options={naviOptions} value={param?.id} onClick={onClick} />

				{/* 요약 */}
				{!data?.isEmpty && <ProfitSummary data={data} />}

				{/* 컨텐츠 */}
				<StyledFlex className={clsx(swipeClass)} flex={1} direction={'column'} {...handlerSwipe}>
					{!data?.isEmpty && (
						<Flex className='contents-layer' direction={'column'}>
							<CardListWrap>
								{titleList?.map((item) => {
									const { title, sonic, sonicRate } = item;
									const list = reverse(sortBy(dataList?.[item?.title?.replace('-', '') as string], ['edate']));

									return (
										<Flex direction={'column'} key={`th-${title}`}>
											<RowField
												className='list-head'
												type={valueOfPlusMinus(sonic)}
												title={dayjs(title).format('YYYY년 MM월')}
												text={`${sonicRate?.toFixed(1)}`}
												value={toCost(sonic)}
												titleProps={{ bold: true }}
												valueProps={{ bold: true }}
												suffix={{ text: '%' }}
												style={{ top: 200 }}
											/>

											<Flex className='list-body' direction={'column'}>
												{list?.map((row) => {
													return (
														<RowField
															key={`tr-${row?.rowid}`}
															className='list-row'
															type={valueOfPlusMinus(row?.sonic)}
															title={`[${dayjs(row?.edate).format('DD일')}] ${row?.name}`}
															text={`${row?.sonicRate?.toFixed(1)}`}
															value={toCost(row?.sonic)}
															valueProps={{ bold: true }}
															suffix={{ text: '%' }}
															height={30}
														/>
													);
												})}
											</Flex>
										</Flex>
									);
								})}
							</CardListWrap>
						</Flex>
					)}
				</StyledFlex>
			</Flex>
		</PageContainer>
	);
};
