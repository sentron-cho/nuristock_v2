import clsx from 'clsx';
import { ProfitItemType as DataType } from '../api/profit.dto';
import { StyledCard } from '../style/ProfitCardPerCode.style';
import Flex from '@entites/Flex';
import { ST } from '@shared/config/kor.lang';
import { useMemo } from 'react';
import { useProfitData } from '../hook/ProfitData.hook';
import { sortedByKey } from '@shared/libs/sort.lib';
import { ProfitCardField } from './ProfitCardField.ui';

export const ProfitCardPerCode = ({
	data,
}: {
	data?: DataType[]; // 종목별 데이터
}) => {
	const { createSumData } = useProfitData();

	// 년도별 합계 구하기
	const yearData = useMemo(() => {
		const list = createSumData(data, 'year');
		return sortedByKey(list, 'title', true);
	}, [data]);

	return (
		<StyledCard className={clsx('card')}>
			<Flex className={clsx('box')} direction='column' gap={10}>
				{/* 년도별 */}
				<ProfitCardField title={ST.PER_YEARS} className='years' data={yearData} />
			</Flex>
		</StyledCard>
	);
};
