import { FC, useMemo } from 'react';
import { ChartLegend } from '@entites/ChartLegend';
import { CHART_COLORS, ChartDataType, ColoredSlice } from '@entites/Chart.type';
import { ChartDonut } from '@entites/ChartDonut';
import { ST } from '@shared/config/kor.lang';
import { styled } from '@styles/stitches.config';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { toSemiCost } from '@shared/libs/utils.lib';

type MainboardHeaderProps = {
	data: ChartDataType[];
	height?: number;
	title?: string;
	value?: string;
	valueFormatter?: (v: number) => string;
	onClick?: (eid: string, item?: ColoredSlice) => void;
};

const DEFAULT_COLORS = Object.values(CHART_COLORS);

const StyledFlex = styled(Flex, {
	'.mainboard-header': {},
});

export const MainboardHeader: FC<MainboardHeaderProps> = ({
	data,
	title = ST.ASSET,
	value,
	onClick,
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
		<ContentsHeader className={clsx('mainboard-header')} stickyTop={0} height={240}>
			<StyledFlex height={'100%'}>
				{/* 왼쪽: 도넛 */}
				<ChartDonut
					data={withColor}
					width={'50%'}
					title={title}
					value={value}
					onClickTitle={() => onClick?.('title')}
					onClickSlice={(value) => onClick?.('slice', value)}
				/>

				{/* 오른쪽: 범례 */}
				<ChartLegend data={withColor} valueFormatter={(v) => toSemiCost(v)} onClick={(v) => onClick?.('legend', v)} />
			</StyledFlex>
		</ContentsHeader>
	);
};
