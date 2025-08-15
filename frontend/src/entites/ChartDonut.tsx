import { FC } from 'react';
import { Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
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
	centerTitle?: string; // 예: '총'
	centerValue?: string; // 예: '39,400,000원'
	valueFormatter?: (v: number) => string;
	onSliceClick?: (s: ColoredSlice) => void;
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
      }
      
    }
  }
});

export const ChartDonut: FC<ChartDonutProps> = ({
	data,
	height = '100%',
	width = '100%',
	centerTitle = ST.ASSET,
	centerValue,
	valueFormatter = (v) => v.toLocaleString('ko-KR') + ST.WON,
	onSliceClick,
}) => {
	return (
		<StyledBox className={clsx('chart-donut')} sx={{ width: { xs: width, sm: width }, height }}>
			<ResponsiveContainer width='100%' height='100%'>
				<PieChart>
					<Tooltip formatter={(v: any, _n: any, item: any) => [valueFormatter(Number(v)), item?.payload?.name]} />
					<Pie
						data={data}
						dataKey='value'
						nameKey='name'
						startAngle={90}
						endAngle={-270}
						innerRadius='60%'
						outerRadius='80%'
						isAnimationActive
						labelLine={false}
						onClick={(e) => e && onSliceClick?.(e.payload)}
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
					>
						{data.map((d, i) => (
							<Cell key={`cell-${i}`} fill={d.color} />
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>

			{centerValue && (
				<Flex className='center-box' gap={10} direction={'column'} justify={'center'} align={'center'}>
          <Text bold text={centerTitle} />						
          <Text className='cost' text={centerValue} />
				</Flex>
			)}
		</StyledBox>
	);
};
