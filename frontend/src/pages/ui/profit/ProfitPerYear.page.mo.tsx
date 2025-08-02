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

export const ProfitPerYearPageMo = () => {
	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit();

	const { summary, years, groupedByYear, createTotal } = useProfitData(profitData?.value, yearsData?.value);

	return (
		<StyledProfitPage className={clsx('profit', 'per-year')} summaryData={summary}>
			<Flex className='view-box' direction={'column'} gap={20}>
				{years?.map((item) => {
					const type = valueOfPlusMinus(Number(item.sum));
					const data = groupedByYear?.[item?.year];
					const total = createTotal(data);
					const rate = ((item.sum / total) * 100).toFixed(2);

					return (
						<Flex direction={'column'}>
							<Flex className={clsx('card-sub-title')} gap={10} justify={'center'}>
								<SubTitle flex={1} align='left' className={clsx('year')} title={`${item.year}${ST.YEAR}`} />
								<Text
									size='xs'
									flex={2}
									align='center'
									className={clsx('total')}
									text={`${toCost(total)} [${rate}%]`}
								/>
								<Text bold flex={1} align='right' className={clsx('sum', type)} text={`${toCost(item.sum)}`} />
							</Flex>

							<Flex className='card-list'>
								<ProfitCard data={data} />
							</Flex>
						</Flex>
					);
				})}
			</Flex>
		</StyledProfitPage>
	);
};
