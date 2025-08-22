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
	isClick?: boolean;
};

const StyledBox = styled(Box, {
	'&.chart-donut': {
		position: 'relative',

		'.no-click': {
			pointerEvents: 'none' /* 모든 클릭 막음 */,
		},

		'.center-box': {
			position: 'absolute',
			left: '50%',
			top: '50%',
			zIndex: 1,
			height: 'fit-content',
			width: 'fit-content',
			transform: 'translate(-50%, -50%)',

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
	isClick = false,
}) => {
	return (
		<StyledBox
			className={clsx('chart-donut')}
			sx={{ width: { xs: width, sm: width }, height }}
		>
			<ResponsiveContainer width='100%' height='100%'>
				<PieChart
					className={clsx({ 'no-click': !isClick })}
				>
					<Pie
						data={data}
						dataKey='value'
						nameKey='name'
						startAngle={90}
						endAngle={-270}
						innerRadius='40%'
						outerRadius='80%'
						isAnimationActive={false}
						labelLine={false}
						onClick={(e) => onClickSlice?.(e?.payload)}
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
				<Flex
					className='center-box'
					gap={10}
					direction={'column'}
					justify={'center'}
					align={'center'}
					onClick={() => onClickTitle?.()}
				>
					{title && <Text bold text={title} />}
					{value && <Text className='cost' text={value} />}
				</Flex>
			)}
		</StyledBox>
	);
};
