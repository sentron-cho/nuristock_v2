import { FC, useMemo } from 'react';
import { ChartLegend } from '@entites/ChartLegend';
import { ChartDataType, ColoredSlice } from '@entites/Chart.type';
import { ChartDonut } from '@entites/ChartDonut';
import { ST } from '@shared/config/kor.lang';
import { styled } from '@styles/stitches.config';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import clsx from 'clsx';
import Flex from '@entites/Flex';

type MainboardHeaderProps = {
	data: ChartDataType[];
	height?: number;
	centerTitle?: string;
	centerValue?: string;
	valueFormatter?: (v: number) => string;
	onSliceClick?: (s: ColoredSlice) => void;
	onLegendClick?: (s: ColoredSlice) => void;
};

const DEFAULT_COLORS = [
	'#1f77b4', // 대한항공 블루
	'#2ca02c', // 현대차 그린
	'#17becf', // 기아 청록
	'#ff7f0e', // 포스코 오렌지
	'#f1c40f', // 우리은행 옐로
	'#e377c2',
	'#7f7f7f',
	'#8c564b',
	'#9467bd',
];

const formatKRW = (v: number) => v.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) + ST.WON;

const StyledFlex = styled(Flex, {
	'.mainboard-header': {},
});

export const MainboardHeader: FC<MainboardHeaderProps> = ({
	data,
	centerTitle = ST.ASSET,
	centerValue,
	valueFormatter = formatKRW,
	onSliceClick,
	onLegendClick,
}) => {
	const total = useMemo(() => data.reduce((acc, cur) => acc + (cur.value || 0), 0), [data]);

	const withColor: ColoredSlice[] = useMemo(
		() =>
			data.map((d, i) => ({
				...d,
				color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
				label: `${(total ? (d.value / total) * 100 : 0).toFixed(1)}%`,
			})),
		[data, total]
	);

	return (
		<ContentsHeader className={clsx('mainboard-header')} stickyTop={0} height={280}>
			<StyledFlex height={'100%'}>
				{/* 왼쪽: 도넛 */}
				<ChartDonut
					data={withColor}
					width={'50%'}
					centerTitle={centerTitle}
					centerValue={centerValue}
					valueFormatter={valueFormatter}
					onSliceClick={onSliceClick}
				/>

				{/* 오른쪽: 범례 */}
				<ChartLegend data={withColor} valueFormatter={valueFormatter} onLegendClick={onLegendClick} />
			</StyledFlex>
		</ContentsHeader>
	);
};
