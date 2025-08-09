import Flex from '@entites/Flex';
import { ProfitItemType as DataType } from '../api/profit.dto';
import clsx from 'clsx';
import { useMemo } from 'react';
import { ST } from '@shared/config/kor.lang';
import { sortedByKey } from '@shared/libs/sort.lib';
import { useProfitData } from '../hook/ProfitData.hook';
import { ProfitCardField } from './ProfitCardField.ui';
import { Card } from '@entites/Card';
import { DividendItemType } from '@features/dividend/api/dividend.dto';

export const ProfitCard = ({
	data,
	dividend,
}: {
	data?: DataType[]; // 년도별 데이터
	dividend?: DividendItemType[]; //배당 내역
}) => {
	const { createSumData } = useProfitData();

	// 종목별 합계 구하기
	const nameData = useMemo(() => {
		const list = createSumData(data, 'name');
		return sortedByKey(list, 'sonic', true) as DataType[];
	}, [data]);

	// 월별 합계 구하기
	const monthData = useMemo(() => {
		const list = createSumData(data, 'month');
		return sortedByKey(list, 'title', true) as DataType[];
	}, [data]);

	console.log({ dividend });

	const dividendData = useMemo(() => {
		const list = dividend?.reduce(
			(acc, curr) => {
				let key = (curr as Record<string, any>)['name'] as string;
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

		return sortedByKey(list, 'price', true)?.map((a) => ({ title: a?.title, sonic: a?.price })) as DataType[];
	}, [dividend]);

	// const onClick = (eid: string) => {
	// 	navigate(`${URL.PROFIT}/${eid}`);
	// };

	return (
		<Card className={clsx('card')}>
			<Flex className={clsx('box border')} direction='column' gap={10}>
				{/* 종목별 */}
				<ProfitCardField title={ST.PER_CODES} className='names' data={nameData} />

				{/* 월별 */}
				<ProfitCardField title={ST.PER_MONTHS} className='months' data={monthData} />

				{/* 배당 */}
				{dividendData?.length > 0 && (
					<ProfitCardField title={ST.PER_DIVIDEND} className='dividend' data={dividendData} />
				)}
			</Flex>
		</Card>
	);
};
