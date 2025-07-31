import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { styled } from '@styles/stitches.config';
import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { ProfitCard } from '@features/profit/ui/ProfitCard.ui';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import { SummaryData } from '@features/profit/config/Profit.data';
import { SubTitle } from '@entites/Title';
import clsx from 'clsx';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { ST } from '@shared/config/kor.lang';
import { useMemo } from 'react';
import dayjs from 'dayjs';

const StyledPage = styled(PageContainer, {
	'&.profit': {
		'.card-sub-title': {
			width: '100%',
			background: '$bgcolor',
			textAlign: 'center',
			height: '40px',
			lineHeight: '40px',
			position: 'sticky',
			top: '0px',
			zIndex: 10,
			justifyContent: 'space-between',
			padding: '0 10px',

			'.sum': {
				'&.plus': {
					color: '$plus',
				},

				'&.minus': {
					color: '$minus',
				},
			},
		},
	},
});

export const ProfitPageMo = () => {
	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit();

	const { summary, years, data } = useProfitData(profitData?.value, yearsData?.value);

  // 년도별 데이터 추출
	const groupedByYear = useMemo(() => {
		return data?.reduce(
			(acc, item) => {
				const year = dayjs(item.edate).format('YYYY'); // '20241104' → '2024'
				if (!acc[year]) {
					acc[year] = [];
				}
				acc[year].push(item);
				return acc;
			},
			{} as Record<string, typeof data>
		);
	}, [data]);

	// console.log({ groupedByYear });

	const onClickSummary = (item?: SummaryDataType) => {
		console.log(item);
	};

	return (
		<StyledPage className='profit' summaryData={SummaryData(summary)} onClickSummary={onClickSummary}>
			<Flex direction={'column'} gap={20}>
				{years?.map((item) => {
					const type = valueOfPlusMinus(Number(item.sum));

					return (
						<Flex direction={'column'}>
							<Flex className={clsx('card-sub-title')} width={200} gap={10} justify={'center'}>
								<SubTitle width={60} className={clsx('year')} title={`${item.year}${ST.YEAR}`} />
								<SubTitle className={clsx('sum', type)} title={`${toCost(item.sum)}`} />
							</Flex>

							<Flex className='card-list'>
								<ProfitCard data={groupedByYear?.[item?.year]} />;
							</Flex>
						</Flex>
					);
				})}
			</Flex>
		</StyledPage>
	);
};
