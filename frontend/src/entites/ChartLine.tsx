import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import Flex from '@entites/Flex';

const fmtKRW = (v: number) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(v);

const StyledChart = styled(Flex, {

})

export type ChartLineDataType = { year: number; withContrib: number; withoutContrib: number };

export const ChartLine = ({ data, height = 360 }: { data?: ChartLineDataType[]; height?: string | number }) => (
	<StyledChart className={clsx('chart-line')} height={height}>
		<ResponsiveContainer>
			<LineChart data={data} margin={{ top: 12, right: 24, bottom: 12, left: 0 }}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='year' tickFormatter={(v) => `${v}년`} />
				<YAxis tickFormatter={(v) => `${Math.round(v / 1_0000_0000)}억`} />
				<Tooltip formatter={(v: number) => fmtKRW(v)} labelFormatter={(l) => `${l}년`} />
				<Legend />
				<Line type='monotone' dataKey='withContrib' name='추가 투자 포함' strokeWidth={2} dot={true} />
				<Line type='monotone' dataKey='withoutContrib' name='추가 투자 없음' strokeWidth={2} dot={true} />
			</LineChart>
		</ResponsiveContainer>
	</StyledChart>
);
