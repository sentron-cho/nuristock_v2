import Flex from '@entites/Flex';
import { ProfitItemType as DataType } from '../api/profit.dto';
import clsx from 'clsx';
import { useMemo } from 'react';
import { ST } from '@shared/config/kor.lang';
import { sortedByKey } from '@shared/libs/sort.lib';
import { useProfitData } from '../hook/ProfitData.hook';
import { ProfitCardField } from './ProfitCardField.ui';
import { Card } from '@entites/Card';

export const ProfitCard = ({
	data,
}: {
	data?: DataType[]; // 년도별 데이터
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
			</Flex>
		</Card>
	);
};
