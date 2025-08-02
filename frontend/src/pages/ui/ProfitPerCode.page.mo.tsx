import { useSelectProfit } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import { SubTitle } from '@entites/Title';
import clsx from 'clsx';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { useMemo } from 'react';
import { ProfitCardPerCode } from '@features/profit/ui/ProfitCardPerCode.ui';
import { sortedByKey } from '@shared/libs/sort.lib';
import { Text } from '@entites/Text';
import { StyledProfitPage } from '@page/style/Profit.style';

export const ProfitPerCodeMo = () => {
	const { data: profitData } = useSelectProfit();

	const { summary, data, createSumData, groupedByName, createTotal } = useProfitData(profitData?.value);

	// 종목별 합계 구하기(손익 내림차순)
	const sortedList = useMemo(() => {
		return sortedByKey(createSumData(data, 'name'), 'sonic', true);
	}, [data]);

	return (
		<StyledProfitPage className={clsx('profit', 'per-code')} summaryData={summary}>
			<Flex className='view-box' direction={'column'} gap={20}>
				{sortedList?.map((item) => {
					const { name, sonic } = item;
					const data = groupedByName?.[name];
					const type = valueOfPlusMinus(sonic);
					const total = createTotal(data);
					const rate = ((sonic / total) * 100).toFixed(2);

					return (
						<Flex direction={'column'}>
							<Flex className={clsx('card-sub-title')} width={200} gap={10} justify={'center'}>
								<SubTitle flex={1} align='left' className={clsx('year')} title={`${name}`} />
								<Text
									size='xs'
									flex={2}
									align='center'
									className={clsx('total')}
									text={`${toCost(total)} [${rate}%]`}
								/>
								<Text bold flex={1} align='right' className={clsx('sum', type)} text={`${toCost(sonic)}`} />
							</Flex>

							<Flex className='card-list'>
								<ProfitCardPerCode data={data} />
							</Flex>
						</Flex>
					);
				})}
			</Flex>
		</StyledProfitPage>
	);
};
