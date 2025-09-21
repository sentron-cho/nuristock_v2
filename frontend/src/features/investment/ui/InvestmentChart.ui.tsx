import Flex from '@entites/Flex';
import { Title } from '@entites/Title';
import { InvestmentItemType } from '../api/investment.dto';
import dayjs from 'dayjs';
import { ST } from '@shared/config/kor.lang';
import { ChartLineBox } from '@entites/ChartLine';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from '@entites/Chart.type';
import { toShortCostString } from '@shared/libs/utils.lib';
import { sortBy } from 'lodash';
import { useMemo } from 'react';

export const InvestmentChart = ({ data }: { data?: InvestmentItemType[] }) => {
	const chartData = useMemo(() => {
		if (!data) return undefined;

		const sorted = sortBy(data, ['sdate']);

		const parsed = sorted?.map((a, index) => {
			let item = { equity: a?.equity, sdate: a.sdate, equityRate: 1 };
			item['equityRate'] = Number(
				index === 0 ? 1 : (Number(a.equity) / Number(sorted?.[index - 1]?.equity || 0)).toFixed(2)
      );
      
      // 최저치 유지
      if (item?.equityRate < 1) {
        item['equityRate'] = 1.08;
      }

			return item;
		});

		const items = parsed?.map((a, index) => {
			if (index === 0) {
				return { ...a, equityExp: a?.equity };
			} else {
				// const temps = parsed.map((b, index) => Number(b.equityRate) + Number(parsed?.[index - 1]?.equityRate || 0));
				const filtered = parsed
					?.slice(1, parsed?.length)
					?.filter((b) => Number(b.sdate) < Number(a.sdate))
					?.map((a) => a?.equityRate);
				const equityRate = filtered?.length
					? Number((filtered?.reduce((c, d) => Number(c) + Number(d), 0) / filtered?.length).toFixed(2))
					: 1.08;
				const equityExp = Number(parsed?.[index - 1]?.equity) * equityRate;

				return { ...a, equityExp: equityExp };
			}
		});

		return items;
	}, [data]);

	const domain = useMemo(() => {
		if (!chartData) return [];
		const items = sortBy(chartData, ['equityExp']);
		return [Number(items?.[0]?.equityExp) * 0.8, Number(items?.[chartData.length - 1]?.equityExp) * 1.1];
	}, [chartData]);

	return (
		<Flex className='invest-chart' direction={'column'} gap={10}>
			<Title title={ST.CAPITAL_VALUE} />
			<Flex className='box' direction={'column'} gap={10}>
				<ChartLineBox height={200}>
					<ResponsiveContainer>
						<LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 30 }}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='sdate' tickFormatter={(v) => `${dayjs(v).format('YY')}${ST.YEAR}`} />
							<YAxis
								tickFormatter={(v) => {
									return `${toShortCostString(v)}`;
								}}
								domain={domain}
								startOffset={50000000000000}
							/>
							<Tooltip
								formatter={(v: number) => toShortCostString(v)}
								labelFormatter={(v) => `${dayjs(v).format('YYYY')}`}
							/>
							<Legend />
							<Line
								type='monotone'
								dataKey='equity'
								name={ST.CAPITAL}
								strokeWidth={2}
								dot={true}
								stroke={'#0e008bc9'}
							/>
							<Line
								type='monotone'
								dataKey='equityExp'
								name={ST.CAPITAL_EXP}
								strokeWidth={2}
								dot={true}
								stroke={CHART_COLORS.RED}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartLineBox>
			</Flex>
		</Flex>
	);
};
