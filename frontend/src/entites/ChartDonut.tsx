import { FC } from 'react';
import { Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, PieProps } from 'recharts';
import { ST } from '@shared/config/kor.lang';
import { ColoredSlice } from './Chart.type';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import Flex from './Flex';
import { Text } from './Text';

type ChartDonutProps = {
	data: ColoredSlice[]; // 상위에서 색상/percent 계산된 데이터
	height?: number | string;
	width?: number | string;
	title?: string; // 예: '총'
	value?: string; // 예: '39,400,000원'
	onClickSlice?: (value?: ColoredSlice) => void;
	onClickTitle?: () => void;
	chartProps?: PieProps;
};

const StyledBox = styled(Box, {
	'&.chart-donut': {
		position: 'relative',

		'.center-box': {
			position: 'absolute',
			left: 0,
			top: 0,
			zIndex: 1,
			height: '100%',
			width: '100%',

			'.cost': {
				fontSize: '12px',
			},
		},
	},
});

export const ChartDonut: FC<ChartDonutProps> = ({
	data,
	height = '100%',
	width = '100%',
	title = ST.ASSET,
	value,
	onClickSlice,
	onClickTitle,
	chartProps,
}) => {
	return (
		<StyledBox className={clsx('chart-donut')} sx={{ width: { xs: width, sm: width }, height }}>
			<ResponsiveContainer width='100%' height='100%'>
				<PieChart>
					<Pie
						data={data}
						dataKey='value'
						nameKey='name'
						startAngle={90}
						endAngle={-270}
						innerRadius='40%'
						outerRadius='80%'
						isAnimationActive
						labelLine={false}
						onClick={(e) => onClickSlice?.(e?.payload)}
						// label={(props: any) => {
						// 	const { percent, cx, cy, midAngle, outerRadius, index } = props;
						// 	if (percent * 100 < 6) return null; // 6% 미만 라벨 생략

						// 	const RADIAN = Math.PI / 180;
						// 	const r = outerRadius + 12;
						// 	const x = cx + r * Math.cos(-midAngle * RADIAN);
						// 	const y = cy + r * Math.sin(-midAngle * RADIAN);

						// 	return (
						// 		<text
						// 			x={x}
						// 			y={y}
						// 			fill={data[index].color}
						// 			textAnchor={x > cx ? 'start' : 'end'}
						// 			dominantBaseline='central'
						// 			style={{ fontSize: 12, fontWeight: 700 }}
						// 		>
						// 			{`${data[index].name} ${Math.round(percent * 100)}%`}
						// 		</text>
						// 	);
						// }}
						activeShape={(props: any) => <Sector {...props} outerRadius={(props.outerRadius as number) + 6} />}
						{...chartProps}
					>
						{data.map((d, i) => (
							<Cell key={`cell-${i}`} fill={d.color} />
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>

			{(title || value) && (
				<Flex className='center-box' gap={10} direction={'column'} justify={'center'} align={'center'} onClick={() => onClickTitle?.()}>
					{title && <Text bold text={title} />}
					{value && <Text className='cost' text={value} />}
				</Flex>
			)}
		</StyledBox>
	);
};
