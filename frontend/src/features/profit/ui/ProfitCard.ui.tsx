import Flex from '@entites/Flex';
import { ProfitItemType } from '../api/profit.dto';
import clsx from 'clsx';
import { useMemo } from 'react';
import { ST } from '@shared/config/kor.lang';
import { sortedByKey } from '@shared/libs/sort.lib';
import { useProfitData } from '../hook/ProfitData.hook';
import { ProfitCardField } from './ProfitCardField.ui';
import { Card } from '@entites/Card';

export const ProfitCard = ({
	viewType = 'year',
	data,
	dividend,
}: {
	viewType?: 'year' | 'code';
	data?: ProfitItemType[]; // 년도별 데이터
	dividend?: ProfitItemType[]; //배당 내역
}) => {
	const { createSumData } = useProfitData();

	const first = useMemo(() => {
		if (viewType === 'year') {
			// 종목별 합계 구하기
			const list = createSumData(data, 'name');
			return { title: ST.PER_CODES, data: sortedByKey(list, 'sonic', true) as ProfitItemType[] };
		} else {
			// 월별 합계
			const list = createSumData(data, 'year');
			return { title: ST.PER_YEARS, data: sortedByKey(list, 'title', true) as ProfitItemType[] };
		}
	}, [data]);

	// 월별 합계 구하기
	const second = useMemo(() => {
		if (viewType === 'year') {
			const list = createSumData(data, 'month');
			return { title: ST.PER_MONTHS, data: sortedByKey(list, 'title', true) as ProfitItemType[] };
		} else {
			const list = createSumData(data, 'month');
			return { title: ST.PER_MONTHS, data: sortedByKey(list, 'title', true) as ProfitItemType[] };
		}
	}, [data]);

	return (
		<Card className={clsx('card')}>
			<Flex className={clsx('box border')} direction='column' gap={10}>
				{/* 종목별 */}
				{first && <ProfitCardField title={first.title} className='names' data={first?.data} />}

				{/* 배당 */}
				{dividend && dividend?.length > 0 && (
					<ProfitCardField title={ST.PER_DIVIDEND} className='dividend' data={dividend} />
				)}

				{/* 월별 */}
				{second && <ProfitCardField title={second.title} className='months' data={second.data} />}
			</Flex>
		</Card>
	);
};
