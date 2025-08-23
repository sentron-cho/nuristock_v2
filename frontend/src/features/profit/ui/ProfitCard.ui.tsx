import Flex from '@entites/Flex';
import { ProfitItemType } from '../api/profit.dto';
import clsx from 'clsx';
import { useMemo } from 'react';
import { ST } from '@shared/config/kor.lang';
import { sortedByKey } from '@shared/libs/sort.lib';
import { useProfitData } from '../hook/ProfitData.hook';
import { ProfitCardRows } from './ProfitCardRows.ui';
import { Card } from '@entites/Card';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { URL } from '@shared/config/url.enum';

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
	const { navigate } = useCommonHook();

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

	const onClick = (item: ProfitItemType) => {
		if (viewType === 'year') {
			navigate(`${URL.PROFIT}/code/${item?.code}`);
		} else {
			navigate(`${URL.PROFIT}/year/${item?.title}`);
		}
	};

	const onClickPerDay = (item: ProfitItemType) => {
		navigate(`${URL.PROFIT}/day/${item?.title?.substring(0, 4)}`);
	};

	const onClickDividend = () => {
		if (viewType === 'year') {
			navigate(`${URL.DIVIDEND}/code`);
		} else {
			navigate(`${URL.DIVIDEND}/year`);
		}
	};

	return (
		<Card className={clsx('card')}>
			<Flex className={clsx('box border')} direction='column' gap={10}>
				{/* 종목별 */}
				{first && <ProfitCardRows title={first.title} className='names' data={first?.data} onClickItem={onClick} />}

				{/* 배당 */}
				{dividend && dividend?.length > 0 && (
					<ProfitCardRows title={ST.PER_DIVIDEND} className='dividend' data={dividend} onClickItem={onClickDividend} />
				)}

				{/* 월별 */}
				{second && (
					<ProfitCardRows title={second.title} className='months' data={second.data} onClickItem={onClickPerDay} />
				)}
			</Flex>
		</Card>
	);
};
